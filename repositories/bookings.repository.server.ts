import { BookingsRepository } from "./bookings.repository";
import { createServerRepositoryContext } from "./context.server";

import type { RepositoryContext } from "./context.types";

export async function createBookingsRepository(
  context?: RepositoryContext
): Promise<BookingsRepository> {
  return new BookingsRepository(context ?? (await createServerRepositoryContext()));
}
