import { BookingsRepository } from "./bookings.repository";

import type { RepositoryContext } from "./context.types";

export function createBookingsRepository(
  context: RepositoryContext
): BookingsRepository {
  return new BookingsRepository(context);
}
