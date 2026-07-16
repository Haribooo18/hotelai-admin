import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";

export async function getGuests(): Promise<Guest[]> {
  const ctx = await getRepositoryContext();
  return createGuestsRepository(ctx).getAll();
}

export async function getGuest(id: string): Promise<Guest | null> {
  const ctx = await getRepositoryContext();
  return createGuestsRepository(ctx).getById(id);
}

/**
 * A guest's booking history. Bookings store inline guest fields (no guest_id),
 * so we match on email when available, otherwise on the full name.
 */
export async function getGuestBookings(guest: Guest): Promise<Booking[]> {
  const ctx = await getRepositoryContext();
  return createGuestsRepository(ctx).getBookingsForGuest(guest);
}
