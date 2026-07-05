import { createServerRepositoryContext } from "./context.server";
import { SettingsRepository } from "./settings.repository";

import type { RepositoryContext } from "./context.types";

export async function createSettingsRepository(
  context?: RepositoryContext
): Promise<SettingsRepository> {
  return new SettingsRepository(context ?? (await createServerRepositoryContext()));
}
