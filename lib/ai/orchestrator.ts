import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { AITokenUsage } from "@/types/ai-settings";

import type { HotelAISettings } from "@/types/ai-settings";

import { estimateCostUsd, mergeTokenUsage, EMPTY_TOKEN_USAGE } from "./cost";
import { resolveProviderOptions } from "./config";
import {
  assertContextGuardrails,
  assertConversationGuardrails,
  resolveConversationTimeoutMs,
  resolveToolTimeoutMs,
} from "./guardrails";
import { CurrentPromptVersion } from "./prompt-version";
import { logAICompletionMetrics, logAIObservability } from "./observability";
import { hotelRateLimiter } from "./rate-limiter";
import { opsLogger } from "@/lib/ops/logger";
import { opsMetrics } from "@/lib/ops/metrics";
import { patchRequestContext } from "@/lib/ops/request-context";
import type { OpenAIProvider } from "./providers/openai";
import { getAIServices } from "./container";
import type { AIProvider } from "./types";
import type { AIRequest, AIResponse } from "./types";
import type { ToolContext } from "./tools";
import { createAbortDeadline, getErrorType, withTimeout } from "./retry";
import { getConversation, getMessages } from "@/lib/services/ai.service";
import { getHotelAISettings } from "@/lib/services/ai-settings.service";
import { getCurrentHotel } from "@/lib/tenant";
import { resolveConversationLanguage } from "./language";

export type OrchestratorInput = {
  hotel: { id: string; name: string };
  conversation: Conversation;
  messages: Message[];
  settings: HotelAISettings;
  retrievalQuery?: string;
  stream?: boolean;
  signal?: AbortSignal;
};

export type OrchestratorStreamInput = {
  conversationId: string;
  signal?: AbortSignal;
};

export type OrchestratorResult = {
  content: string;
  messageId: string | null;
  usage: AITokenUsage;
  costUsd: number;
  model: string;
  toolRounds: number;
};

export type OrchestratorStreamEvent =
  | { type: "status"; status: "ai_answering" | "tool_calls" }
  | { type: "text_delta"; delta: string }
  | { type: "text_final"; content: string }
  | { type: "done"; messageId: string };

const FALLBACK_CONTENT =
  "К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.";

const ANTI_HALLUCINATION = [
  "НИКОГДА не выдумывайте цены, политики, услуги или наличие номеров.",
  "Отвечайте ТОЛЬКО на основе базы знаний, результатов инструментов или явных фактов из контекста.",
  "Если информации нет в базе знаний и инструменты не дали ответа — скажите: «К сожалению, у меня нет этой информации. Пожалуйста, свяжитесь с ресепшном.»",
  "Не ссылайтесь на статьи, которых нет в предоставленной базе знаний.",
];

type ResolvedProviderOptions = ReturnType<typeof resolveProviderOptions>;

type CompletionLoopResult = {
  content: string;
  usage: AITokenUsage;
  costUsd: number;
  toolRounds: number;
  requestId: string;
  retryCount: number;
  finishReason?: string;
};

