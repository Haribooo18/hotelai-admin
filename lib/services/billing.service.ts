import { createSettingsRepository } from "@/repositories/settings.repository.server";

import type { HotelSubscription } from "@/types/subscription";

export async function getHotelSubscription(): Promise<HotelSubscription | null> {
  const repo = await createSettingsRepository();
  return repo.getHotelSubscription();
}
