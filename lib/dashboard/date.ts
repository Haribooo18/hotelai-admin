import type { Booking } from "@/types/booking";

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function minutesSince(value: string): number {
  const diffMs = Date.now() - new Date(value).getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}

export function countNights(checkIn: string, checkOut: string): number {
  const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function isActiveStay(booking: Booking, today: string): boolean {
  if (booking.status === "cancelled" || booking.status === "checked_out") {
    return false;
  }

  return booking.check_in <= today && booking.check_out > today;
}
