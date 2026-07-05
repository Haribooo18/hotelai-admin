import type { Booking } from "@/types/booking";
import type { Guest, GuestStats } from "@/types/guest";
import type { Room } from "@/types/room";

import {
  bookingBelongsToGuest,
  computeGuestStats,
} from "@/lib/guest-stats";

export type GuestSortKey =
  | "name_asc"
  | "name_desc"
  | "activity"
  | "spent"
  | "visits"
  | "newest";

export type GuestViewMode = "grid" | "list";

export type GuestCrmKpis = {
  total: number;
  stayingNow: number;
  vip: number;
  newThisMonth: number;
  averageStayNights: number;
  returning: number;
};

export type GuestCardModel = {
  guest: Guest;
  bookings: Booking[];
  stats: GuestStats;
  activeBooking: Booking | null;
  roomLabel: string | null;
  statusLabel: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isStayingToday(booking: Booking, today: string): boolean {
  if (booking.status === "cancelled" || booking.status === "checked_out") {
    return false;
  }

  return booking.check_in <= today && booking.check_out > today;
}

function resolveRoomLabel(roomId: string, rooms: Room[]): string | null {
  const room = rooms.find((item) => item.id === roomId);
  return room?.room_type ?? null;
}

function resolveStatusLabel(booking: Booking | null): string {
  if (!booking) return "No active stay";

  switch (booking.status) {
    case "checked_in":
      return "Checked in";
    case "confirmed":
      return "Confirmed";
    case "checked_out":
      return "Checked out";
    case "cancelled":
      return "Cancelled";
    default:
      return booking.status;
  }
}

export function buildGuestCardModels(
  guests: Guest[],
  bookings: Booking[],
  rooms: Room[]
): GuestCardModel[] {
  const today = todayIso();

  return guests.map((guest) => {
    const guestBookings = bookings.filter((booking) =>
      bookingBelongsToGuest(booking, guest)
    );

    const activeBooking =
      guestBookings.find(
        (booking) =>
          booking.status === "checked_in" || isStayingToday(booking, today)
      ) ?? null;

    return {
      guest,
      bookings: guestBookings,
      stats: computeGuestStats(guestBookings),
      activeBooking,
      roomLabel: activeBooking
        ? resolveRoomLabel(activeBooking.room_id, rooms)
        : null,
      statusLabel: resolveStatusLabel(activeBooking),
    };
  });
}

export function computeGuestCrmKpis(models: GuestCardModel[]): GuestCrmKpis {
  const currentMonth = monthKey(new Date());

  const stayingNow = models.filter((model) => model.activeBooking !== null).length;
  const vip = models.filter((model) => model.guest.is_vip).length;
  const newThisMonth = models.filter((model) =>
    model.guest.created_at.startsWith(currentMonth)
  ).length;

  const returning = models.filter(
    (model) => model.guest.total_bookings > 1
  ).length;

  const staySamples = models
    .map((model) => model.stats.totalNights)
    .filter((nights) => nights > 0);

  const averageStayNights =
    staySamples.length > 0
      ? Math.round(
          staySamples.reduce((sum, nights) => sum + nights, 0) /
            staySamples.length
        )
      : 0;

  return {
    total: models.length,
    stayingNow,
    vip,
    newThisMonth,
    averageStayNights,
    returning,
  };
}

export function sortGuestModels(
  models: GuestCardModel[],
  sortKey: GuestSortKey
): GuestCardModel[] {
  const sorted = [...models];

  sorted.sort((a, b) => {
    switch (sortKey) {
      case "name_asc":
        return `${a.guest.last_name} ${a.guest.first_name}`.localeCompare(
          `${b.guest.last_name} ${b.guest.first_name}`,
          "ru"
        );
      case "name_desc":
        return `${b.guest.last_name} ${b.guest.first_name}`.localeCompare(
          `${a.guest.last_name} ${a.guest.first_name}`,
          "ru"
        );
      case "activity":
        return (
          new Date(b.guest.updated_at).getTime() -
          new Date(a.guest.updated_at).getTime()
        );
      case "spent":
        return b.guest.total_spent - a.guest.total_spent;
      case "visits":
        return b.guest.total_bookings - a.guest.total_bookings;
      case "newest":
        return (
          new Date(b.guest.created_at).getTime() -
          new Date(a.guest.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  return sorted;
}

export function formatGuestCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatGuestDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatGuestDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export type GuestTimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  at: string;
};

export function buildGuestTimeline(
  guest: Guest,
  bookings: Booking[]
): GuestTimelineItem[] {
  const items: GuestTimelineItem[] = [
    {
      id: `updated-${guest.id}`,
      title: "Profile updated",
      subtitle: "Changes to guest record",
      at: guest.updated_at,
    },
    {
      id: `created-${guest.id}`,
      title: "Profile created",
      subtitle: "Guest added to CRM",
      at: guest.created_at,
    },
  ];

  bookings.forEach((booking) => {
    items.push({
      id: `booking-${booking.id}`,
      title: `Booking · ${booking.status}`,
      subtitle: `${booking.check_in} — ${booking.check_out}`,
      at: booking.created_at,
    });
  });

  return items.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}
