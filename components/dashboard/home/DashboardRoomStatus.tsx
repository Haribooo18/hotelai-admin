"use client";

import { useMemo } from "react";
import { BedDouble } from "lucide-react";

import {
  buildRoomCardModels,
  computeRoomOpsKpis,
} from "@/components/dashboard/rooms/room-ops-metrics";
import { RoomStatusBadge } from "@/components/dashboard/rooms/RoomStatusBadge";
import { DataCard } from "@/components/ui/data/DataCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Progress } from "@/components/ui/display/Progress";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { StatCard } from "@/components/ui/data/StatCard";
import { useI18n } from "@/lib/i18n";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import type { RoomOperationalStatus } from "@/components/dashboard/rooms/room-ops-metrics";

import { DashboardCardAction } from "./dashboard-ui";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  loading: boolean;
};

const STATUS_ORDER: RoomOperationalStatus[] = [
  "available",
  "occupied",
  "reserved",
  "cleaning",
  "maintenance",
];

export function DashboardRoomStatus({ rooms, bookings, loading }: Props) {
  const { t } = useI18n();
  const models = buildRoomCardModels(rooms, bookings);
  const kpis = computeRoomOpsKpis(models);

  const statusLabels = useMemo(
    () =>
      Object.fromEntries(
        STATUS_ORDER.map((status) => [
          status,
          t(`statuses.room.${status}` as "statuses.room.available"),
        ])
      ) as Record<RoomOperationalStatus, string>,
    [t]
  );

  return (
    <DataCard
      interactive
      title={t("dashboard.roomStatus")}
      subtitle={t("dashboard.roomStatusSubtitle")}
      action={
        <DashboardCardAction href="/rooms" label={t("nav.rooms")} />
      }
    >
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-28" />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          title={t("dashboard.noRoomsConfigured")}
          description={t("dashboard.noRoomsConfiguredDesc")}
          icon={<BedDouble size={18} />}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label={t("dashboard.occupancy")}
              value={`${kpis.averageOccupancy}%`}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3 shadow-none"
            />
            <StatCard
              label={t("dashboard.totalRooms")}
              value={String(kpis.total)}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3 shadow-none"
            />
          </div>

          <div className="space-y-2.5">
            {STATUS_ORDER.map((status) => {
              const count = models.filter((model) => model.status === status).length;
              if (count === 0) return null;

              const percent = kpis.total > 0 ? (count / kpis.total) * 100 : 0;

              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <RoomStatusBadge status={status} className="text-[10px]" />
                    <span className="text-[11px] text-[var(--shell-muted)]">
                      {count}
                    </span>
                  </div>
                  <Progress
                    value={percent}
                    aria-label={statusLabels[status]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DataCard>
  );
}
