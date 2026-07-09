"use client";

import { useMemo } from "react";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";
import { placeBooking } from "@/lib/calendar";
import { isActiveStay, todayIso } from "@/lib/dashboard/date";

import { Badge } from "@/components/ui/display/Badge";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import {
  buildBookingCardModels,
  formatBookingCurrency,
} from "@/components/dashboard/bookings/booking-ops-metrics";
import { CalendarDays } from "lucide-react";
import { useI18n } from "@/lib/i18n";

import { CalendarAgendaCard } from "./calendar-ui";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  days: Date[];
  selectedId?: string | null;
  onOpen: (booking: Booking) => void;
};

function getStayBadge(
  booking: Booking,
  today: string,
  t: ReturnType<typeof useI18n>["t"]
) {
  if (isActiveStay(booking, today)) {
    return { label: t("calendar.currentStay"), variant: "default" as const };
  }
  if (booking.check_in === today) {
    return { label: t("calendar.arrival"), variant: "success" as const };
  }
  if (booking.check_out === today) {
    return { label: t("calendar.departure"), variant: "warning" as const };
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
  const { t } = useI18n();
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
      <WorkspaceEmptyState
        title={t("calendar.agendaEmpty")}
        description={t("calendar.agendaEmptyDesc")}
        guidance={t("workspace.calendar.emptyGuidance")}
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <Section title={t("calendar.agenda")} subtitle={t("calendar.agendaSubtitle")}>
      <div className="space-y-2" role="list" aria-label={t("calendar.agendaAriaLabel")}>
        {visible.map((booking) => {
          const model = modelsById.get(booking.id);
          if (!model) return null;

          const displayName = model.guest
            ? `${model.guest.first_name} ${model.guest.last_name}`.trim()
            : booking.guest_name;
          const stayBadge = getStayBadge(booking, today, t);

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
