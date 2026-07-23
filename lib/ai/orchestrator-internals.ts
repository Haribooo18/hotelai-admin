import { estimateCostUsd, mergeTokenUsage, EMPTY_TOKEN_USAGE } from "./cost";
import { resolveProviderOptions } from "./config";
import { resolveToolTimeoutMs } from "./guardrails";
import { hotelRateLimiter } from "./rate-limiter";
import { opsMetrics } from "@/lib/ops/metrics";
import { patchRequestContext } from "@/lib/ops/request-context";
import type { OpenAIProvider } from "./providers/openai";
import { getAIServices } from "./container";
import type { AIProvider, AIRequest, AIResponse } from "./types";
import type { ToolContext } from "./tools";
import { withTimeout } from "./retry";
import { resolveConversationLanguage } from "./language";
import {
  resolveGuestForConversation,
  logAIActionTool,
} from "./orchestrator-persistence";
import type { AITokenUsage } from "@/types/ai-settings";

import type { OrchestratorInput } from "./orchestrator";

const FALLBACK_CONTENT =
  "К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.";

const ANTI_HALLUCINATION = [
  "НИКОГДА не выдумывайте цены, политики, услуги или наличие номеров.",
  "Отвечайте ТОЛЬКО на основе базы знаний, результатов инструментов или явных фактов из контекста.",
  "Если информации нет в базе знаний и инструменты не дали ответа — скажите: «К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.»",
  "Не ссылайтесь на статьи, которых нет в предоставленной базе знаний.",
];

export type ResolvedProviderOptions = ReturnType<typeof resolveProviderOptions>;

export type CompletionLoopResult = {
  content: string;
  usage: AITokenUsage;
  costUsd: number;
  toolRounds: number;
  requestId: string;
  retryCount: number;
  finishReason?: string;
};

export function beginAIContext(input: OrchestratorInput, provider: AIProvider): void {
  patchRequestContext({
    hotelId: input.hotel.id,
    conversationId: input.conversation.id,
    provider: provider.name,
  });
  opsMetrics.recordAIRequest(provider.name);
}

export function validatePreflight(
  input: OrchestratorInput,
  provider: AIProvider
): void {
  if (provider.name === "unconfigured") {
    throw new Error("AI-провайдер не настроен. Добавьте OPENAI_API_KEY.");
  }

  if (!input.settings.enabled) {
    throw new Error("AI-ресепшн отключён в настройках отеля.");
  }

  if (
    input.conversation.status === "handoff_requested" ||
    input.conversation.status === "assigned" ||
    input.conversation.status === "resolved" ||
    input.conversation.status === "archived"
  ) {
    throw new Error(
      "AI отключён для диалога, переданного сотруднику или закрытого.",
    );
  }

  const rate = hotelRateLimiter.check(
    input.hotel.id,
    input.settings.rate_limit_per_minute,
    {
      endpoint: "ai.orchestrator",
      hotelId: input.hotel.id,
      conversationId: input.conversation.id,
      reason: "hotel_ai_rate_limit",
    }
  );
  if (!rate.allowed) {
    throw new Error(
      `Превышен лимит запросов. Повторите через ${Math.ceil(rate.retryAfterMs / 1000)} с.`
    );
  }
}

