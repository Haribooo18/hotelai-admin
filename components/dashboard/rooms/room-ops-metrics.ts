import type { Booking } from "@/types/booking";
import type { BookingPaymentStatus } from "@/components/dashboard/bookings/booking-ops-metrics";
import type { Room } from "@/types/room";

import { derivePaymentStatus } from "@/components/dashboard/bookings/booking-ops-metrics";
import {
  countNights,
  isActiveStay,
  todayIso,
} from "@/lib/dashboard/date";
import { formatCurrency, formatDateShort } from "@/lib/dashboard/format";

import { formatTranslation } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

export type HousekeepingLabelKey =
  | "hkOccupiedService"
  | "hkPostCheckout"
  | "hkPreArrival"
  | "hkVacantReady";

export function translateHousekeepingLabelKey(
  t: (path: TranslationPath) => string,
  key: HousekeepingLabelKey
): string {
  return t(`rooms.${key}`);
}

export function translateRoomFloor(
  floorLabel: string,
  t: (path: TranslationPath) => string
): string {
  const match = floorLabel.match(/^Floor (\d+)$/);
  if (match?.[1]) {
    return t("rooms.floorLabel").replace("{floor}", match[1]);
  }
  return floorLabel;
}

export type RoomOperationalStatus =
  | "available"
  | "occupied"
  | "cleaning"
  | "maintenance"
  | "reserved";

export type HousekeepingStatus = "clean" | "dirty" | "inspected";

export type RoomSortKey =
  | "type_asc"
  | "type_desc"
  | "price_asc"
  | "price_desc"
  | "capacity"
  | "status";

export type RoomViewMode = "cards" | "table";

export type RoomOpsKpis = {
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  averageOccupancy: number;
  adr: number;
  revenueToday: number;
};

export type RoomCardModel = {
  room: Room;
  status: RoomOperationalStatus;
  currentGuest: string | null;
  activeBooking: Booking | null;
  upcomingBooking: Booking | null;
  housekeepingLabelKey: HousekeepingLabelKey;
  cleaningProgress: number;
  roomCode: string;
  floorLabel: string;
  housekeepingStatus: HousekeepingStatus;
  revenueToday: number;
};

export type RoomOperationsSnapshot = {
  housekeepingQueue: RoomCardModel[];
  maintenanceQueue: RoomCardModel[];
  arrivals: Booking[];
  departures: Booking[];
  vacantReady: RoomCardModel[];
  occupancyByType: Array<{ label: string; occupied: number; total: number }>;
};

const STATUS_META: Record<
  RoomOperationalStatus,
  { label: string; badgeClass: string; icon: string }
> = {
  available: {
    label: "Available",
    badgeClass: "bg-emerald-500/15 text-emerald-500",
    icon: "available",
  },
  occupied: {
    label: "Occupied",
    badgeClass: "bg-blue-500/15 text-blue-400",
    icon: "occupied",
  },
  cleaning: {
    label: "Housekeeping",
    badgeClass: "bg-amber-500/15 text-amber-400",
    icon: "cleaning",
  },
  maintenance: {
    label: "Maintenance",
    badgeClass: "bg-red-500/15 text-red-400",
    icon: "maintenance",
  },
  reserved: {
    label: "Reserved",
    badgeClass: "bg-violet-500/15 text-violet-400",
    icon: "reserved",
  },
};

const HOUSEKEEPING_META: Record<
  HousekeepingStatus,
  { label: string; badgeClass: string }
> = {
  clean: {
    label: "Clean",
    badgeClass: "bg-emerald-500/12 text-emerald-400",
  },
  dirty: {
    label: "Dirty",
    badgeClass: "bg-amber-500/12 text-amber-400",
  },
  inspected: {
    label: "Inspected",
    badgeClass: "bg-sky-500/12 text-sky-400",
  },
};

function nightsBetween(checkIn: string, checkOut: string): number {
  return countNights(checkIn, checkOut);
}

function isStayingToday(booking: Booking, today: string): boolean {
  return isActiveStay(booking, today);
}

export function getRoomStatusMeta(status: RoomOperationalStatus) {
  return STATUS_META[status];
}

export function getHousekeepingMeta(status: HousekeepingStatus) {
  return HOUSEKEEPING_META[status];
}

export const formatRoomCurrency = formatCurrency;

export const formatRoomDate = formatDateShort;

export function getGuestInitials(name: string | null): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildRoomCode(room: Room, index: number): string {
  const digits = room.room_type.match(/\d+/);
  if (digits?.[0]) return digits[0].padStart(2, "0");

  return String(index + 1).padStart(2, "0");
}

