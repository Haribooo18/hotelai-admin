"use client";

import { useMemo } from "react";
import { BedDouble, CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { Progress } from "@/components/ui/display/Progress";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { todayIso } from "@/lib/dashboard/date";
import { formatTranslation, useI18n } from "@/lib/i18n";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  type RoomCardModel,
  type RoomOpsKpis,
} from "./room-ops-metrics";
import { RoomOpsListItem } from "./rooms-ui";

type Props = {
  models: RoomCardModel[];
  bookings: Booking[];
  kpis: RoomOpsKpis;
  loading?: boolean;
  onSelect?: (model: RoomCardModel) => void;
};

function RoomOpsList({
  models,
  emptyTitle,
  emptyDescription,
  onSelect,
  openRoomAria,
  opsRoomLine,
}: {
  models: RoomCardModel[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: RoomCardModel) => void;
  openRoomAria: (code: string) => string;
  opsRoomLine: (code: string, type: string) => string;
}) {
  if (models.length === 0) {
    return (
      <WorkspaceEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<BedDouble size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {models.slice(0, 5).map((model) => (
        <RoomOpsListItem
          key={model.room.id}
          role="listitem"
          aria-label={openRoomAria(model.roomCode)}
          onClick={() => onSelect?.(model)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                {opsRoomLine(model.roomCode, model.room.room_type)}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                {model.floorLabel}
              </p>
            </div>
            <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
              {formatRoomCurrency(model.revenueToday)}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <RoomStatusBadge status={model.status} />
            <HousekeepingBadge status={model.housekeepingStatus} />
          </div>
        </RoomOpsListItem>
      ))}
    </div>
  );
}

export function RoomsOperations({
  models,
  bookings,
  kpis,
  loading = false,
  onSelect,
}: Props) {
  const { t } = useI18n();
  const today = todayIso();

  const occupiedToday = useMemo(
    () => models.filter((model) => model.status === "occupied"),
    [models]
  );

  const vacant = useMemo(
    () => models.filter((model) => model.status === "available"),
    [models]
  );

  const dirty = useMemo(
    () => models.filter((model) => model.housekeepingStatus === "dirty"),
    [models]
  );

  const cleaning = useMemo(
    () => models.filter((model) => model.status === "cleaning"),
    [models]
  );

  const maintenance = useMemo(
    () => models.filter((model) => model.status === "maintenance"),
    [models]
  );

  const revenueByRoom = useMemo(
    () =>
      [...models]
        .sort((a, b) => b.revenueToday - a.revenueToday)
        .filter((model) => model.revenueToday > 0),
    [models]
  );

  const upcomingCheckIns = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.check_in > today && booking.status !== "cancelled"
        )
        .sort((a, b) => a.check_in.localeCompare(b.check_in)),
    [bookings, today]
  );

  const openRoomAria = (code: string) =>
    formatTranslation(t("rooms.openRoomAria"), { code });
  const opsRoomLine = (code: string, type: string) =>
    formatTranslation(t("rooms.opsRoomLine"), { code, type });

  if (loading) {
    return (
      <Section
        title={t("rooms.operationsTitle")}
        subtitle={t("rooms.operationsSubtitle")}
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <DataCard key={index} title={t("rooms.operationsLoading")}>
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t("rooms.operationsTitle")}
      subtitle={t("rooms.operationsSubtitle")}
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title={t("rooms.opsOccupiedTitle")}
          subtitle={formatTranslation(t("rooms.opsOccupiedSubtitle"), {
            count: String(occupiedToday.length),
          })}
        >
          <RoomOpsList
            models={occupiedToday}
            emptyTitle={t("rooms.opsOccupiedEmpty")}
            emptyDescription={t("rooms.opsOccupiedEmptyDesc")}
            onSelect={onSelect}
            openRoomAria={openRoomAria}
            opsRoomLine={opsRoomLine}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsVacantTitle")}
          subtitle={formatTranslation(t("rooms.opsVacantSubtitle"), {
            count: String(vacant.length),
          })}
        >
          <RoomOpsList
            models={vacant}
            emptyTitle={t("rooms.opsVacantEmpty")}
            emptyDescription={t("rooms.opsVacantEmptyDesc")}
            onSelect={onSelect}
            openRoomAria={openRoomAria}
            opsRoomLine={opsRoomLine}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsDirtyTitle")}
          subtitle={formatTranslation(t("rooms.opsDirtySubtitle"), {
            count: String(dirty.length),
          })}
        >
          <RoomOpsList
            models={dirty}
            emptyTitle={t("rooms.opsDirtyEmpty")}
            emptyDescription={t("rooms.opsDirtyEmptyDesc")}
            onSelect={onSelect}
            openRoomAria={openRoomAria}
            opsRoomLine={opsRoomLine}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsCleaningTitle")}
          subtitle={formatTranslation(t("rooms.opsCleaningSubtitle"), {
            count: String(cleaning.length),
          })}
        >
          <RoomOpsList
            models={cleaning}
            emptyTitle={t("rooms.opsCleaningEmpty")}
            emptyDescription={t("rooms.opsCleaningEmptyDesc")}
            onSelect={onSelect}
            openRoomAria={openRoomAria}
            opsRoomLine={opsRoomLine}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsMaintenanceTitle")}
          subtitle={formatTranslation(t("rooms.opsMaintenanceSubtitle"), {
            count: String(maintenance.length),
          })}
        >
          <RoomOpsList
            models={maintenance}
            emptyTitle={t("rooms.opsMaintenanceEmpty")}
            emptyDescription={t("rooms.opsMaintenanceEmptyDesc")}
            onSelect={onSelect}
            openRoomAria={openRoomAria}
            opsRoomLine={opsRoomLine}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsRevenueTitle")}
          subtitle={t("rooms.opsRevenueSubtitle")}
        >
          {revenueByRoom.length === 0 ? (
            <WorkspaceEmptyState
              title={t("rooms.opsNoRevenue")}
              description={t("rooms.opsNoRevenueDesc")}
              icon={<BedDouble size={16} />}
            />
          ) : (
            <div className="space-y-2" role="list">
              {revenueByRoom.slice(0, 5).map((model) => {
                const share =
                  kpis.revenueToday > 0
                    ? Math.round((model.revenueToday / kpis.revenueToday) * 100)
                    : 0;

                return (
                  <div
                    key={model.room.id}
                    className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[12px] font-medium text-[var(--shell-text)]">
                        {opsRoomLine(model.roomCode, model.room.room_type)}
                      </p>
                      <p className="text-[12px] font-semibold text-[var(--shell-text)]">
                        {formatRoomCurrency(model.revenueToday)}
                      </p>
                    </div>
                    <Progress value={share} className="mt-2 h-1.5" />
                  </div>
                );
              })}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsCheckInsTitle")}
          subtitle={t("rooms.opsCheckInsSubtitle")}
        >
          {upcomingCheckIns.length === 0 ? (
            <WorkspaceEmptyState
              title={t("rooms.opsNoCheckIns")}
              description={t("rooms.opsNoCheckInsDesc")}
              icon={<CalendarDays size={16} />}
            />
          ) : (
            <div className="space-y-2" role="list">
              {upcomingCheckIns.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                >
                  <p className="text-[12px] font-medium text-[var(--shell-text)]">
                    {booking.guest_name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                    {formatRoomDate(booking.check_in)} ·{" "}
                    {formatRoomCurrency(Number(booking.total_price))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("rooms.opsOccupancyTitle")}
          subtitle={t("rooms.opsOccupancySubtitle")}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("rooms.summaryOccupied")}</p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.occupied} />
              </p>
            </div>
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="ds-overline">{t("rooms.summaryOccupancy")}</p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric
                  value={kpis.averageOccupancy}
                  formatter={(value) => `${Math.round(value)}%`}
                />
              </p>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2">
              <MaintenanceBadge active={maintenance.length > 0} />
              {maintenance.length > 0 ? (
                <span className="text-[11px] text-[var(--shell-muted)]">
                  {formatTranslation(t("rooms.roomsBlocked"), {
                    count: String(maintenance.length),
                  })}
                </span>
              ) : null}
            </div>
          </div>
        </DataCard>
      </div>
    </Section>
  );
}
