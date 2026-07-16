import type { Booking } from "@/types/booking";
import type { Guest, GuestStats } from "@/types/guest";

function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Determines whether a booking belongs to a guest. Bookings store inline guest
 * fields (no guest_id FK), so we match on email first, then on full name.
 */
export function bookingBelongsToGuest(booking: Booking, guest: Guest): boolean {
  const guestEmail = guest.email?.trim().toLowerCase();
  const bookingEmail = booking.guest_email?.trim().toLowerCase();

  if (guestEmail && bookingEmail) {
    return guestEmail === bookingEmail;
  }

  const guestName = `${guest.first_name} ${guest.last_name}`
    .trim()
    .toLowerCase();

  return Boolean(guestName) && booking.guest_name.trim().toLowerCase() === guestName;
}

/**
 * Pure aggregation of a guest's stay statistics from their bookings.
 * Cancelled bookings are excluded from revenue/nights but not from history.
 */
export function computeGuestStats(bookings: Booking[]): GuestStats {
  const today = new Date().toISOString().slice(0, 10);

  let totalNights = 0;
  let totalRevenue = 0;
  let lastStay: string | null = null;
  let upcomingCheckIn: string | null = null;

  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;

    totalNights += nightsBetween(booking.check_in, booking.check_out);
    totalRevenue += Number(booking.total_price) || 0;

    if (booking.check_out <= today) {
      if (!lastStay || booking.check_out > lastStay) {
        lastStay = booking.check_out;
      }
    }

    if (booking.check_in >= today) {
      if (!upcomingCheckIn || booking.check_in < upcomingCheckIn) {
        upcomingCheckIn = booking.check_in;
      }
    }
  }

  return {
    totalBookings: bookings.filter((b) => b.status !== "cancelled").length,
    totalNights,
    totalRevenue,
    lastStay,
    upcomingCheckIn,
  };
}
