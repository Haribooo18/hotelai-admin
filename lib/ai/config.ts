import type { HotelAISettings } from "@/types/ai-settings";

export const DEFAULT_AI_SETTINGS: Omit<
  HotelAISettings,
  "hotel_id" | "created_at" | "updated_at"
> = {
  enabled: false,
  model: "gpt-4o-mini",
  max_output_tokens: 1024,
  temperature: 0.3,
  rate_limit_per_minute: 30,
  timeout_ms: 60_000,
  max_tool_rounds: 5,
  max_retries: 2,
  extra_instructions: null,
};

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(getOpenAIApiKey());
}

export function resolveProviderOptions(settings: HotelAISettings) {
  return {
    model: settings.model,
    maxOutputTokens: settings.max_output_tokens,
    temperature: Number(settings.temperature),
    timeoutMs: settings.timeout_ms,
    maxRetries: settings.max_retries,
    maxToolRounds: settings.max_tool_rounds,
  };
}
