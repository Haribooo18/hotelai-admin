"use client";

import { BedDouble } from "lucide-react";

import {
  buildRoomCardModels,
  computeRoomOpsKpis,
  getRoomStatusMeta,
} from "@/components/dashboard/rooms/room-ops-metrics";
import { DataCard } from "@/components/ui/data/DataCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Progress } from "@/components/ui/display/Progress";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { StatCard } from "@/components/ui/data/StatCard";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { DashboardCardAction } from "./dashboard-ui";

type Props = {
  rooms: Room[];
  bookings: Booking[];
  loading: boolean;
};

const STATUS_ORDER = [
  "available",
  "occupied",
  "reserved",
  "cleaning",
  "maintenance",
] as const;

export function DashboardRoomStatus({ rooms, bookings, loading }: Props) {
  const models = buildRoomCardModels(rooms, bookings);
  const kpis = computeRoomOpsKpis(models);

  return (
    <DataCard
      interactive
      title="Room status"
      subtitle="Live operational overview"
      action={<DashboardCardAction href="/rooms" label="Rooms" />}
    >
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-28" />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          title="No rooms configured"
          description="Add rooms to track availability and housekeeping status."
          icon={<BedDouble size={18} />}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Occupancy"
              value={`${kpis.averageOccupancy}%`}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3 shadow-none"
            />
            <StatCard
              label="Total rooms"
              value={String(kpis.total)}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3 shadow-none"
            />
          </div>

          <div className="space-y-2.5">
            {STATUS_ORDER.map((status) => {
              const count = models.filter((model) => model.status === status).length;
              if (count === 0) return null;

              const meta = getRoomStatusMeta(status);
              const percent = kpis.total > 0 ? (count / kpis.total) * 100 : 0;

              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-[var(--shell-text)]">
                      {meta.label}
                    </span>
                    <span className="text-[11px] text-[var(--shell-muted)]">
                      {count}
                    </span>
                  </div>
                  <Progress value={percent} aria-label={`${meta.label} rooms`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DataCard>
  );
}
