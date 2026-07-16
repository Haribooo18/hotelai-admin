import { createClientRepositoryContext } from "./context.client";
import { GuestsRepository } from "./guests.repository";

export function createGuestsRepositoryClient(hotelId: string): GuestsRepository {
  return new GuestsRepository(createClientRepositoryContext(hotelId));
}
