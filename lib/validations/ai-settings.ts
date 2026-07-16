import type { AIModelId } from "@/lib/ai/models";
import { AI_MODEL_IDS } from "@/lib/ai/models";
import { z } from "zod";

const modelIds = AI_MODEL_IDS as [AIModelId, ...AIModelId[]];

export const aiToolChoiceSchema = z.enum(["auto", "none", "required"]);

export const hotelAISettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.enum(modelIds).default("gpt-4o-mini"),
  max_output_tokens: z.number().int().min(64).max(16384).default(1024),
  temperature: z.number().min(0).max(2).default(0.3),
  top_p: z.number().min(0).max(1).default(1),
  tool_choice: aiToolChoiceSchema.default("auto"),
  system_language: z.string().trim().min(2).default("ru"),
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

/** @deprecated Import AI_MODEL_IDS from lib/ai/models */
export const AI_MODELS = AI_MODEL_IDS;
