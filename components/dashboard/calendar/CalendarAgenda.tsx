"use client";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import { placeBooking } from "@/lib/calendar";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  days: Date[];
  onOpen: (booking: Booking) => void;
};

export function CalendarAgenda({ rooms, bookings, days, onOpen }: Props) {
  const roomName = new Map(rooms.map((r) => [r.id, r.room_type]));

  const visible = bookings
    .filter((b) => placeBooking(b, days))
    .sort((a, b) => a.check_in.localeCompare(b.check_in));

  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 py-16 text-center text-zinc-500">
        No bookings in the selected period
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map((booking) => (
        <button
          key={booking.id}
          type="button"
          onClick={() => onOpen(booking)}
          className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-emerald-600"
        >
          <div>
            <div className="font-medium">{booking.guest_name}</div>
            <div className="mt-1 text-sm text-zinc-500">
              {roomName.get(booking.room_id) ?? "—"} · {booking.check_in} →{" "}
              {booking.check_out}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <BookingStatusBadge status={booking.status} />
            <span className="text-sm font-medium">${booking.total_price}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
