import { createServerRepositoryContext } from "./context.server";
import { RoomsRepository } from "./rooms.repository";

import type { RepositoryContext } from "./context.types";

export async function createRoomsRepository(
  context?: RepositoryContext
): Promise<RoomsRepository> {
  return new RoomsRepository(context ?? (await createServerRepositoryContext()));
}
