import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { AITokenUsage } from "@/types/ai-settings";

import type { HotelAISettings } from "@/types/ai-settings";

import { estimateCostUsd, mergeTokenUsage, EMPTY_TOKEN_USAGE } from "./cost";
import { getOpenAIApiKey, resolveProviderOptions } from "./config";
import { logAIObservability } from "./observability";
import { hotelRateLimiter } from "./rate-limiter";
import type { OpenAIProvider } from "./providers/openai";
import { getAIServices } from "./index";
import type { AIRequest, AIResponse } from "./types";
import type { ToolContext } from "./tools";

export type OrchestratorInput = {
  hotel: { id: string; name: string };
  conversation: Conversation;
  messages: Message[];
  settings: HotelAISettings;
  retrievalQuery?: string;
  stream?: boolean;
};

export type OrchestratorResult = {
  content: string;
  messageId: string | null;
  usage: AITokenUsage;
  costUsd: number;
  model: string;
  toolRounds: number;
};

const ANTI_HALLUCINATION = [
  "НИКОГДА не выдумывайте цены, политики, услуги или наличие номеров.",
  "Отвечайте ТОЛЬКО на основе базы знаний, результатов инструментов или явных фактов из контекста.",
  "Если информации нет в базе знаний и инструменты не дали ответа — скажите: «К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.»",
  "Не ссылайтесь на статьи, которых нет в предоставленной базе знаний.",
];

