import { z } from "zod";

export const AI_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-mini",
  "gpt-4.1",
] as const;

export const hotelAISettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.enum(AI_MODELS).default("gpt-4o-mini"),
  max_output_tokens: z.number().int().min(64).max(16384).default(1024),
  temperature: z.number().min(0).max(2).default(0.3),
  rate_limit_per_minute: z.number().int().min(1).max(500).default(30),
  timeout_ms: z.number().int().min(5000).max(300000).default(60000),
  max_tool_rounds: z.number().int().min(0).max(10).default(5),
  max_retries: z.number().int().min(0).max(5).default(2),
  extra_instructions: z.string().trim().default(""),
});

export const aiPromptTestSchema = z.object({
  message: z.string().trim().min(1, "Введите тестовое сообщение"),
  guest_name: z.string().trim().min(1).default("Тестовый гость"),
  language: z.string().trim().default("ru"),
});

export const aiRespondSchema = z.object({
  conversation_id: z.string().uuid(),
});

export const guestMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  body: z.string().trim().min(1, "Введите сообщение"),
  trigger_ai: z.boolean().default(true),
});

export type HotelAISettingsInput = z.infer<typeof hotelAISettingsSchema>;
export type AIPromptTestInput = z.infer<typeof aiPromptTestSchema>;
