import { createServerRepositoryContext } from "./context.server";
import { GuestsRepository } from "./guests.repository";

import type { RepositoryContext } from "./context.types";

export async function createGuestsRepository(
  context?: RepositoryContext
): Promise<GuestsRepository> {
  return new GuestsRepository(context ?? (await createServerRepositoryContext()));
}
