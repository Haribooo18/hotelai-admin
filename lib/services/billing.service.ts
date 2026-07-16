import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { HotelSubscription } from "@/types/subscription";

export async function getHotelSubscription(): Promise<HotelSubscription | null> {
  const ctx = await getRepositoryContext();
  return createSettingsRepository(ctx).getHotelSubscription();
}
