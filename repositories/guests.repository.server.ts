import type { RepositoryContext } from "./context.types";
import { GuestsRepository } from "./guests.repository";

export function createGuestsRepository(
  context: RepositoryContext
): GuestsRepository {
  return new GuestsRepository(context);
}
