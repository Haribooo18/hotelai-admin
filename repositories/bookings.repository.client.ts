import { BookingsRepository } from "./bookings.repository";
import { createClientRepositoryContext } from "./context.client";

export function createBookingsRepositoryClient(
  hotelId: string
): BookingsRepository {
  return new BookingsRepository(createClientRepositoryContext(hotelId));
}