export function extractRoomFloor(room: Room): string {
  const match = room.room_type.match(/^(\d+)\s*(?:этаж|floor)/i);
  if (match?.[1]) return `Floor ${match[1]}`;

  const leadingNumber = room.room_type.match(/^(\d{1,2})\D/);
  if (leadingNumber?.[1]) return `Floor ${leadingNumber[1]}`;

  return "Floor 1";
}

export function extractFloorOptions(rooms: Room[]): string[] {
  return Array.from(new Set(rooms.map(extractRoomFloor))).sort();
}

function deriveHousekeepingStatus(
  status: RoomOperationalStatus,
  cleaningProgress: number
): HousekeepingStatus {
  if (status === "cleaning") return "dirty";
  if (status === "available" && cleaningProgress === 100) return "inspected";
  if (cleaningProgress === 100) return "clean";
  return "dirty";
}

function roomRevenueToday(roomId: string, bookings: Booking[]): number {
  const today = todayIso();

  return bookings
    .filter(
      (booking) =>
        booking.room_id === roomId &&
        booking.status !== "cancelled" &&
        (booking.check_in === today || isStayingToday(booking, today))
    )
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);
}

function resolveRoomStatus(
  room: Room,
  bookings: Booking[],
  today: string
): Pick<
  RoomCardModel,
  | "status"
  | "currentGuest"
  | "activeBooking"
  | "upcomingBooking"
  | "housekeepingLabelKey"
  | "cleaningProgress"
> {
  const roomBookings = bookings.filter((booking) => booking.room_id === room.id);

  const activeBooking =
    roomBookings.find(
      (booking) =>
        booking.status === "checked_in" || isStayingToday(booking, today)
    ) ?? null;

  const checkoutToday = roomBookings.find(
    (booking) =>
      booking.check_out === today &&
      booking.status !== "cancelled" &&
      booking.status !== "checked_out"
  );

  const upcomingBooking =
    roomBookings
      .filter(
        (booking) =>
          booking.status === "confirmed" &&
          booking.check_in > today &&
          !activeBooking
      )
      .sort((a, b) => a.check_in.localeCompare(b.check_in))[0] ?? null;

  if (activeBooking) {
    return {
      status: "occupied",
      currentGuest: activeBooking.guest_name,
      activeBooking,
      upcomingBooking,
      housekeepingLabelKey: "hkOccupiedService",
      cleaningProgress: 0,
    };
  }

  if (checkoutToday) {
    return {
      status: "cleaning",
      currentGuest: null,
      activeBooking: checkoutToday,
      upcomingBooking,
      housekeepingLabelKey: "hkPostCheckout",
      cleaningProgress: 45,
    };
  }

  if (upcomingBooking) {
    return {
      status: "reserved",
      currentGuest: upcomingBooking.guest_name,
      activeBooking: null,
      upcomingBooking,
      housekeepingLabelKey: "hkPreArrival",
      cleaningProgress: 70,
    };
  }

  return {
    status: "available",
    currentGuest: null,
    activeBooking: null,
    upcomingBooking,
    housekeepingLabelKey: "hkVacantReady",
    cleaningProgress: 100,
  };
}

export function buildRoomCardModels(
  rooms: Room[],
  bookings: Booking[]
): RoomCardModel[] {
  const today = todayIso();

  return rooms.map((room, index) => {
    const resolved = resolveRoomStatus(room, bookings, today);
    const housekeepingStatus = deriveHousekeepingStatus(
      resolved.status,
      resolved.cleaningProgress
    );

    return {
      room,
      roomCode: buildRoomCode(room, index),
      floorLabel: extractRoomFloor(room),
      housekeepingStatus,
      revenueToday: roomRevenueToday(room.id, bookings),
      ...resolved,
    };
  });
}

export function computeRoomOpsKpis(
  models: RoomCardModel[],
  bookings: Booking[] = []
): RoomOpsKpis {
  const total = models.length;
  const available = models.filter((model) => model.status === "available").length;
  const occupied = models.filter((model) => model.status === "occupied").length;
  const cleaning = models.filter((model) => model.status === "cleaning").length;
  const maintenance = models.filter(
    (model) => model.status === "maintenance"
  ).length;

  const averageOccupancy =
    total > 0
      ? Math.round(((occupied + cleaning + reservedCount(models)) / total) * 100)
      : 0;

  const today = todayIso();
  const todayBookings = bookings.filter(
    (booking) =>
      booking.check_in === today && booking.status !== "cancelled"
  );

  const revenueToday = todayBookings.reduce(
    (sum, booking) => sum + Number(booking.total_price),
    0
  );

  const nights = todayBookings.reduce(
    (sum, booking) => sum + nightsBetween(booking.check_in, booking.check_out),
    0
  );

  const adr = nights > 0 ? revenueToday / nights : 0;

  return {
    total,
    available,
    occupied,
    cleaning,
    maintenance,
    averageOccupancy,
    adr,
    revenueToday,
  };
}

