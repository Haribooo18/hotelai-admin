import { DEFAULT_AI_SETTINGS } from "@/lib/ai/config";

import type { AIAction } from "@/types/ai-action";
import type { HotelAISettings, AIHealthStatus } from "@/types/ai-settings";
import type { BillingPlan, HotelSubscription, SubscriptionStatus } from "@/types/subscription";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

type HotelAISettingsUpsertRow = {
  enabled: boolean;
  model: string;
  max_output_tokens: number;
  temperature: number;
  top_p: number;
  tool_choice: string;
  system_language: string;
  rate_limit_per_minute: number;
  timeout_ms: number;
  max_tool_rounds: number;
  max_retries: number;
  extra_instructions: string | null;
};

type AICompletionStatRow = {
  status: string;
  duration_ms: number | null;
  cost_usd: number | null;
  created_at: string;
};

export class SettingsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async getAll(): Promise<HotelAISettings[]> {
    const settings = await this.getHotelAISettings();
    return [settings];
  }

  async getById(id: string): Promise<HotelAISettings | null> {
    void id;
    return this.getHotelAISettings();
  }

  async create(row: HotelAISettingsUpsertRow): Promise<void> {
    await this.updateSettings(row);
  }

  async update(_id: string, row: HotelAISettingsUpsertRow): Promise<void> {
    await this.updateSettings(row);
  }

  async delete(id: string): Promise<void> {
    void id;
    throw new Error("Удаление настроек ИИ не поддерживается");
  }

  async getHotelAISettings(): Promise<HotelAISettings> {
    const { data, error } = await this.ctx.supabase
      .from("hotel_ai_settings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    if (!data) {
      return {
        hotel_id: this.ctx.hotelId,
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
      tool_choice: (data.tool_choice ??
        DEFAULT_AI_SETTINGS.tool_choice) as HotelAISettings["tool_choice"],
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

  async updateSettings(row: HotelAISettingsUpsertRow): Promise<void> {
    const { error } = await this.ctx.supabase.from("hotel_ai_settings").upsert({
      hotel_id: this.ctx.hotelId,
      ...row,
    });

    if (error) throwRepositoryError(error);
  }

  async getAIActions(conversationId?: string, limit = 50): Promise<AIAction[]> {
    let query = this.ctx.supabase
      .from("ai_actions")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (conversationId) {
      query = query.eq("conversation_id", conversationId);
    }

    const { data, error } = await query;
    if (error) throwRepositoryError(error);

    return (data ?? []) as AIAction[];
  }

  async getCompletionStats24h(): Promise<AICompletionStatRow[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.ctx.supabase
      .from("ai_actions")
      .select("status, duration_ms, cost_usd, created_at")
      .eq("hotel_id", this.ctx.hotelId)
      .gte("created_at", since)
      .eq("action_type", "completion");

    if (error) throwRepositoryError(error);

    return (data ?? []) as AICompletionStatRow[];
  }

  async getAIObservabilityLogs(limit = 30) {
    const { data, error } = await this.ctx.supabase
      .from("ai_observability_logs")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throwRepositoryError(error);
    return data ?? [];
  }

  async getHotelSubscription(): Promise<HotelSubscription | null> {
    const { data, error } = await this.ctx.supabase
      .from("subscriptions")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);
    if (!data) return null;

    return {
      id: data.id,
      hotel_id: data.hotel_id,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      plan: data.plan as BillingPlan,
      status: data.status as SubscriptionStatus,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      cancel_at_period_end: data.cancel_at_period_end,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

export async function computeAIHealthStatus(
  settings: HotelAISettings,
  rows: AICompletionStatRow[]
): Promise<AIHealthStatus> {
  const recent_errors = rows.filter((r) => r.status === "failed").length;
  const recent_requests = rows.length;
  const durations = rows
    .map((r) => r.duration_ms)
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
