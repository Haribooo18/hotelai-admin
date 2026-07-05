"use client";

import { useMemo } from "react";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";
import { placeBooking } from "@/lib/calendar";
import { cn } from "@/lib/utils";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import {
  buildBookingCardModels,
  formatBookingCurrency,
} from "@/components/dashboard/bookings/booking-ops-metrics";
import {
  DashboardEmptyState,
} from "@/components/dashboard/home/DashboardPrimitives";
import { CalendarDays } from "lucide-react";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  days: Date[];
  onOpen: (booking: Booking) => void;
};

export function CalendarAgenda({
  rooms,
  bookings,
  guests,
  days,
  onOpen,
}: Props) {
  const roomName = useMemo(
    () => new Map(rooms.map((room) => [room.id, room.room_type])),
    [rooms]
  );

  const visible = useMemo(
    () =>
      bookings
        .filter((booking) => placeBooking(booking, days))
        .sort((a, b) => a.check_in.localeCompare(b.check_in)),
    [bookings, days]
  );

  const modelsById = useMemo(() => {
    const models = buildBookingCardModels(visible, rooms, guests);
    return new Map(models.map((model) => [model.booking.id, model]));
  }, [visible, rooms, guests]);

  if (visible.length === 0) {
    return (
      <DashboardEmptyState
        title="No reservations in this period"
        description="Adjust filters or navigate to another date range."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <div className="space-y-2">
      {visible.map((booking) => {
        const model = modelsById.get(booking.id);
        if (!model) return null;
        const displayName = model.guest
          ? `${model.guest.first_name} ${model.guest.last_name}`.trim()
          : booking.guest_name;

        return (
          <button
            key={booking.id}
            type="button"
            onClick={() => onOpen(booking)}
            className={cn(
              "flex w-full items-center justify-between gap-4 rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-4 text-left shadow-[var(--shell-shadow-sm)] transition-[transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-md)]",
              "flex-col items-stretch sm:flex-row sm:items-center"
            )}
          >
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-[var(--shell-text)]">
                {displayName}
              </div>
              <div className="mt-1 truncate text-[12px] text-[var(--shell-muted)]">
                {roomName.get(booking.room_id) ?? "—"} · {booking.check_in} →{" "}
                {booking.check_out} · {model.nights}n
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <BookingStatusBadge status={booking.status} />
                <PaymentStatusBadge status={model.paymentStatus} />
              </div>
              <span className="text-[13px] font-semibold text-[var(--shell-text)]">
                {formatBookingCurrency(Number(booking.total_price))}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
