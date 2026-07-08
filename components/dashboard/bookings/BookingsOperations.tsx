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
import { formatTranslation, useI18n } from "@/lib/i18n";

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
  openReservationLabel,
}: {
  models: BookingCardModel[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: BookingCardModel) => void;
  openReservationLabel: (name: string) => string;
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
          aria-label={openReservationLabel(model.booking.guest_name)}
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
  const { t } = useI18n();
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
      <Section title={t("bookings.operationsTitle")} subtitle={t("bookings.operationsSubtitle")}>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} title={t("bookings.operationsLoading")}>
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t("bookings.operationsTitle")}
      subtitle={t("bookings.operationsSubtitle")}
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title={t("bookings.opsArrivalsTitle")}
          subtitle={formatTranslation(t("bookings.opsArrivalsSubtitle"), {
            count: arrivalsToday.length,
          })}
        >
          <OpsBookingList
            models={arrivalsToday}
            emptyTitle={t("bookings.opsArrivalsEmpty")}
            emptyDescription={t("bookings.opsArrivalsEmptyDesc")}
            onSelect={onSelect}
            openReservationLabel={(name) =>
              formatTranslation(t("bookings.openReservation"), { name })
            }
          />
        </DataCard>

        <DataCard
          interactive
          title={t("bookings.opsDeparturesTitle")}
          subtitle={formatTranslation(t("bookings.opsDeparturesSubtitle"), {
            count: departuresToday.length,
          })}
        >
          <OpsBookingList
            models={departuresToday}
            emptyTitle={t("bookings.opsDeparturesEmpty")}
            emptyDescription={t("bookings.opsDeparturesEmptyDesc")}
            onSelect={onSelect}
            openReservationLabel={(name) =>
              formatTranslation(t("bookings.openReservation"), { name })
            }
          />
        </DataCard>

        <DataCard
          interactive
          title={t("bookings.opsPendingTitle")}
          subtitle={formatTranslation(t("bookings.opsPendingSubtitle"), {
            count: pendingPayments.length,
          })}
        >
          <OpsBookingList
            models={pendingPayments}
            emptyTitle={t("bookings.opsPendingEmpty")}
            emptyDescription={t("bookings.opsPendingEmptyDesc")}
            onSelect={onSelect}
            openReservationLabel={(name) =>
              formatTranslation(t("bookings.openReservation"), { name })
            }
          />
        </DataCard>

        <DataCard
          interactive
          title={t("bookings.opsUpcomingTitle")}
          subtitle={t("bookings.opsUpcomingSubtitle")}
        >
          <OpsBookingList
            models={upcomingStays}
            emptyTitle={t("bookings.opsUpcomingEmpty")}
            emptyDescription={t("bookings.opsUpcomingEmptyDesc")}
            onSelect={onSelect}
            openReservationLabel={(name) =>
              formatTranslation(t("bookings.openReservation"), { name })
            }
          />
        </DataCard>

        <DataCard
          interactive
          title={t("bookings.opsOccupancyTitle")}
          subtitle={t("bookings.opsOccupancySubtitle")}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("bookings.kpiActiveStays")}</p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.activeStays} />
              </p>
            </div>
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("bookings.kpiOccupancy")}</p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.occupancyPercent} formatter={formatPercent} />
              </p>
            </div>
            <div className="col-span-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("bookings.opsRevenueActive")}</p>
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
          title={t("bookings.opsRecentTitle")}
          subtitle={t("bookings.opsRecentSubtitle")}
        >
          <OpsBookingList
            models={recentBookings}
            emptyTitle={t("bookings.opsRecentEmpty")}
            emptyDescription={t("bookings.opsRecentEmptyDesc")}
            onSelect={onSelect}
            openReservationLabel={(name) =>
              formatTranslation(t("bookings.openReservation"), { name })
            }
          />
        </DataCard>
      </div>
    </Section>
  );
}
