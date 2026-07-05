import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

export type RoomOperationalStatus =
  | "available"
  | "occupied"
  | "cleaning"
  | "maintenance"
  | "reserved";

export type RoomSortKey =
  | "type_asc"
  | "type_desc"
  | "price_asc"
  | "price_desc"
  | "capacity"
  | "status";

export type RoomViewMode = "grid" | "list";

export type RoomOpsKpis = {
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  averageOccupancy: number;
};

export type RoomCardModel = {
  room: Room;
  status: RoomOperationalStatus;
  currentGuest: string | null;
  activeBooking: Booking | null;
  upcomingBooking: Booking | null;
  housekeepingLabel: string;
  cleaningProgress: number;
  roomCode: string;
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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isStayingToday(booking: Booking, today: string): boolean {
  if (booking.status === "cancelled" || booking.status === "checked_out") {
    return false;
  }

  return booking.check_in <= today && booking.check_out > today;
}

export function getRoomStatusMeta(status: RoomOperationalStatus) {
  return STATUS_META[status];
}

export function formatRoomCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRoomDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function buildRoomCode(room: Room, index: number): string {
  const digits = room.room_type.match(/\d+/);
  if (digits?.[0]) return digits[0].padStart(2, "0");

  return String(index + 1).padStart(2, "0");
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
  | "housekeepingLabel"
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
      housekeepingLabel: "No housekeeping needed",
      cleaningProgress: 0,
    };
  }

  if (checkoutToday) {
    return {
      status: "cleaning",
      currentGuest: null,
      activeBooking: checkoutToday,
      upcomingBooking,
      housekeepingLabel: "Post-checkout cleaning",
      cleaningProgress: 45,
    };
  }

  if (upcomingBooking) {
    return {
      status: "reserved",
      currentGuest: upcomingBooking.guest_name,
      activeBooking: null,
      upcomingBooking,
      housekeepingLabel: "Pre-arrival preparation",
      cleaningProgress: 70,
    };
  }

  return {
    status: "available",
    currentGuest: null,
    activeBooking: null,
    upcomingBooking,
    housekeepingLabel: "Ready for check-in",
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

    return {
      room,
      roomCode: buildRoomCode(room, index),
      ...resolved,
    };
  });
}

export function computeRoomOpsKpis(models: RoomCardModel[]): RoomOpsKpis {
  const total = models.length;
  const available = models.filter((m) => m.status === "available").length;
  const occupied = models.filter((m) => m.status === "occupied").length;
  const cleaning = models.filter((m) => m.status === "cleaning").length;
  const maintenance = models.filter((m) => m.status === "maintenance").length;

  const averageOccupancy =
    total > 0 ? Math.round(((occupied + cleaning + maintenance) / total) * 100) : 0;

  return {
    total,
    available,
    occupied,
    cleaning,
    maintenance,
    averageOccupancy,
  };
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

export type RoomTimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  at: string;
};

export function buildRoomTimeline(
  room: Room,
  bookings: Booking[]
): RoomTimelineItem[] {
  const items: RoomTimelineItem[] = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.guest_name} · ${booking.status}`,
    subtitle: `${booking.check_in} — ${booking.check_out}`,
    at: booking.created_at,
  }));

  items.push({
    id: `room-${room.id}`,
    title: "Room created",
    subtitle: room.room_type,
    at: room.id,
  });

  return items.sort((a, b) => b.at.localeCompare(a.at));
}
