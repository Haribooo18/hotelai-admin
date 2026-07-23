import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { AITokenUsage } from "@/types/ai-settings";

import type { HotelAISettings } from "@/types/ai-settings";

import { estimateCostUsd, EMPTY_TOKEN_USAGE } from "./cost";
import { resolveProviderOptions } from "./config";
import {
  assertContextGuardrails,
  assertConversationGuardrails,
  resolveConversationTimeoutMs,
} from "./guardrails";
import { CurrentPromptVersion } from "./prompt-version";
import { logAICompletionMetrics, logAIObservability } from "./observability";
import { opsLogger } from "@/lib/ops/logger";
import { opsMetrics } from "@/lib/ops/metrics";
import { getAIServices } from "./container";
import type { AIResponse } from "./types";
import { createAbortDeadline, getErrorType } from "./retry";
import { getConversation, getMessages } from "@/lib/services/ai.service";
import { getHotelAISettings } from "@/lib/services/ai-settings.service";
import { getCurrentHotel } from "@/lib/tenant";
import {
  setConversationAIActive,
  clearConversationAITyping,
  persistAIMessage,
  logAIActionStart,
  logAIActionComplete,
  logAIActionFailed,
} from "./orchestrator-persistence";
import {
  beginAIContext,
  validatePreflight,
  prepareAIRequest,
  executeCompletionLoop,
  type CompletionLoopResult,
} from "./orchestrator-internals";

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

export class AIOrchestrator {
  async run(input: OrchestratorInput): Promise<OrchestratorResult> {
    const services = getAIServices();
    const provider = services.provider;

    validatePreflight(input, provider);
    beginAIContext(input, provider);
    assertConversationGuardrails(input);

    const opts = resolveProviderOptions(input.settings);
    const start = Date.now();
    const conversationDeadline = createAbortDeadline(
      resolveConversationTimeoutMs(input.settings),
      input.signal
    );

    const aiRequest = await prepareAIRequest(input, opts);
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
      const result = await executeCompletionLoop({
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

    validatePreflight(input, provider);
    beginAIContext(input, provider);
    assertConversationGuardrails(input);

    const opts = resolveProviderOptions(input.settings);
    const start = Date.now();
    const conversationDeadline = createAbortDeadline(
      resolveConversationTimeoutMs(input.settings),
      input.signal
    );

    yield { type: "status", status: "ai_answering" };
    await setConversationAIActive(input.conversation.id, input.hotel.id);

    const aiRequest = await prepareAIRequest(input, opts);
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
          loopResult = await executeCompletionLoop({
            input,
            aiRequest,
            opts,
            initialResponse: streamedResponse,
            signal: conversationDeadline.signal,
          });
          fullText = loopResult.content;
          yield { type: "text_final", content: fullText };
        } else if (!fullText.trim()) {
          loopResult = await executeCompletionLoop({
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
        loopResult = await executeCompletionLoop({
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

}

export const aiOrchestrator = new AIOrchestrator();
