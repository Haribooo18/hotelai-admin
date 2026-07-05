"use client";

import { useMemo } from "react";
import { CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { todayIso } from "@/lib/dashboard/date";
import { formatPercent } from "@/lib/dashboard/format";

import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  buildBookingCardModels,
  derivePaymentStatus,
  formatBookingCurrency,
  formatBookingDate,
  type BookingCardModel,
  type BookingOpsKpis,
} from "./booking-ops-metrics";
import { BookingOpsListItem } from "./bookings-ui";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
  kpis: BookingOpsKpis;
  loading?: boolean;
  onSelect?: (model: BookingCardModel) => void;
};

function OpsBookingList({
  models,
  emptyTitle,
  emptyDescription,
  onSelect,
}: {
  models: BookingCardModel[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: BookingCardModel) => void;
}) {
  if (models.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<CalendarDays size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {models.slice(0, 5).map((model) => (
        <BookingOpsListItem
          key={model.booking.id}
          role="listitem"
          aria-label={`Open reservation for ${model.booking.guest_name}`}
          onClick={() => onSelect?.(model)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                {model.booking.guest_name}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                {model.roomLabel} · {formatBookingDate(model.booking.check_in)}
              </p>
            </div>
            <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
              {formatBookingCurrency(model.booking.total_price)}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <BookingStatusBadge status={model.booking.status} />
            <PaymentStatusBadge status={model.paymentStatus} />
          </div>
        </BookingOpsListItem>
      ))}
    </div>
  );
}

export function BookingsOperations({
  bookings,
  rooms,
  guests,
  kpis,
  loading = false,
  onSelect,
}: Props) {
  const today = todayIso();
  const models = useMemo(
    () => buildBookingCardModels(bookings, rooms, guests),
    [bookings, rooms, guests]
  );

  const arrivalsToday = useMemo(
    () =>
      models.filter(
        (model) =>
          model.booking.check_in === today &&
          model.booking.status !== "cancelled"
      ),
    [models, today]
  );

  const departuresToday = useMemo(
    () =>
      models.filter(
        (model) =>
          model.booking.check_out === today &&
          model.booking.status !== "cancelled"
      ),
    [models, today]
  );

  const pendingPayments = useMemo(
    () =>
      models.filter(
        (model) =>
          derivePaymentStatus(model.booking) === "pending" &&
          model.booking.status !== "cancelled"
      ),
    [models]
  );

  const upcomingStays = useMemo(
    () =>
      models
        .filter(
          (model) =>
            model.booking.check_in > today &&
            model.booking.status !== "cancelled"
        )
        .sort((a, b) => a.booking.check_in.localeCompare(b.booking.check_in)),
    [models, today]
  );

  const recentBookings = useMemo(
    () =>
      [...models].sort(
        (a, b) =>
          new Date(b.booking.created_at).getTime() -
          new Date(a.booking.created_at).getTime()
      ),
    [models]
  );

  if (loading) {
    return (
      <Section title="Operations" subtitle="Today's front-desk activity">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} title="Loading">
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="Operations"
      subtitle="Today's front-desk activity and reservation pipeline"
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title="Today's arrivals"
          subtitle={`${arrivalsToday.length} expected check-ins`}
        >
          <OpsBookingList
            models={arrivalsToday}
            emptyTitle="No arrivals today"
            emptyDescription="Check-ins scheduled for today will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Today's departures"
          subtitle={`${departuresToday.length} expected check-outs`}
        >
          <OpsBookingList
            models={departuresToday}
            emptyTitle="No departures today"
            emptyDescription="Check-outs scheduled for today will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Pending payments"
          subtitle={`${pendingPayments.length} awaiting settlement`}
        >
          <OpsBookingList
            models={pendingPayments}
            emptyTitle="No pending payments"
            emptyDescription="Unpaid reservations will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Upcoming stays"
          subtitle="Future confirmed reservations"
        >
          <OpsBookingList
            models={upcomingStays}
            emptyTitle="No upcoming stays"
            emptyDescription="Future reservations will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Occupancy summary"
          subtitle="Live property utilization"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Active stays
              </p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.activeStays} />
              </p>
            </div>
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Occupancy
              </p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.occupancyPercent} formatter={formatPercent} />
              </p>
            </div>
            <div className="col-span-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Revenue (all active)
              </p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric
                  value={kpis.revenueTotal}
                  formatter={formatBookingCurrency}
                />
              </p>
            </div>
          </div>
        </DataCard>

        <DataCard
          interactive
          title="Recent bookings"
          subtitle="Latest reservation activity"
        >
          <OpsBookingList
            models={recentBookings}
            emptyTitle="No recent bookings"
            emptyDescription="New reservations will appear here."
            onSelect={onSelect}
          />
        </DataCard>
      </div>
    </Section>
  );
}
