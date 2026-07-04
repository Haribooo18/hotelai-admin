import { getAIServices } from "@/lib/ai";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { resolveProviderOptions } from "@/lib/ai/config";
import { getConversation, getMessages } from "@/lib/services/ai.service";
import { getHotelAISettings } from "@/lib/services/ai-settings.service";
import { getCurrentHotel, getCurrentHotelId } from "@/lib/tenant";
import { aiRespondSchema } from "@/lib/validations/ai-settings";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Не авторизован" }), {
      status: 401,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Некорректный JSON" }), {
      status: 400,
    });
  }

  const parsed = aiRespondSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: parsed.error.issues[0]?.message ?? "Некорректные данные",
      }),
      { status: 400 }
    );
  }

  const conversationId = parsed.data.conversation_id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        if (request.signal.aborted) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      const cleanupTyping = async () => {
        try {
          const hotelId = await getCurrentHotelId();
          await supabase
            .from("conversations")
            .update({ is_ai_typing: false })
            .eq("id", conversationId)
            .eq("hotel_id", hotelId);
        } catch {
          // ignore cleanup errors
        }
      };

      try {
        if (request.signal.aborted) return;

        send({ type: "status", status: "ai_answering" });

        const hotelId = await getCurrentHotelId();
        await supabase
          .from("conversations")
          .update({ is_ai_typing: true, status: "ai_answering" })
          .eq("id", conversationId)
          .eq("hotel_id", hotelId);

        const [hotel, conversation, messages, settings] = await Promise.all([
          getCurrentHotel(),
          getConversation(conversationId),
          getMessages(conversationId),
          getHotelAISettings(),
        ]);

        if (!conversation) throw new Error("Диалог не найден");

        const services = getAIServices();
        const provider = services.provider;
        const opts = resolveProviderOptions(settings);

        const aiRequest = await services.promptAssembler.build({
          hotel,
          conversation,
          messages,
          language: opts.language,
        });

        let fullText = "";
        let aborted = false;

        if (provider.stream) {
          for await (const event of provider.stream(aiRequest, {
            model: opts.model,
            maxOutputTokens: opts.maxOutputTokens,
            temperature: opts.temperature,
            topP: opts.topP,
            toolChoice: opts.toolChoice,
            timeoutMs: opts.timeoutMs,
            maxRetries: opts.maxRetries,
            signal: request.signal,
          })) {
            if (request.signal.aborted) {
              aborted = true;
              break;
            }

            if (event.type === "text_delta") {
              fullText += event.delta;
              send({ type: "text_delta", delta: event.delta });
            }

            if (event.type === "completed" && event.response.toolCalls.length > 0) {
              if (request.signal.aborted) {
                aborted = true;
                break;
              }

              send({ type: "status", status: "tool_calls" });
              const result = await aiOrchestrator.run({
                hotel,
                conversation,
                messages,
                settings,
                signal: request.signal,
              });
              fullText = result.content;
              send({ type: "text_final", content: result.content });
            }
          }
        }

        if (request.signal.aborted || aborted) {
          await cleanupTyping();
          return;
        }

        if (!fullText) {
          const result = await aiOrchestrator.run({
            hotel,
            conversation,
            messages,
            settings,
            signal: request.signal,
          });
          fullText = result.content;
          send({ type: "text_final", content: result.content });
        }

        if (request.signal.aborted) {
          await cleanupTyping();
          return;
        }

        const { data: msg, error: msgErr } = await supabase
          .from("messages")
          .insert({
            hotel_id: hotelId,
            conversation_id: conversationId,
            role: "ai",
            body: fullText,
            metadata: { provider: "openai", streamed: true },
          })
          .select("id, created_at")
          .single();

        if (msgErr) throw msgErr;

        await supabase
          .from("conversations")
          .update({
            status: "waiting_guest",
            is_ai_typing: false,
            last_message_preview: fullText.slice(0, 200),
            last_message_at: msg.created_at,
          })
          .eq("id", conversationId)
          .eq("hotel_id", hotelId);

        send({ type: "done", messageId: msg.id });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        if (request.signal.aborted) {
          await cleanupTyping();
          return;
        }

        const message = err instanceof Error ? err.message : "Ошибка AI";
        send({ type: "error", message });
        await cleanupTyping();
      } finally {
        controller.close();
      }
    },
    cancel() {
      // Client disconnected — request.signal aborts provider loops.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
