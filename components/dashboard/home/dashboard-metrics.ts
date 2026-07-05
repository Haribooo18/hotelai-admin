import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

export type DashboardMetrics = {
  occupancyPercent: number;
  revenueToday: number;
  revenueMonth: number;
  arrivalsToday: number;
  departuresToday: number;
  activeGuests: number;
  checkInsToday: number;
  checkOutsToday: number;
  openRequests: number;
  averageRating: number | null;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type TimelineItem = {
  id: string;
  kind: "check_in" | "check_out" | "cleaning" | "reminder";
  time: string;
  title: string;
  subtitle: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isActiveBooking(booking: Booking, today: string): boolean {
  if (booking.status === "cancelled") return false;
  return booking.check_in <= today && booking.check_out > today;
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDashboardCurrency(value: number): string {
  return formatCurrency(value);
}

export function formatDashboardPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function computeDashboardMetrics(
  bookings: Booking[],
  rooms: Room[],
  leads: Lead[]
): DashboardMetrics {
  const today = todayIso();
  const currentMonth = monthKey(new Date());

  const stayingToday = bookings.filter((booking) =>
    isActiveBooking(booking, today)
  );

  const occupancyPercent =
    rooms.length > 0 ? (stayingToday.length / rooms.length) * 100 : 0;

  const revenueToday = bookings
    .filter((booking) => booking.check_in === today)
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);

  const revenueMonth = bookings
    .filter((booking) => booking.check_in.startsWith(currentMonth))
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);

  const arrivalsToday = bookings.filter(
    (booking) => booking.check_in === today
  ).length;

  const departuresToday = bookings.filter(
    (booking) => booking.check_out === today
  ).length;

  const activeGuests = stayingToday.reduce(
    (sum, booking) => sum + booking.adults + booking.children,
    0
  );

  return {
    occupancyPercent,
    revenueToday,
    revenueMonth,
    arrivalsToday,
    departuresToday,
    activeGuests,
    checkInsToday: arrivalsToday,
    checkOutsToday: departuresToday,
    openRequests: leads.filter((lead) => lead.status === "new").length,
    averageRating: null,
  };
}

export function buildRevenueTrend(bookings: Booking[]): TrendPoint[] {
  const points: TrendPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);

    const value = bookings
      .filter((booking) => booking.check_in === key)
      .reduce((sum, booking) => sum + Number(booking.total_price), 0);

    points.push({ label: formatDayLabel(date), value });
  }

  return points;
}

export function buildOccupancyTrend(
  bookings: Booking[],
  roomCount: number
): TrendPoint[] {
  const points: TrendPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);

    const occupied = bookings.filter((booking) =>
      isActiveBooking(booking, key)
    ).length;

    const value =
      roomCount > 0 ? Math.round((occupied / roomCount) * 100) : 0;

    points.push({ label: formatDayLabel(date), value });
  }

  return points;
}

export function buildTimeline(
  bookings: Booking[],
  leads: Lead[]
): TimelineItem[] {
  const today = todayIso();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  const items: TimelineItem[] = [];

  bookings
    .filter((booking) => booking.check_in === today)
    .forEach((booking) => {
      items.push({
        id: `in-${booking.id}`,
        kind: "check_in",
        time: "14:00",
        title: booking.guest_name,
        subtitle: `Check-in · ${booking.adults + booking.children} guests`,
      });
    });

  bookings
    .filter((booking) => booking.check_out === today)
    .forEach((booking) => {
      items.push({
        id: `out-${booking.id}`,
        kind: "check_out",
        time: "12:00",
        title: booking.guest_name,
        subtitle: "Check-out",
      });

      items.push({
        id: `clean-${booking.id}`,
        kind: "cleaning",
        time: "12:30",
        title: `Cleaning after ${booking.guest_name}`,
        subtitle: "Standard room cleaning",
      });
    });

  leads
    .filter((lead) => lead.status === "new")
    .slice(0, 3)
    .forEach((lead) => {
      items.push({
        id: `lead-${lead.lead_id}`,
        kind: "reminder",
        time: "Now",
        title: lead.guest_name ?? "New request",
        subtitle: lead.room_type ?? "Needs attention",
      });
    });

  bookings
    .filter((booking) => booking.check_in === tomorrowKey)
    .slice(0, 2)
    .forEach((booking) => {
      items.push({
        id: `tomorrow-${booking.id}`,
        kind: "reminder",
        time: "Tomorrow",
        title: booking.guest_name,
        subtitle: "Prepare room for check-in",
      });
    });

  return items;
}

export function getLatestBookings(bookings: Booking[], limit = 5): Booking[] {
  return [...bookings]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}
