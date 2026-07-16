import { computeAIHealthStatus } from "@/repositories/settings.repository";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { HotelAISettings, AIHealthStatus } from "@/types/ai-settings";
import type { AIAction } from "@/types/ai-action";

export async function getHotelAISettings(): Promise<HotelAISettings> {
  const ctx = await getRepositoryContext();
  return createSettingsRepository(ctx).getHotelAISettings();
}

export async function getAIActions(
  conversationId?: string,
  limit = 50
): Promise<AIAction[]> {
  const ctx = await getRepositoryContext();
  return createSettingsRepository(ctx).getAIActions(conversationId, limit);
}

export async function getAIHealthStatus(): Promise<AIHealthStatus> {
  const ctx = await getRepositoryContext();
  const repo = createSettingsRepository(ctx);
  const [settings, rows] = await Promise.all([
    repo.getHotelAISettings(),
    repo.getCompletionStats24h(),
  ]);

  return computeAIHealthStatus(settings, rows);
}

export async function getAIObservabilityLogs(limit = 30) {
  const ctx = await getRepositoryContext();
  return createSettingsRepository(ctx).getAIObservabilityLogs(limit);
}
