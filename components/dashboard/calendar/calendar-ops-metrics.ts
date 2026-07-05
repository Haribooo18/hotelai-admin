import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  buildRoomCardModels,
  type RoomOperationalStatus,
} from "@/components/dashboard/rooms/room-ops-metrics";
import type { BookingPaymentStatus } from "@/components/dashboard/bookings/booking-ops-metrics";

export type CalendarOpsKpis = {
  occupancyPercent: number;
  checkInsToday: number;
  checkOutsToday: number;
  availableRooms: number;
  revenueToday: number;
  activeStays: number;
};

export type CalendarRoomModel = {
  room: Room;
  status: RoomOperationalStatus;
  isAvailableToday: boolean;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isActiveStay(booking: Booking, today: string): boolean {
  if (booking.status === "cancelled" || booking.status === "checked_out") {
    return false;
  }

  return booking.check_in <= today && booking.check_out > today;
}

export function computeCalendarOpsKpis(
  bookings: Booking[],
  rooms: Room[]
): CalendarOpsKpis {
  const today = todayIso();
  const roomCount = rooms.length;

  const activeBookings = bookings.filter((booking) =>
    isActiveStay(booking, today)
  );

  const occupiedRoomIds = new Set(
    activeBookings.map((booking) => booking.room_id)
  );

  const checkInsToday = bookings.filter(
    (booking) =>
      booking.check_in === today && booking.status !== "cancelled"
  ).length;

  const checkOutsToday = bookings.filter(
    (booking) =>
      booking.check_out === today && booking.status !== "cancelled"
  ).length;

  const revenueToday = bookings
    .filter((booking) => booking.check_in === today)
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);

  const occupancyPercent =
    roomCount > 0
      ? Math.round((occupiedRoomIds.size / roomCount) * 100)
      : 0;

  return {
    occupancyPercent,
    checkInsToday,
    checkOutsToday,
    availableRooms: Math.max(0, roomCount - occupiedRoomIds.size),
    revenueToday,
    activeStays: activeBookings.length,
  };
}

export function buildCalendarRoomModels(
  rooms: Room[],
  bookings: Booking[]
): CalendarRoomModel[] {
  const models = buildRoomCardModels(rooms, bookings);
  const today = todayIso();

  return models.map((model) => ({
    room: model.room,
    status: model.status,
    isAvailableToday:
      model.status === "available" ||
      (model.activeBooking?.check_out === today &&
        model.status === "cleaning"),
  }));
}

export const BOOKING_STATUS_GRADIENT: Record<string, string> = {
  confirmed:
    "bg-gradient-to-r from-emerald-600/95 to-emerald-500/90 text-white shadow-[var(--shell-shadow-sm)]",
  checked_in:
    "bg-gradient-to-r from-sky-600/95 to-sky-500/90 text-white shadow-[var(--shell-shadow-sm)]",
  checked_out:
    "bg-gradient-to-r from-zinc-600/90 to-zinc-500/85 text-white shadow-[var(--shell-shadow-sm)]",
  cancelled:
    "bg-gradient-to-r from-red-600/80 to-red-500/75 text-white/90 line-through opacity-80",
};

export const PAYMENT_DOT: Record<BookingPaymentStatus, string> = {
  paid: "bg-emerald-300",
  deposit: "bg-sky-300",
  pending: "bg-amber-300",
  void: "bg-red-300",
};
