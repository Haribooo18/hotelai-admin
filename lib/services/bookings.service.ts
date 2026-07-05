import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { Booking } from "@/types/booking";

export async function getBookings(): Promise<Booking[]> {
  const ctx = await getRepositoryContext();
  return createBookingsRepository(ctx).getAll();
}

export async function getBooking(id: string): Promise<Booking | null> {
  const ctx = await getRepositoryContext();
  return createBookingsRepository(ctx).getById(id);
}
