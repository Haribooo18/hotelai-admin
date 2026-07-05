"use client";

import { CalendarDays, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { isActiveStay, todayIso } from "@/lib/dashboard/date";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import {
  formatBookingCurrency,
  formatBookingDate,
  type BookingCardModel,
} from "@/components/dashboard/bookings/booking-ops-metrics";

import { CalendarDetailRow } from "./calendar-ui";

type Props = {
  model: BookingCardModel | null;
  onOpen?: () => void;
};

export function CalendarInspector({ model, onOpen }: Props) {
  if (!model) {
    return (
      <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
        <Section title="Inspector" subtitle="Selected reservation details" />
        <EmptyState
          title="No reservation selected"
          description="Select a booking on the timeline or agenda to inspect details."
          icon={<CalendarDays size={18} />}
        />
      </Panel>
    );
  }

  const { booking, guest, roomLabel, nights, paymentStatus } = model;
  const displayName = guest
    ? `${guest.first_name} ${guest.last_name}`.trim()
    : booking.guest_name;
  const today = todayIso();

  const stayKind = (() => {
    if (isActiveStay(booking, today)) return "Current stay";
    if (booking.check_in === today) return "Arrival";
    if (booking.check_out === today) return "Departure";
    return "Scheduled stay";
  })();

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <Section
        title="Inspector"
        subtitle={stayKind}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpen}
            className="gap-1.5"
          >
            <ExternalLink size={14} />
            Open
          </Button>
        }
      />

      <div className="mt-4 flex items-start gap-3">
        {guest ? (
          <GuestAvatar
            firstName={guest.first_name}
            lastName={guest.last_name}
            avatarUrl={guest.avatar_url}
            size="sm"
          />
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--shell-text)]">
            {displayName}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
            {roomLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <BookingStatusBadge status={booking.status} />
        <PaymentStatusBadge status={paymentStatus} />
      </div>

      <dl className="mt-4 grid gap-2">
        <CalendarDetailRow
          label="Check-in"
          value={formatBookingDate(booking.check_in)}
        />
        <CalendarDetailRow
          label="Check-out"
          value={formatBookingDate(booking.check_out)}
        />
        <CalendarDetailRow label="Nights" value={String(nights)} />
        <CalendarDetailRow
          label="Revenue"
          value={formatBookingCurrency(Number(booking.total_price))}
        />
      </dl>
    </Panel>
  );
}
