import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

import {
  countNights as sharedCountNights,
  isActiveStay,
  todayIso,
} from "@/lib/dashboard/date";
import {
  formatCurrency,
  formatDateFull,
} from "@/lib/dashboard/format";

export type BookingViewMode = "cards" | "table";

export type BookingPaymentStatus = "paid" | "deposit" | "pending" | "void";

export type BookingSource = "direct" | "online" | "phone";

export type BookingOpsKpis = {
  checkInsToday: number;
  checkOutsToday: number;
  activeStays: number;
  occupancyPercent: number;
  revenueTotal: number;
};

export type BookingStayTimelineItem = {
  id: string;
  label: string;
  detail: string;
  at: string;
  kind: "created" | "check_in" | "stay" | "check_out" | "status";
};

export type BookingCardModel = {
  booking: Booking;
  roomLabel: string;
  room: Room | null;
  guest: Guest | null;
  nights: number;
  guestCount: number;
  paymentStatus: BookingPaymentStatus;
  source: BookingSource;
  internalNotes: string | null;
};

export function countNights(checkIn: string, checkOut: string): number {
  return sharedCountNights(checkIn, checkOut);
}

export const formatBookingCurrency = formatCurrency;

export const formatBookingDate = formatDateFull;

export function formatBookingDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function computeBookingOpsKpis(
  bookings: Booking[],
  roomCount: number
): BookingOpsKpis {
  const today = todayIso();

  const checkInsToday = bookings.filter(
    (booking) =>
      booking.check_in === today && booking.status !== "cancelled"
  ).length;

  const checkOutsToday = bookings.filter(
    (booking) =>
      booking.check_out === today && booking.status !== "cancelled"
  ).length;

  const activeStays = bookings.filter((booking) =>
    isActiveStay(booking, today)
  ).length;

  const occupancyPercent =
    roomCount > 0 ? Math.round((activeStays / roomCount) * 100) : 0;

  const revenueTotal = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);

  return {
    checkInsToday,
    checkOutsToday,
    activeStays,
    occupancyPercent,
    revenueTotal,
  };
}

export function derivePaymentStatus(
  booking: Booking
): BookingPaymentStatus {
  switch (booking.status) {
    case "checked_out":
      return "paid";
    case "checked_in":
      return "deposit";
    case "cancelled":
      return "void";
    default:
      return "pending";
  }
}

export function deriveBookingSource(booking: Booking): BookingSource {
  if (booking.guest_email) return "online";
  if (booking.guest_phone) return "phone";
  return "direct";
}

export function matchGuestForBooking(
  booking: Booking,
  guests: Guest[]
): Guest | null {
  const ctx = createBookingLookupContext([], guests);
  return matchGuestFromContext(booking, ctx);
}

type BookingLookupContext = {
  roomById: Map<string, Room>;
  guestByEmail: Map<string, Guest>;
  guestByName: Map<string, Guest>;
};

function createBookingLookupContext(
  rooms: Room[],
  guests: Guest[]
): BookingLookupContext {
  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const guestByEmail = new Map<string, Guest>();
  const guestByName = new Map<string, Guest>();

  for (const guest of guests) {
    if (guest.email) {
      guestByEmail.set(guest.email.trim().toLowerCase(), guest);
    }

    guestByName.set(
      `${guest.first_name} ${guest.last_name}`.trim().toLowerCase(),
      guest
    );
  }

  return { roomById, guestByEmail, guestByName };
}

function matchGuestFromContext(
  booking: Booking,
  ctx: BookingLookupContext
): Guest | null {
  const email = booking.guest_email?.trim().toLowerCase();
  if (email) {
    const byEmail = ctx.guestByEmail.get(email);
    if (byEmail) return byEmail;
  }

  return ctx.guestByName.get(booking.guest_name.trim().toLowerCase()) ?? null;
}

function buildBookingCardModelWithContext(
  booking: Booking,
  ctx: BookingLookupContext
): BookingCardModel {
  const room = ctx.roomById.get(booking.room_id) ?? null;
  const guest = matchGuestFromContext(booking, ctx);

  return {
    booking,
    room,
    roomLabel: room?.room_type ?? "Room not assigned",
    guest,
    nights: countNights(booking.check_in, booking.check_out),
    guestCount: booking.adults + booking.children,
    paymentStatus: derivePaymentStatus(booking),
    source: deriveBookingSource(booking),
    internalNotes: guest?.notes ?? null,
  };
}

export function buildRoomLabel(roomId: string, rooms: Room[]): string {
  const room = rooms.find((item) => item.id === roomId);
  return room?.room_type ?? "Room not assigned";
}

export function buildBookingCardModel(
  booking: Booking,
  rooms: Room[],
  guests: Guest[]
): BookingCardModel {
  const ctx = createBookingLookupContext(rooms, guests);
  return buildBookingCardModelWithContext(booking, ctx);
}

export function buildBookingCardModels(
  bookings: Booking[],
  rooms: Room[],
  guests: Guest[]
): BookingCardModel[] {
  const ctx = createBookingLookupContext(rooms, guests);
  return bookings.map((booking) =>
    buildBookingCardModelWithContext(booking, ctx)
  );
}

export function buildBookingStayTimeline(
  booking: Booking
): BookingStayTimelineItem[] {
  const items: BookingStayTimelineItem[] = [
    {
      id: "created",
      label: "Reservation created",
      detail: `Booking reference ${booking.id.slice(0, 8)}`,
      at: booking.created_at,
      kind: "created",
    },
    {
      id: "check-in",
      label: "Scheduled check-in",
      detail: formatBookingDate(booking.check_in),
      at: booking.check_in,
      kind: "check_in",
    },
    {
      id: "stay",
      label: "Stay period",
      detail: `${countNights(booking.check_in, booking.check_out)} nights · ${booking.adults + booking.children} guests`,
      at: booking.check_in,
      kind: "stay",
    },
    {
      id: "check-out",
      label: "Scheduled check-out",
      detail: formatBookingDate(booking.check_out),
      at: booking.check_out,
      kind: "check_out",
    },
    {
      id: "status",
      label: "Current status",
      detail: booking.status.replace("_", " "),
      at: booking.updated_at,
      kind: "status",
    },
  ];

  return items;
}

export function getGuestInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
