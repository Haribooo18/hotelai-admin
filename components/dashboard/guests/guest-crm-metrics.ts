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

export type GuestViewMode = "cards" | "table";

export type GuestStatusFilter = "" | "active" | "returning" | "vip";

export const GUEST_STATUS_FILTERS: { value: GuestStatusFilter; label: string }[] =
  [
    { value: "", label: "All statuses" },
    { value: "active", label: "Active stays" },
    { value: "returning", label: "Returning" },
    { value: "vip", label: "VIP only" },
  ];

export type GuestSatisfaction = "excellent" | "good" | "neutral" | "new";

export type GuestCrmKpis = {
  total: number;
  activeGuests: number;
  returning: number;
  vip: number;
  averageStayNights: number;
  lifetimeRevenue: number;
};

export type GuestCardModel = {
  guest: Guest;
  bookings: Booking[];
  stats: GuestStats;
  activeBooking: Booking | null;
  roomLabel: string | null;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
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
    };
  });
}

export function computeGuestCrmKpis(models: GuestCardModel[]): GuestCrmKpis {
  const activeGuests = models.filter(
    (model) => model.activeBooking !== null
  ).length;
  const vip = models.filter((model) => model.guest.is_vip).length;

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

  const lifetimeRevenue = models.reduce(
    (sum, model) => sum + model.guest.total_spent,
    0
  );

  return {
    total: models.length,
    activeGuests,
    vip,
    averageStayNights,
    returning,
    lifetimeRevenue,
  };
}

export function deriveSatisfaction(model: GuestCardModel): GuestSatisfaction {
  const { guest, stats } = model;

  if (guest.is_vip || guest.total_spent >= 5000 || stats.totalBookings >= 5) {
    return "excellent";
  }

  if (guest.total_bookings >= 2 || guest.total_spent >= 1000) {
    return "good";
  }

  if (stats.totalBookings > 0) {
    return "neutral";
  }

  return "new";
}

export function extractCountryOptions(guests: Guest[]): string[] {
  return Array.from(
    new Set(guests.map((guest) => guest.country).filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b, "ru"));
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
