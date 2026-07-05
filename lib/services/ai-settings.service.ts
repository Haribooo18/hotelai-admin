import { computeAIHealthStatus } from "@/repositories/settings.repository";
import { createSettingsRepository } from "@/repositories/settings.repository.server";

import type { HotelAISettings, AIHealthStatus } from "@/types/ai-settings";
import type { AIAction } from "@/types/ai-action";

export async function getHotelAISettings(): Promise<HotelAISettings> {
  const repo = await createSettingsRepository();
  return repo.getHotelAISettings();
}

export async function getAIActions(
  conversationId?: string,
  limit = 50
): Promise<AIAction[]> {
  const repo = await createSettingsRepository();
  return repo.getAIActions(conversationId, limit);
}

export async function getAIHealthStatus(): Promise<AIHealthStatus> {
  const repo = await createSettingsRepository();
  const [settings, rows] = await Promise.all([
    repo.getHotelAISettings(),
    repo.getCompletionStats24h(),
  ]);

  return computeAIHealthStatus(settings, rows);
}

export async function getAIObservabilityLogs(limit = 30) {
  const repo = await createSettingsRepository();
  return repo.getAIObservabilityLogs(limit);
}