export async function prepareAIRequest(
  input: OrchestratorInput,
  opts: ResolvedProviderOptions
): Promise<AIRequest> {
  const services = getAIServices();
  const guest = await resolveGuestForConversation(input.hotel.id, input.conversation);

  const aiRequest = await services.promptAssembler.build({
    hotel: input.hotel,
    conversation: input.conversation,
    messages: input.messages,
    guest,
    retrievalQuery: input.retrievalQuery,
    language: resolveConversationLanguage(input.messages, opts.language),
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

  return aiRequest;
}

export async function executeCompletionLoop(params: {
  input: OrchestratorInput;
  aiRequest: AIRequest;
  opts: ResolvedProviderOptions;
  initialResponse: AIResponse | null;
  signal?: AbortSignal;
}): Promise<CompletionLoopResult> {
  const { input, aiRequest, opts, initialResponse, signal } = params;
  const provider = getAIServices().provider as OpenAIProvider;

  let usage = { ...EMPTY_TOKEN_USAGE };
  let totalCost = 0;
  let toolRounds = 0;
  let requestId = "";
  let retryCount = 0;
  let finishReason: string | undefined;

  let response: AIResponse;

  if (initialResponse) {
    response = initialResponse;
    usage = mergeTokenUsage(
      usage,
      (initialResponse.metadata.usage as AITokenUsage) ?? EMPTY_TOKEN_USAGE
    );
    totalCost += estimateCostUsd(
      String(initialResponse.metadata.model ?? opts.model),
      (initialResponse.metadata.usage as AITokenUsage) ?? EMPTY_TOKEN_USAGE
    );
    requestId = String(initialResponse.metadata.request_id ?? "");
    retryCount += Number(initialResponse.metadata.retry_count ?? 0);
    finishReason = initialResponse.metadata.finish_reason as string | undefined;
  } else {
    response = await provider.complete(aiRequest, {
      model: opts.model,
      maxOutputTokens: opts.maxOutputTokens,
      temperature: opts.temperature,
      topP: opts.topP,
      toolChoice: opts.toolChoice,
      timeoutMs: opts.timeoutMs,
      maxRetries: opts.maxRetries,
      signal,
    });

    usage = mergeTokenUsage(usage, response.metadata.usage as AITokenUsage);
    totalCost += estimateCostUsd(
      String(response.metadata.model ?? opts.model),
      response.metadata.usage as AITokenUsage
    );
    requestId = String(response.metadata.request_id ?? "");
    retryCount += Number(response.metadata.retry_count ?? 0);
    finishReason = response.metadata.finish_reason as string | undefined;
  }

  while (
    response.toolCalls.length > 0 &&
    toolRounds < input.settings.max_tool_rounds
  ) {
    if (signal?.aborted) {
      throw new Error("Запрос отменён");
    }

    const toolOutputs = await executeTools(
      response,
      aiRequest,
      input.conversation.id,
      resolveToolTimeoutMs(input.settings),
      signal
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

    const previousResponseId = String(response.metadata.request_id ?? "");
    if (!previousResponseId) {
      throw new Error("AI provider did not return a response ID for tool continuation");
    }

    response = await provider.completeWithToolOutputs(
      aiRequest,
      previousResponseId,
      toolOutputs,
      {
        model: opts.model,
        maxOutputTokens: opts.maxOutputTokens,
        temperature: opts.temperature,
        topP: opts.topP,
        toolChoice: opts.toolChoice,
        timeoutMs: opts.timeoutMs,
        maxRetries: opts.maxRetries,
        signal,
      }
    );

    usage = mergeTokenUsage(usage, response.metadata.usage as AITokenUsage);
    totalCost += estimateCostUsd(
      String(response.metadata.model ?? opts.model),
      response.metadata.usage as AITokenUsage
    );
    requestId = String(response.metadata.request_id ?? requestId);
    retryCount += Number(response.metadata.retry_count ?? 0);
    finishReason = response.metadata.finish_reason as string | undefined;
  }

  if (response.toolCalls.length > 0) {
    throw new Error(
      `AI exceeded the maximum number of tool rounds (${input.settings.max_tool_rounds})`
    );
  }

  const content = response.content?.trim() || FALLBACK_CONTENT;

  return {
    content,
    usage,
    costUsd: totalCost,
    toolRounds,
    requestId,
    retryCount,
    finishReason,
  };
}

export async function executeTools(
  response: AIResponse,
  request: AIRequest,
  conversationId: string,
  toolTimeoutMs: number,
  signal?: AbortSignal
) {
  const { toolExecutor } = getAIServices();
  const ctx: ToolContext = {
    hotelId: request.hotelId,
    conversationId,
    request,
  };

  const outputs: { call_id: string; output: string }[] = [];

  for (const call of response.toolCalls) {
    const toolStart = Date.now();
    const result = await withTimeout(
      toolExecutor.execute(call.name, ctx, call.arguments),
      toolTimeoutMs,
      signal
    );
    opsMetrics.recordToolExecution(
      call.name,
      Date.now() - toolStart,
      result.ok
    );
    outputs.push({
      call_id: call.id,
      output: JSON.stringify(
        result.ok ? result.result.output : { error: result.error }
      ),
    });
  }

  return outputs;
}
