import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import {
  buildRoomCardModels,
  computeRoomOpsKpis,
} from "@/components/dashboard/rooms/room-ops-metrics";

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

export type DashboardAlert = {
  id: string;
  severity: "info" | "warning" | "urgent";
  title: string;
  description: string;
  href?: string;
};

export type AiActivityItem = {
  id: string;
  guestName: string;
  channel: string;
  preview: string;
  status: string;
  createdAt: string;
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

export function getRecentGuests(guests: Guest[], limit = 5): Guest[] {
  return [...guests]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

export function getUpcomingBookings(bookings: Booking[], limit = 5): Booking[] {
  const today = todayIso();

  return [...bookings]
    .filter(
      (booking) =>
        booking.status !== "cancelled" && booking.check_in >= today
    )
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, limit);
}

export function getAiConversationCount(leads: Lead[]): number {
  return leads.filter((lead) => lead.status !== "cancelled").length;
}

export function buildAiActivity(leads: Lead[], limit = 6): AiActivityItem[] {
  return [...leads]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit)
    .map((lead) => ({
      id: lead.lead_id,
      guestName: lead.guest_name ?? "Unknown guest",
      channel: "AI Receptionist",
      preview:
        lead.comment?.trim() ||
        lead.room_type ||
        "New booking inquiry",
      status: lead.status ?? "new",
      createdAt: lead.created_at,
    }));
}

export function buildDashboardAlerts(
  bookings: Booking[],
  rooms: Room[],
  leads: Lead[]
): DashboardAlert[] {
  const today = todayIso();
  const alerts: DashboardAlert[] = [];

  const newLeads = leads.filter((lead) => lead.status === "new");
  if (newLeads.length > 0) {
    alerts.push({
      id: "new-leads",
      severity: "urgent",
      title: `${newLeads.length} new AI request${newLeads.length === 1 ? "" : "s"}`,
      description: "Guests are waiting for a response in AI Inbox.",
      href: "/ai",
    });
  }

  const roomModels = buildRoomCardModels(rooms, bookings);
  const kpis = computeRoomOpsKpis(roomModels);

  if (kpis.total > 0 && kpis.available === 0) {
    alerts.push({
      id: "no-availability",
      severity: "warning",
      title: "No rooms available",
      description: "All rooms are occupied, reserved, or being prepared.",
      href: "/rooms",
    });
  } else if (kpis.occupied / kpis.total >= 0.9 && kpis.total > 0) {
    alerts.push({
      id: "high-occupancy",
      severity: "warning",
      title: "High occupancy",
      description: `${Math.round((kpis.occupied / kpis.total) * 100)}% of rooms are in use today.`,
      href: "/calendar",
    });
  }

  const departuresToday = bookings.filter(
    (booking) =>
      booking.check_out === today &&
      booking.status !== "cancelled" &&
      booking.status !== "checked_out"
  ).length;

  if (departuresToday > 0) {
    alerts.push({
      id: "departures-today",
      severity: "info",
      title: `${departuresToday} departure${departuresToday === 1 ? "" : "s"} today`,
      description: "Coordinate housekeeping and front desk check-outs.",
      href: "/calendar",
    });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);
  const arrivalsTomorrow = bookings.filter(
    (booking) =>
      booking.check_in === tomorrowKey && booking.status === "confirmed"
  ).length;

  if (arrivalsTomorrow > 0) {
    alerts.push({
      id: "arrivals-tomorrow",
      severity: "info",
      title: `${arrivalsTomorrow} arrival${arrivalsTomorrow === 1 ? "" : "s"} tomorrow`,
      description: "Prepare rooms and welcome packages ahead of check-in.",
      href: "/bookings",
    });
  }

  return alerts.slice(0, 4);
}
