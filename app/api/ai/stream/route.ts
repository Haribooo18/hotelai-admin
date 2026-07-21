import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import {
  AuthenticationError,
  ValidationError,
} from "@/lib/ops/errors";
import { normalizeError } from "@/lib/ops/errors";
import { aiRespondSchema } from "@/lib/validations/ai-settings";
import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import { readJsonBody } from "@/lib/http/json-body";

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.ai",
      operation: "stream",
      endpoint: "/api/ai/stream",
      gracefulAiFailure: true,
    },
    async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new AuthenticationError();
      }

      const hotelId = await getCurrentHotelId();
      bindApiContext({ userId: user.id, hotelId, provider: "openai" });

      const body = await readJsonBody(request, { maxBytes: 8 * 1024 });

      const parsed = aiRespondSchema.safeParse(body);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues[0]?.message ?? "Некорректные данные"
        );
      }

      bindApiContext({ conversationId: parsed.data.conversation_id });

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          const send = (data: unknown) => {
            if (request.signal.aborted) return;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          };

          try {
            for await (const event of aiOrchestrator.runStream({
              conversationId: parsed.data.conversation_id,
              signal: request.signal,
            })) {
              if (request.signal.aborted) return;
              send(event);
              if (event.type === "done") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            }
          } catch (err) {
            if (request.signal.aborted) return;

            const normalized = normalizeError(err);
            if (normalized.code === "PROVIDER_ERROR") {
              send({
                type: "error",
                message:
                  "AI-сервис временно недоступен. Попробуйте позже или свяжитесь с ресепшном.",
                unavailable: true,
              });
              return;
            }

            send({
              type: "error",
              message: "Не удалось обработать запрос. Попробуйте позже.",
            });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Content-Type-Options": "nosniff",
          "X-Accel-Buffering": "no",
        },
      });
    }
  );
}
