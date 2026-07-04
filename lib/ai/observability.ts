import { createClient } from "@/lib/supabase/server";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type ObservabilityEvent = {
  hotelId: string;
  level: LogLevel;
  event: string;
  conversationId?: string;
  payload?: Record<string, unknown>;
};

export async function logAIObservability(input: ObservabilityEvent) {
  try {
    const supabase = await createClient();
    await supabase.from("ai_observability_logs").insert({
      hotel_id: input.hotelId,
      level: input.level,
      event: input.event,
      conversation_id: input.conversationId ?? null,
      payload: input.payload ?? {},
    });
  } catch {
    // Observability must not break the main flow.
    console.error("[ai-observability]", input.event, input.payload);
  }
}