export class AIOrchestrator {
  async run(input: OrchestratorInput): Promise<OrchestratorResult> {
    const services = getAIServices();
    const provider = services.provider;

    this.validatePreflight(input, provider);
    this.beginAIContext(input, provider);
    assertConversationGuardrails(input);

    const opts = resolveProviderOptions(input.settings);
    const start = Date.now();
    const conversationDeadline = createAbortDeadline(
      resolveConversationTimeoutMs(input.settings),
      input.signal
    );

    const aiRequest = await this.prepareAIRequest(input, opts);
    assertContextGuardrails(aiRequest);

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
      payload: {
        provider: provider.name,
        model: opts.model,
        actionId,
        prompt_version: aiRequest.promptVersion ?? CurrentPromptVersion,
        system_prompt_hash: aiRequest.systemPromptHash,
      },
    });

    try {
      const result = await this.executeCompletionLoop({
        input,
        aiRequest,
        opts,
        initialResponse: null,
        signal: conversationDeadline.signal,
      });

      const durationMs = Date.now() - start;

      await logAIActionComplete({
        actionId,
        output: {
          content: result.content,
          usage: result.usage,
          toolRounds: result.toolRounds,
          prompt_version: aiRequest.promptVersion ?? CurrentPromptVersion,
          system_prompt_hash: aiRequest.systemPromptHash,
        },
        model: opts.model,
        usage: result.usage,
        costUsd: result.costUsd,
        durationMs,
        requestId: result.requestId,
      });

      await logAICompletionMetrics({
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
        provider: provider.name,
        model: opts.model,
        latencyMs: durationMs,
        usage: result.usage,
        costUsd: result.costUsd,
        finishReason: result.finishReason,
        retryCount: result.retryCount,
        toolCount: result.toolRounds,
        promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
        systemPromptHash: aiRequest.systemPromptHash ?? "",
      });

      opsMetrics.recordProviderLatency(provider.name, durationMs);
      opsLogger.info({
        module: "ai",
        operation: "completion",
        message: "ai.completion.completed",
        durationMs,
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
        details: {
          provider: provider.name,
          model: opts.model,
          finishReason: result.finishReason ?? null,
          retryCount: result.retryCount,
          toolCount: result.toolRounds,
          promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
          usage: result.usage,
        },
      });

      return {
        content: result.content,
        messageId: null,
        usage: result.usage,
        costUsd: result.costUsd,
        model: opts.model,
        toolRounds: result.toolRounds,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка AI";
      await logAIActionFailed({ actionId, errorMessage: message });
      await logAICompletionMetrics(
        {
          hotelId: input.hotel.id,
          conversationId: input.conversation.id,
          provider: provider.name,
          model: opts.model,
          latencyMs: Date.now() - start,
          usage: { ...EMPTY_TOKEN_USAGE },
          costUsd: 0,
          retryCount: 0,
          toolCount: 0,
          errorType: getErrorType(err),
          promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
          systemPromptHash: aiRequest.systemPromptHash ?? "",
        },
        "error"
      );
      opsMetrics.recordAIFailure(provider.name, getErrorType(err));
      opsLogger.error({
        module: "ai",
        operation: "completion",
        message: message,
        durationMs: Date.now() - start,
        errorCode: getErrorType(err),
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
      });
      throw err;
    } finally {
      conversationDeadline.cleanup();
    }
  }

  async *runStream(
    input: OrchestratorStreamInput
  ): AsyncGenerator<OrchestratorStreamEvent> {
    const [hotel, conversation, messages, settings] = await Promise.all([
      getCurrentHotel(),
      getConversation(input.conversationId),
      getMessages(input.conversationId),
      getHotelAISettings(),
    ]);

    if (!conversation) {
      throw new Error("Диалог не найден");
    }

    yield* this.stream({
      hotel,
      conversation,
      messages,
      settings,
      signal: input.signal,
    });
  }

  async *stream(input: OrchestratorInput): AsyncGenerator<OrchestratorStreamEvent> {
    const services = getAIServices();
    const provider = services.provider;

    this.validatePreflight(input, provider);
    this.beginAIContext(input, provider);
    assertConversationGuardrails(input);

    const opts = resolveProviderOptions(input.settings);
    const start = Date.now();
    const conversationDeadline = createAbortDeadline(
      resolveConversationTimeoutMs(input.settings),
      input.signal
    );

    yield { type: "status", status: "ai_answering" };
    await setConversationAIActive(input.conversation.id, input.hotel.id);

    const aiRequest = await this.prepareAIRequest(input, opts);
    assertContextGuardrails(aiRequest);

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
      payload: {
        provider: provider.name,
        model: opts.model,
        actionId,
        streamed: true,
        prompt_version: aiRequest.promptVersion ?? CurrentPromptVersion,
        system_prompt_hash: aiRequest.systemPromptHash,
      },
    });

    try {
      let fullText = "";
      const bufferedDeltas: string[] = [];
      let loopResult: CompletionLoopResult | null = null;

      if (provider.stream && !conversationDeadline.signal.aborted) {
        let streamedResponse: AIResponse | null = null;

        for await (const event of provider.stream(aiRequest, {
          model: opts.model,
          maxOutputTokens: opts.maxOutputTokens,
          temperature: opts.temperature,
          topP: opts.topP,
          toolChoice: opts.toolChoice,
          timeoutMs: opts.timeoutMs,
          maxRetries: opts.maxRetries,
          signal: conversationDeadline.signal,
        })) {
          if (conversationDeadline.signal.aborted) {
            await clearConversationAITyping(
              input.conversation.id,
              input.hotel.id
            );
            return;
          }

          if (event.type === "text_delta") {
            fullText += event.delta;
            bufferedDeltas.push(event.delta);
          }

          if (event.type === "completed") {
            streamedResponse = event.response;
          }
        }

        if (conversationDeadline.signal.aborted) {
          await clearConversationAITyping(
            input.conversation.id,
            input.hotel.id
          );
          return;
        }

        if (streamedResponse && streamedResponse.toolCalls.length > 0) {
          yield { type: "status", status: "tool_calls" };
          loopResult = await this.executeCompletionLoop({
            input,
            aiRequest,
            opts,
            initialResponse: streamedResponse,
            signal: conversationDeadline.signal,
          });
          fullText = loopResult.content;
          yield { type: "text_final", content: fullText };
        } else if (!fullText.trim()) {
          loopResult = await this.executeCompletionLoop({
            input,
            aiRequest,
            opts,
            initialResponse: streamedResponse,
            signal: conversationDeadline.signal,
          });
          fullText = loopResult.content;
          yield { type: "text_final", content: fullText };
        } else if (streamedResponse) {
          for (const delta of bufferedDeltas) {
            yield { type: "text_delta", delta };
          }

          const usage =
            (streamedResponse.metadata.usage as AITokenUsage) ??
            EMPTY_TOKEN_USAGE;
          loopResult = {
            content: fullText,
            usage,
            costUsd: estimateCostUsd(
              String(streamedResponse.metadata.model ?? opts.model),
              usage
            ),
            toolRounds: 0,
            requestId: String(streamedResponse.metadata.request_id ?? ""),
            retryCount: Number(streamedResponse.metadata.retry_count ?? 0),
            finishReason: streamedResponse.metadata.finish_reason as
              | string
              | undefined,
          };
        }
      }

      if (conversationDeadline.signal.aborted) {
        await clearConversationAITyping(input.conversation.id, input.hotel.id);
        return;
      }

      if (!fullText.trim()) {
        loopResult = await this.executeCompletionLoop({
          input,
          aiRequest,
          opts,
          initialResponse: null,
          signal: conversationDeadline.signal,
        });
        fullText = loopResult.content;
        yield { type: "text_final", content: fullText };
      }

      if (conversationDeadline.signal.aborted) {
        await clearConversationAITyping(input.conversation.id, input.hotel.id);
        return;
      }

      const usage = loopResult?.usage ?? { ...EMPTY_TOKEN_USAGE };
      const costUsd = loopResult?.costUsd ?? 0;
      const toolRounds = loopResult?.toolRounds ?? 0;
      const requestId = loopResult?.requestId ?? "";

      const messageId = await persistAIMessage({
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
        body: fullText,
        metadata: {
          provider: provider.name,
          streamed: true,
          model: opts.model,
          usage,
          cost_usd: costUsd,
          tool_rounds: toolRounds,
          prompt_version: aiRequest.promptVersion ?? CurrentPromptVersion,
          system_prompt_hash: aiRequest.systemPromptHash,
        },
      });

      const durationMs = Date.now() - start;

      await logAIActionComplete({
        actionId,
        output: {
          content: fullText,
          usage,
          toolRounds,
          prompt_version: aiRequest.promptVersion ?? CurrentPromptVersion,
          system_prompt_hash: aiRequest.systemPromptHash,
        },
        model: opts.model,
        usage,
        costUsd,
        durationMs,
        requestId,
      });

      await logAICompletionMetrics({
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
        provider: provider.name,
        model: opts.model,
        latencyMs: durationMs,
        usage,
        costUsd,
        finishReason: loopResult?.finishReason,
        retryCount: loopResult?.retryCount ?? 0,
        toolCount: toolRounds,
        promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
        systemPromptHash: aiRequest.systemPromptHash ?? "",
        streamed: true,
      });

      opsMetrics.recordProviderLatency(provider.name, durationMs);
      opsMetrics.recordStreamDuration("admin_sse", durationMs);
      opsLogger.info({
        module: "ai",
        operation: "stream",
        message: "ai.stream.completed",
        durationMs,
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
        details: {
          provider: provider.name,
          model: opts.model,
          finishReason: loopResult?.finishReason ?? null,
          retryCount: loopResult?.retryCount ?? 0,
          toolCount: toolRounds,
          promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
          usage,
        },
      });

      yield { type: "done", messageId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка AI";
      await logAIActionFailed({ actionId, errorMessage: message });
      await logAICompletionMetrics(
        {
          hotelId: input.hotel.id,
          conversationId: input.conversation.id,
          provider: provider.name,
          model: opts.model,
          latencyMs: Date.now() - start,
          usage: { ...EMPTY_TOKEN_USAGE },
          costUsd: 0,
          retryCount: 0,
          toolCount: 0,
          errorType: getErrorType(err),
          promptVersion: aiRequest.promptVersion ?? CurrentPromptVersion,
          systemPromptHash: aiRequest.systemPromptHash ?? "",
          streamed: true,
        },
        "error"
      );
      opsMetrics.recordAIFailure(provider.name, getErrorType(err));
      opsLogger.error({
        module: "ai",
        operation: "stream",
        message,
        durationMs: Date.now() - start,
        errorCode: getErrorType(err),
        hotelId: input.hotel.id,
        conversationId: input.conversation.id,
      });
      await clearConversationAITyping(input.conversation.id, input.hotel.id);
      throw err;
    } finally {
      conversationDeadline.cleanup();
    }
  }

  private beginAIContext(input: OrchestratorInput, provider: AIProvider): void {
    patchRequestContext({
      hotelId: input.hotel.id,
      conversationId: input.conversation.id,
      provider: provider.name,
    });
    opsMetrics.recordAIRequest(provider.name);
  }

  private validatePreflight(
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

  private async prepareAIRequest(
    input: OrchestratorInput,
    opts: ResolvedProviderOptions
  ): Promise<AIRequest> {
    const services = getAIServices();

    const aiRequest = await services.promptAssembler.build({
      hotel: input.hotel,
      conversation: input.conversation,
      messages: input.messages,
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

  private async executeCompletionLoop(params: {
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

      const toolOutputs = await this.executeTools(
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

  private async executeTools(
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
}

export const aiOrchestrator = new AIOrchestrator();

async function setConversationAIActive(
  conversationId: string,
  hotelId: string
): Promise<void> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase
    .from("conversations")
    .update({ is_ai_typing: true, status: "ai_answering" })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

async function clearConversationAITyping(
  conversationId: string,
  hotelId: string
): Promise<void> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase
    .from("conversations")
    .update({ is_ai_typing: false })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

async function persistAIMessage(input: {
  hotelId: string;
  conversationId: string;
  body: string;
  metadata: Record<string, unknown>;
}): Promise<string> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      hotel_id: input.hotelId,
      conversation_id: input.conversationId,
      role: "ai",
      body: input.body,
      metadata: input.metadata,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({
      status: "waiting_guest",
      is_ai_typing: false,
      last_message_preview: input.body.slice(0, 200),
      last_message_at: data.created_at,
    })
    .eq("id", input.conversationId)
    .eq("hotel_id", input.hotelId);

  return data.id as string;
}

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
        prompt_version: input.request.promptVersion ?? CurrentPromptVersion,
        system_prompt_hash: input.request.systemPromptHash,
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
