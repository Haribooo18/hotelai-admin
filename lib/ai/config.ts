import type { HotelAISettings, AIToolChoice } from "@/types/ai-settings";

import { DEFAULT_MODEL_ID } from "./models";

export const DEFAULT_AI_SETTINGS: Omit<
  HotelAISettings,
  "hotel_id" | "created_at" | "updated_at"
> = {
  enabled: false,
  model: DEFAULT_MODEL_ID,
  max_output_tokens: 1024,
  temperature: 0.3,
  top_p: 1,
  tool_choice: "auto",
  system_language: "en",
  rate_limit_per_minute: 30,
  timeout_ms: 60_000,
  max_tool_rounds: 5,
  max_retries: 2,
  extra_instructions: null,
};

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function getOpenAIDefaultModel(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL_ID;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(getOpenAIApiKey());
}

export function resolveProviderOptions(settings: HotelAISettings) {
  return {
    model: settings.model,
    maxOutputTokens: settings.max_output_tokens,
    temperature: Number(settings.temperature),
    topP: Number(settings.top_p),
    toolChoice: settings.tool_choice as AIToolChoice,
    language: settings.system_language,
    timeoutMs: settings.timeout_ms,
    maxRetries: settings.max_retries,
    maxToolRounds: settings.max_tool_rounds,
  };
}
