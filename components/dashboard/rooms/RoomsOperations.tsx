"use client";

import { useMemo } from "react";
import { BedDouble, CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { Progress } from "@/components/ui/display/Progress";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { todayIso } from "@/lib/dashboard/date";

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
}: {
  models: RoomCardModel[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: RoomCardModel) => void;
}) {
  if (models.length === 0) {
    return (
      <EmptyState
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
          aria-label={`Open room ${model.roomCode}`}
          onClick={() => onSelect?.(model)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                Room {model.roomCode} · {model.room.room_type}
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

  if (loading) {
    return (
      <Section title="Operations" subtitle="Housekeeping and inventory activity">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 7 }).map((_, index) => (
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
      subtitle="Housekeeping, maintenance, and daily room flow"
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title="Occupied today"
          subtitle={`${occupiedToday.length} in-house rooms`}
        >
          <RoomOpsList
            models={occupiedToday}
            emptyTitle="No occupied rooms"
            emptyDescription="Rooms with active stays will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Vacant"
          subtitle={`${vacant.length} ready inventory`}
        >
          <RoomOpsList
            models={vacant}
            emptyTitle="No vacant rooms"
            emptyDescription="Available rooms will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Dirty"
          subtitle={`${dirty.length} need service`}
        >
          <RoomOpsList
            models={dirty}
            emptyTitle="No dirty rooms"
            emptyDescription="Rooms awaiting housekeeping will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Cleaning"
          subtitle={`${cleaning.length} in turnover`}
        >
          <RoomOpsList
            models={cleaning}
            emptyTitle="No rooms in cleaning"
            emptyDescription="Post-checkout turnover rooms will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Maintenance"
          subtitle={`${maintenance.length} out of service`}
        >
          <RoomOpsList
            models={maintenance}
            emptyTitle="No maintenance blocks"
            emptyDescription="Rooms flagged for maintenance will appear here."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Revenue by room"
          subtitle="Top performers today"
        >
          {revenueByRoom.length === 0 ? (
            <EmptyState
              title="No revenue yet"
              description="Room revenue will appear as stays are recorded."
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
                        Room {model.roomCode}
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
          title="Upcoming check-ins"
          subtitle="Future arrivals by room"
        >
          {upcomingCheckIns.length === 0 ? (
            <EmptyState
              title="No upcoming check-ins"
              description="Confirmed future arrivals will appear here."
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
          title="Occupancy summary"
          subtitle="Live utilization"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Occupied
              </p>
              <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={kpis.occupied} />
              </p>
            </div>
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Occupancy
              </p>
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
                  {maintenance.length} rooms blocked
                </span>
              ) : null}
            </div>
          </div>
        </DataCard>
      </div>
    </Section>
  );
}
