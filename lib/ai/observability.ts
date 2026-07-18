import type { AITokenUsage } from "@/types/ai-settings";

import { createAdminClient } from "@/lib/supabase/admin";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type ObservabilityEvent = {
  hotelId: string;
  level: LogLevel;
  event: string;
  conversationId?: string;
  payload?: Record<string, unknown>;
};

export type AICompletionMetrics = {
  hotelId: string;
  conversationId: string;
  provider: string;
  model: string;
  latencyMs: number;
  usage: AITokenUsage;
  costUsd: number;
  finishReason?: string;
  retryCount: number;
  toolCount: number;
  errorType?: string;
  promptVersion: string;
  systemPromptHash: string;
  streamed?: boolean;
};

export async function logAIObservability(input: ObservabilityEvent) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("ai_observability_logs").insert({
      hotel_id: input.hotelId,
      level: input.level,
      event: input.event,
      conversation_id: input.conversationId ?? null,
      payload: input.payload ?? {},
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(
      "[ai-observability]",
      input.event,
      input.payload,
      error
    );
  }
}

export async function logAICompletionMetrics(
  metrics: AICompletionMetrics,
  level: LogLevel = "info"
) {
  await logAIObservability({
    hotelId: metrics.hotelId,
    level,
    event: "ai.completion.metrics",
    conversationId: metrics.conversationId,
    payload: {
      provider: metrics.provider,
      model: metrics.model,
      latency_ms: metrics.latencyMs,
      usage: metrics.usage,
      cost_usd: metrics.costUsd,
      finish_reason: metrics.finishReason ?? null,
      retry_count: metrics.retryCount,
      tool_count: metrics.toolCount,
      error_type: metrics.errorType ?? null,
      prompt_version: metrics.promptVersion,
      system_prompt_hash: metrics.systemPromptHash,
      streamed: metrics.streamed ?? false,
    },
  });
}
