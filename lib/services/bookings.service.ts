import { createBookingsRepository } from "@/repositories/bookings.repository.server";

import type { Booking } from "@/types/booking";

export async function getBookings(): Promise<Booking[]> {
  const repo = await createBookingsRepository();
  return repo.getAll();
}

export async function getBooking(id: string): Promise<Booking | null> {
  const repo = await createBookingsRepository();
  return repo.getById(id);
}
