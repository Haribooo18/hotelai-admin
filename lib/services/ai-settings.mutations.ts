"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import {
  hotelAISettingsSchema,
  type HotelAISettingsInput,
} from "@/lib/validations/ai-settings";

function revalidateAISettings() {
  revalidatePath("/settings");
  revalidatePath("/settings/ai");
  revalidatePath("/ai");
}

export async function updateHotelAISettings(input: HotelAISettingsInput) {
  const parsed = hotelAISettingsSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase.from("hotel_ai_settings").upsert({
    hotel_id: hotelId,
    enabled: parsed.data.enabled,
    model: parsed.data.model,
    max_output_tokens: parsed.data.max_output_tokens,
    temperature: parsed.data.temperature,
    rate_limit_per_minute: parsed.data.rate_limit_per_minute,
    timeout_ms: parsed.data.timeout_ms,
    max_tool_rounds: parsed.data.max_tool_rounds,
    max_retries: parsed.data.max_retries,
    extra_instructions: parsed.data.extra_instructions || null,
  });

  if (error) throw error;

  revalidateAISettings();
}
