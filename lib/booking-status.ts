import type { BookingStatus } from "@/types/booking";

type BookingStatusMeta = {
  value: BookingStatus;
  label: string;
  badgeClassName: string;
  /** Solid fill used for calendar booking bars. */
  barClassName: string;
};

/**
 * Single source of truth for booking status labels, ordering, badge styles, and
 * filter options. Used by BookingStatusBadge and BookingsFilters.
 */
export const BOOKING_STATUSES: BookingStatusMeta[] = [
  {
    value: "confirmed",
    label: "Подтверждено",
    badgeClassName:
      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    barClassName: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  {
    value: "checked_in",
    label: "Заселен",
    badgeClassName: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    barClassName: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  {
    value: "checked_out",
    label: "Выселен",
    badgeClassName: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30",
    barClassName: "bg-zinc-600 hover:bg-zinc-500 text-white",
  },
  {
    value: "cancelled",
    label: "Отменено",
    badgeClassName: "bg-red-500/15 text-red-400 border border-red-500/30",
    barClassName: "bg-red-600/70 hover:bg-red-600 text-white line-through",
  },
];

const byValue = new Map(BOOKING_STATUSES.map((s) => [s.value, s]));

export function getBookingStatusMeta(status: string) {
  return byValue.get(status as BookingStatus);
}

export const BOOKING_STATUS_OPTIONS = BOOKING_STATUSES.map(
  ({ value, label }) => ({ value, label })
);