function reservedCount(models: RoomCardModel[]): number {
  return models.filter((model) => model.status === "reserved").length;
}

export function buildRoomOperationsSnapshot(
  models: RoomCardModel[],
  bookings: Booking[]
): RoomOperationsSnapshot {
  const today = todayIso();

  const typeMap = new Map<string, { occupied: number; total: number }>();

  for (const model of models) {
    const current = typeMap.get(model.room.room_type) ?? {
      occupied: 0,
      total: 0,
    };
    current.total += 1;
    if (model.status === "occupied" || model.status === "reserved") {
      current.occupied += 1;
    }
    typeMap.set(model.room.room_type, current);
  }

  return {
    housekeepingQueue: models.filter((model) => model.status === "cleaning"),
    maintenanceQueue: models.filter((model) => model.status === "maintenance"),
    arrivals: bookings
      .filter(
        (booking) =>
          booking.check_in === today && booking.status !== "cancelled"
      )
      .sort((a, b) => a.guest_name.localeCompare(b.guest_name)),
    departures: bookings
      .filter(
        (booking) =>
          booking.check_out === today && booking.status !== "cancelled"
      )
      .sort((a, b) => a.guest_name.localeCompare(b.guest_name)),
    vacantReady: models.filter(
      (model) =>
        model.status === "available" && model.housekeepingStatus === "inspected"
    ),
    occupancyByType: Array.from(typeMap.entries())
      .map(([label, value]) => ({ label, ...value }))
      .sort((a, b) => b.occupied - a.occupied),
  };
}

export function getRoomMonthRevenue(
  roomId: string,
  bookings: Booking[]
): number {
  const monthPrefix = todayIso().slice(0, 7);

  return bookings
    .filter(
      (booking) =>
        booking.room_id === roomId &&
        booking.check_in.startsWith(monthPrefix) &&
        booking.status !== "cancelled"
    )
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);
}

export function getStayPaymentLabel(
  booking: Booking | null
): BookingPaymentStatus | null {
  if (!booking) return null;
  return derivePaymentStatus(booking);
}

export function sortRoomModels(
  models: RoomCardModel[],
  sortKey: RoomSortKey
): RoomCardModel[] {
  const sorted = [...models];

  sorted.sort((a, b) => {
    switch (sortKey) {
      case "type_asc":
        return a.room.room_type.localeCompare(b.room.room_type, "ru");
      case "type_desc":
        return b.room.room_type.localeCompare(a.room.room_type, "ru");
      case "price_asc":
        return a.room.price - b.room.price;
      case "price_desc":
        return b.room.price - a.room.price;
      case "capacity":
        return b.room.capacity - a.room.capacity;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return sorted;
}

export function getRoomBookings(roomId: string, bookings: Booking[]): Booking[] {
  return bookings
    .filter((booking) => booking.room_id === roomId)
    .sort((a, b) => b.check_in.localeCompare(a.check_in));
}

export function extractRoomTypeOptions(rooms: Room[]): string[] {
  return Array.from(new Set(rooms.map((room) => room.room_type))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );
}

export type RoomTimelineItemKind = "booking" | "room_created";

export type RoomTimelineItem = {
  id: string;
  kind: RoomTimelineItemKind;
  guestName?: string;
  bookingStatus?: string;
  subtitle: string;
  at: string;
};

export function buildRoomTimeline(
  room: Room,
  bookings: Booking[]
): RoomTimelineItem[] {
  const items: RoomTimelineItem[] = bookings.map((booking) => ({
    id: booking.id,
    kind: "booking",
    guestName: booking.guest_name,
    bookingStatus: booking.status,
    subtitle: `${booking.check_in} — ${booking.check_out}`,
    at: booking.created_at,
  }));

  items.push({
    id: `room-${room.id}`,
    kind: "room_created",
    subtitle: room.room_type,
    at: room.id,
  });

  return items.sort((a, b) => b.at.localeCompare(a.at));
}

export function translateRoomTimelineItem(
  item: RoomTimelineItem,
  t: (path: TranslationPath) => string
): { title: string; subtitle: string } {
  switch (item.kind) {
    case "booking": {
      const status = item.bookingStatus ?? "confirmed";
      return {
        title: formatTranslation(t("rooms.timelineBooking"), {
          guest: item.guestName ?? "",
          status: t(`statuses.booking.${status}` as "statuses.booking.confirmed"),
        }),
        subtitle: item.subtitle,
      };
    }
    case "room_created":
      return {
        title: t("rooms.timelineRoomCreated"),
        subtitle: item.subtitle,
      };
    default:
      return { title: item.id, subtitle: item.subtitle };
  }
}
