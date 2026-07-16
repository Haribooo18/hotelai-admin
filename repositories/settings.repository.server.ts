import type { RepositoryContext } from "./context.types";
import { SettingsRepository } from "./settings.repository";

export function createSettingsRepository(
  context: RepositoryContext
): SettingsRepository {
  return new SettingsRepository(context);
}
