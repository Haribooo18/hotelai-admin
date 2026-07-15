"use server";

import { revalidatePath } from "next/cache";

import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";
import {
  hotelAISettingsSchema,
  type HotelAISettingsInput,
} from "@/lib/validations/ai-settings";

function revalidateAISettings() {
  revalidatePath("/settings");
  revalidatePath("/settings/ai");
  revalidatePath("/app/ai");
}

export async function updateHotelAISettings(input: HotelAISettingsInput) {
  const parsed = hotelAISettingsSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const ctx = await getRepositoryContext();
  await createSettingsRepository(ctx).updateSettings({
    enabled: parsed.data.enabled,
    model: parsed.data.model,
    max_output_tokens: parsed.data.max_output_tokens,
    temperature: parsed.data.temperature,
    top_p: parsed.data.top_p,
    tool_choice: parsed.data.tool_choice,
    system_language: parsed.data.system_language,
    rate_limit_per_minute: parsed.data.rate_limit_per_minute,
    timeout_ms: parsed.data.timeout_ms,
    max_tool_rounds: parsed.data.max_tool_rounds,
    max_retries: parsed.data.max_retries,
    extra_instructions: parsed.data.extra_instructions || null,
  });

  revalidateAISettings();
}
