import { createClient } from "@/lib/supabase/server";
import { DEFAULT_AI_SETTINGS } from "@/lib/ai/config";
import { getCurrentHotelId } from "@/lib/tenant";

import type { HotelAISettings, AIHealthStatus } from "@/types/ai-settings";
import type { AIAction } from "@/types/ai-action";

function formatError(error: {
  code?: string;
  message: string;
  details?: string | null;
}) {
  return new Error(
    `${error.code ?? "error"}: ${error.message}${
      error.details ? ` (${error.details})` : ""
    }`
  );
}

export async function getHotelAISettings(): Promise<HotelAISettings> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("hotel_ai_settings")
    .select("*")
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw formatError(error);

  if (!data) {
    return {
      hotel_id: hotelId,
      ...DEFAULT_AI_SETTINGS,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return {
    hotel_id: data.hotel_id,
    enabled: data.enabled,
    model: data.model,
    max_output_tokens: data.max_output_tokens,
    temperature: Number(data.temperature),
    top_p: Number(data.top_p ?? DEFAULT_AI_SETTINGS.top_p),
    tool_choice: (data.tool_choice ?? DEFAULT_AI_SETTINGS.tool_choice) as HotelAISettings["tool_choice"],
    system_language: data.system_language ?? DEFAULT_AI_SETTINGS.system_language,
    rate_limit_per_minute: data.rate_limit_per_minute,
    timeout_ms: data.timeout_ms,
    max_tool_rounds: data.max_tool_rounds,
    max_retries: data.max_retries,
    extra_instructions: data.extra_instructions,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function getAIActions(
  conversationId?: string,
  limit = 50
): Promise<AIAction[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  let query = supabase
    .from("ai_actions")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (conversationId) {
    query = query.eq("conversation_id", conversationId);
  }

  const { data, error } = await query;
  if (error) throw formatError(error);

  return (data ?? []) as AIAction[];
}

export async function getAIHealthStatus(): Promise<AIHealthStatus> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();
  const settings = await getHotelAISettings();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: actions, error } = await supabase
    .from("ai_actions")
    .select("status, duration_ms, cost_usd, created_at")
    .eq("hotel_id", hotelId)
    .gte("created_at", since)
    .eq("action_type", "completion");

  if (error) throw formatError(error);

  const rows = actions ?? [];
  const recent_errors = rows.filter((r) => r.status === "failed").length;
  const recent_requests = rows.length;
  const durations = rows
    .map((r) => r.duration_ms as number | null)
    .filter((d): d is number => typeof d === "number");
  const avg_duration_ms =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;
  const total_cost_usd_24h = rows.reduce(
    (sum, r) => sum + (Number(r.cost_usd) || 0),
    0
  );

  const { isOpenAIConfigured } = await import("@/lib/ai/config");

  return {
    configured: isOpenAIConfigured(),
    enabled: settings.enabled,
    model: settings.model,
    provider: isOpenAIConfigured() ? "openai" : "unconfigured",
    recent_errors,
    recent_requests,
    avg_duration_ms,
    total_cost_usd_24h: Math.round(total_cost_usd_24h * 1_000_000) / 1_000_000,
  };
}

export async function getAIObservabilityLogs(limit = 30) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("ai_observability_logs")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw formatError(error);
  return data ?? [];
}
