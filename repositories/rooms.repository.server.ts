import type { RepositoryContext } from "./context.types";
import { RoomsRepository } from "./rooms.repository";

export function createRoomsRepository(
  context: RepositoryContext
): RoomsRepository {
  return new RoomsRepository(context);
}
