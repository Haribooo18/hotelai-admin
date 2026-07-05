"use client";

import { useMemo } from "react";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";
import { placeBooking } from "@/lib/calendar";
import { isActiveStay, todayIso } from "@/lib/dashboard/date";

import { Badge } from "@/components/ui/display/Badge";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import {
  buildBookingCardModels,
  formatBookingCurrency,
} from "@/components/dashboard/bookings/booking-ops-metrics";
import { CalendarDays } from "lucide-react";

import { CalendarAgendaCard } from "./calendar-ui";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  days: Date[];
  selectedId?: string | null;
  onOpen: (booking: Booking) => void;
};

function getStayBadge(booking: Booking, today: string) {
  if (isActiveStay(booking, today)) {
    return { label: "Current stay", variant: "default" as const };
  }
  if (booking.check_in === today) {
    return { label: "Arrival", variant: "success" as const };
  }
  if (booking.check_out === today) {
    return { label: "Departure", variant: "warning" as const };
  }
  return null;
}

export function CalendarAgenda({
  rooms,
  bookings,
  guests,
  days,
  selectedId = null,
  onOpen,
}: Props) {
  const today = todayIso();

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
      <EmptyState
        title="No reservations in this period"
        description="Adjust filters or navigate to another date range."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <Section title="Agenda" subtitle="Reservations in the visible range">
      <div className="space-y-2" role="list" aria-label="Calendar agenda">
        {visible.map((booking) => {
          const model = modelsById.get(booking.id);
          if (!model) return null;

          const displayName = model.guest
            ? `${model.guest.first_name} ${model.guest.last_name}`.trim()
            : booking.guest_name;
          const stayBadge = getStayBadge(booking, today);

          return (
            <CalendarAgendaCard
              key={booking.id}
              selected={selectedId === booking.id}
              aria-label={`Open reservation for ${displayName}`}
              aria-pressed={selectedId === booking.id}
              onClick={() => onOpen(booking)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-[14px] font-semibold text-[var(--shell-text)]">
                    {displayName}
                  </span>
                  {stayBadge ? (
                    <Badge variant={stayBadge.variant}>{stayBadge.label}</Badge>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-[12px] text-[var(--shell-muted)]">
                  {roomName.get(booking.room_id) ?? "—"} · {booking.check_in} →{" "}
                  {booking.check_out} · {model.nights}n
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <BookingStatusBadge status={booking.status} />
                  <PaymentStatusBadge status={model.paymentStatus} />
                </div>
                <span className="text-[13px] font-semibold text-[var(--shell-text)]">
                  {formatBookingCurrency(Number(booking.total_price))}
                </span>
              </div>
            </CalendarAgendaCard>
          );
        })}
      </div>
    </Section>
  );
}
