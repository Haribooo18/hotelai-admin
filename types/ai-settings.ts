export type AIToolChoice = "auto" | "none" | "required";

export type HotelAISettings = {
  hotel_id: string;
  enabled: boolean;
  model: string;
  max_output_tokens: number;
  temperature: number;
  top_p: number;
  tool_choice: AIToolChoice;
  system_language: string;
  rate_limit_per_minute: number;
  timeout_ms: number;
  max_tool_rounds: number;
  max_retries: number;
  extra_instructions: string | null;
  created_at: string;
  updated_at: string;
};

export type AITokenUsage = {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
};

export type AIObservabilityLog = {
  id: string;
  hotel_id: string;
  level: "debug" | "info" | "warn" | "error";
  event: string;
  conversation_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export type AIHealthStatus = {
  configured: boolean;
  enabled: boolean;
  model: string;
  provider: string;
  recent_errors: number;
  recent_requests: number;
  avg_duration_ms: number | null;
  total_cost_usd_24h: number;
};
