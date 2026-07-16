import { createClientRepositoryContext } from "./context.client";
import { RoomsRepository } from "./rooms.repository";

export function createRoomsRepositoryClient(hotelId: string): RoomsRepository {
  return new RoomsRepository(createClientRepositoryContext(hotelId));
}
