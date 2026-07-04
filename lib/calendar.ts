import type { Booking } from "@/types/booking";

// Layout constants shared across calendar components.
export const DAY_WIDTH = 56;
export const ROOM_COL_WIDTH = 220;
export const ROW_HEIGHT = 64;

export const MONTHS_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTHS_RU_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

// getDay(): 0 = Sunday … 6 = Saturday
export const WEEKDAYS_SHORT_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export type CalendarView = "month" | "week";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

/** Whole-day difference (b - a), assuming midnight-aligned dates. */
export function diffInDays(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY
  );
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Monday-based start of week. */
export function startOfWeek(date: Date): Date {
  const day = date.getDay(); // 0=Sun
  const diff = (day + 6) % 7; // days since Monday
  return addDays(date, -diff);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isToday(date: Date): boolean {
  return diffInDays(date, new Date()) === 0;
}

/** Ordered list of days for the current view. */
export function buildDays(view: CalendarView, anchor: Date): Date[] {
  if (view === "week") {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  const start = startOfMonth(anchor);
  const count = daysInMonth(anchor);
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}

export function formatRangeTitle(days: Date[], view: CalendarView): string {
  if (days.length === 0) return "";
  const first = days[0];
  const last = days[days.length - 1];

  if (view === "month") {
    return `${MONTHS_RU[first.getMonth()]} ${first.getFullYear()}`;
  }

  const left = `${first.getDate()} ${MONTHS_RU_SHORT[first.getMonth()]}`;
  const right = `${last.getDate()} ${MONTHS_RU_SHORT[last.getMonth()]} ${last.getFullYear()}`;
  return `${left} — ${right}`;
}

export type BookingPlacement = {
  /** Column index of the first visible day (clamped to range). */
  startIndex: number;
  /** Number of day columns the bar spans (>= 1). */
  span: number;
  /** True when the booking starts before the visible range. */
  clippedStart: boolean;
  /** True when the booking ends after the visible range. */
  clippedEnd: boolean;
};

/**
 * Places a booking on the visible day range using half-open [check_in, check_out)
 * semantics (matches the DB no-overlap exclusion constraint). Returns null when
 * the booking does not intersect the range at all.
 */
export function placeBooking(
  booking: Pick<Booking, "check_in" | "check_out">,
  days: Date[]
): BookingPlacement | null {
  if (days.length === 0) return null;

  const rangeStart = days[0];
  const rangeEndExclusive = addDays(days[days.length - 1], 1);

  const checkIn = parseISODate(booking.check_in);
  const checkOut = parseISODate(booking.check_out);

  // No intersection.
  if (checkIn >= rangeEndExclusive || checkOut <= rangeStart) return null;

  const rawStart = diffInDays(rangeStart, checkIn);
  const rawEnd = diffInDays(rangeStart, checkOut); // exclusive

  const startIndex = Math.max(0, rawStart);
  const endIndex = Math.min(days.length, rawEnd);
  const span = Math.max(1, endIndex - startIndex);

  return {
    startIndex,
    span,
    clippedStart: rawStart < 0,
    clippedEnd: rawEnd > days.length,
  };
}

/** Half-open overlap test: [aIn, aOut) ∩ [bIn, bOut). */
export function rangesOverlap(
  aIn: string,
  aOut: string,
  bIn: string,
  bOut: string
): boolean {
  return aIn < bOut && bIn < aOut;
}

/**
 * Detects whether a proposed booking window collides with any other
 * non-cancelled booking in the same room. Used for optimistic client-side
 * guarding before the server/DB confirm.
 */
export function hasRoomConflict(
  bookings: Booking[],
  roomId: string,
  checkIn: string,
  checkOut: string,
  ignoreBookingId?: string
): boolean {
  return bookings.some(
    (b) =>
      b.room_id === roomId &&
      b.id !== ignoreBookingId &&
      b.status !== "cancelled" &&
      rangesOverlap(checkIn, checkOut, b.check_in, b.check_out)
  );
}

export type DayOccupancy = {
  date: Date;
  occupied: number;
  total: number;
  ratio: number;
};

/** Per-day occupancy across all rooms for the visible range. */
export function computeOccupancy(
  bookings: Booking[],
  totalRooms: number,
  days: Date[]
): DayOccupancy[] {
  return days.map((date) => {
    const iso = toISODate(date);
    const nextIso = toISODate(addDays(date, 1));

    const occupiedRooms = new Set(
      bookings
        .filter(
          (b) =>
            b.status !== "cancelled" &&
            rangesOverlap(iso, nextIso, b.check_in, b.check_out)
        )
        .map((b) => b.room_id)
    );
    const occupied = occupiedRooms.size;

    return {
      date,
      occupied,
      total: totalRooms,
      ratio: totalRooms > 0 ? occupied / totalRooms : 0,
    };
  });
}