export class AIOrchestrator {
  async run(input: OrchestratorInput): Promise<OrchestratorResult> {
    const services = getAIServices();
    const provider = services.provider;

    if (provider.name === "unconfigured") {
      throw new Error("AI-провайдер не настроен. Добавьте OPENAI_API_KEY.");
    }

    if (!input.settings.enabled) {
      throw new Error("AI-ресепшн отключён в настройках отеля.");
    }

    const rate = hotelRateLimiter.check(
      input.hotel.id,
      input.settings.rate_limit_per_minute
    );
    if (!rate.allowed) {
      throw new Error(
        `Превышен лимит запросов. Повторите через ${Math.ceil(rate.retryAfterMs / 1000)} с.`
      );
    }

    const opts = resolveProviderOptions(input.settings);
    const start = Date.now();

    const aiRequest = await services.promptAssembler.build({
      hotel: input.hotel,
      conversation: input.conversation,
      messages: input.messages,
      retrievalQuery: input.retrievalQuery,
      instructions: [
        ...ANTI_HALLUCINATION,
        ...(input.settings.extra_instructions
          ? [input.settings.extra_instructions]
          : []),
      ],
    });

    if (aiRequest.knowledgeSnippets.length === 0) {
      aiRequest.systemPrompt +=
        "\n\n# Внимание\nБаза знаний пуста для этого запроса. Не отвечайте на вопросы о политиках, ценах и услугах без вызова инструментов. Если инструменты не помогают — сообщите, что информация недоступна.";
    }

    const actionId = await logAIActionStart({
      hotelId: input.hotel.id,
      conversationId: input.conversation.id,
      request: aiRequest,
      model: opts.model,
    });

    await logAIObservability({
      hotelId: input.hotel.id,
      level: "info",
      event: "ai.completion.start",
      conversationId: input.conversation.id,
      payload: { model: opts.model, actionId },
    });

    let usage = { ...EMPTY_TOKEN_USAGE };
    let totalCost = 0;
    let toolRounds = 0;

    try {
      const openai = provider as OpenAIProvider;

      let response = await openai.complete(aiRequest, {
        model: opts.model,
        maxOutputTokens: opts.maxOutputTokens,
        temperature: opts.temperature,
        timeoutMs: opts.timeoutMs,
        maxRetries: opts.maxRetries,
      });

      usage = mergeTokenUsage(usage, response.metadata.usage as AITokenUsage);
      totalCost += estimateCostUsd(
        String(response.metadata.model ?? opts.model),
        response.metadata.usage as AITokenUsage
      );

      while (
        response.toolCalls.length > 0 &&
        toolRounds < input.settings.max_tool_rounds
      ) {
        const toolOutputs = await this.executeTools(
          response,
          aiRequest,
          input.conversation.id
        );

        for (const call of response.toolCalls) {
          const raw = toolOutputs.find((t) => t.call_id === call.id)?.output;
          let parsed: Record<string, unknown> = {};
          try {
            parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
          } catch {
            parsed = { raw };
          }
          await logAIActionTool({
            hotelId: input.hotel.id,
            conversationId: input.conversation.id,
            toolName: call.name,
            input: call.arguments,
            output: parsed,
            model: opts.model,
          });
        }

        toolRounds++;

        response = await openai.completeWithToolOutputs(aiRequest, toolOutputs, {
          model: opts.model,
          maxOutputTokens: opts.maxOutputTokens,
          temperature: opts.temperature,
          timeoutMs: opts.timeoutMs,
          maxRetries: opts.maxRetries,
        });

        usage = mergeTokenUsage(usage, response.metadata.usage as AITokenUsage);
        totalCost += estimateCostUsd(
          String(response.metadata.model ?? opts.model),
          response.metadata.usage as AITokenUsage
        );
      }

      const content =
        response.content?.trim() ||
        "К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.";

      const durationMs = Date.now() - start;

      await logAIActionComplete({
        actionId,
        output: { content, usage, toolRounds },
        model: opts.model,
        usage,
        costUsd: totalCost,
        durationMs,
        requestId: String(response.metadata.request_id ?? ""),
      });

      await logAIObservability({
        hotelId: input.hotel.id,
        level: "info",
        event: "ai.completion.done",
        conversationId: input.conversation.id,
        payload: {
          durationMs,
          usage,
          costUsd: totalCost,
          toolRounds,
        },
      });

      return {
        content,
        messageId: null,
        usage,
        costUsd: totalCost,
        model: opts.model,
        toolRounds,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка AI";
      await logAIActionFailed({ actionId, errorMessage: message });
      await logAIObservability({
        hotelId: input.hotel.id,
        level: "error",
        event: "ai.completion.failed",
        conversationId: input.conversation.id,
        payload: { error: message },
      });
      throw err;
    }
  }

  private async executeTools(
    response: AIResponse,
    request: AIRequest,
    conversationId: string
  ) {
    const { toolExecutor } = getAIServices();
    const ctx: ToolContext = {
      hotelId: request.hotelId,
      conversationId,
      request,
    };

    const outputs: { call_id: string; output: string }[] = [];

    for (const call of response.toolCalls) {
      const result = await toolExecutor.execute(call.name, ctx, call.arguments);
      outputs.push({
        call_id: call.id,
        output: JSON.stringify(
          result.ok
            ? result.result.output
            : { error: result.error }
        ),
      });
    }

    return outputs;
  }
}

export const aiOrchestrator = new AIOrchestrator();

async function logAIActionStart(input: {
  hotelId: string;
  conversationId: string;
  request: AIRequest;
  model: string;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_actions")
    .insert({
      hotel_id: input.hotelId,
      conversation_id: input.conversationId,
      action_type: "completion",
      tool_name: null,
      input: {
        system_prompt_length: input.request.systemPrompt.length,
        knowledge_count: input.request.knowledgeSnippets.length,
        message_count: input.request.messages.length,
      },
      status: "pending",
      model: input.model,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

async function logAIActionComplete(input: {
  actionId: string;
  output: Record<string, unknown>;
  model: string;
  usage: AITokenUsage;
  costUsd: number;
  durationMs: number;
  requestId: string;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase
    .from("ai_actions")
    .update({
      status: "completed",
      output: input.output,
      model: input.model,
      token_usage: input.usage,
      cost_usd: input.costUsd,
      duration_ms: input.durationMs,
      request_id: input.requestId,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId);
}

async function logAIActionFailed(input: {
  actionId: string;
  errorMessage: string;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase
    .from("ai_actions")
    .update({
      status: "failed",
      error_message: input.errorMessage,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId);
}

async function logAIActionTool(input: {
  hotelId: string;
  conversationId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  model: string;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase.from("ai_actions").insert({
    hotel_id: input.hotelId,
    conversation_id: input.conversationId,
    action_type: "tool_call",
    tool_name: input.toolName,
    input: input.input,
    output: input.output,
    status: "completed",
    model: input.model,
    completed_at: new Date().toISOString(),
  });
}
