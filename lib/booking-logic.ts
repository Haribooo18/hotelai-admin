/**
 * Pure booking calculations shared by mutations and unit tests.
 * DB access stays in lib/services/bookings.mutations.ts.
 */

export function countBookingNights(checkIn: string, checkOut: string): number {
  return Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

export function calculateTotalPrice(
  roomPrice: number,
  checkIn: string,
  checkOut: string
): number {
  return roomPrice * countBookingNights(checkIn, checkOut);
}

export type AvailabilityBooking = {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
};

/** Overlap detection used by ensureRoomAvailable (after cancelled rows are excluded). */
export function findAvailabilityConflict(
  bookings: AvailabilityBooking[],
  checkIn: string,
  checkOut: string
): AvailabilityBooking | undefined {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  return bookings.find((booking) => {
    const existingStart = new Date(booking.check_in).getTime();
    const existingEnd = new Date(booking.check_out).getTime();
    return start < existingEnd && end > existingStart;
  });
}

export function formatAvailabilityConflictError(
  conflict: AvailabilityBooking
): string {
  return `Номер уже забронирован (${conflict.check_in} — ${conflict.check_out})`;
}
