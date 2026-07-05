"use client";

import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import {
  buildRoomCardModels,
  computeRoomOpsKpis,
  getRoomStatusMeta,
} from "@/components/dashboard/rooms/room-ops-metrics";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeletonBlock,
  DashboardSurface,
} from "./DashboardPrimitives";
import { cn } from "@/lib/utils";

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
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Room status"
        subtitle="Live operational overview"
        action={
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)] transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-80"
          >
            Rooms
            <ArrowRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-3">
          <DashboardSkeletonBlock className="h-16" />
          <DashboardSkeletonBlock className="h-28" />
        </div>
      ) : rooms.length === 0 ? (
        <DashboardEmptyState
          title="No rooms configured"
          description="Add rooms to track availability and housekeeping status."
          icon={<BedDouble size={18} />}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--shell-muted)]">
                Occupancy
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {kpis.averageOccupancy}%
              </p>
            </div>
            <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--shell-muted)]">
                Total rooms
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {kpis.total}
              </p>
            </div>
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
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shell-nav-hover-bg)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-[var(--ds-duration-slow)] ease-[var(--ds-ease)]",
                        meta.badgeClass.includes("emerald") && "bg-emerald-500",
                        meta.badgeClass.includes("blue") && "bg-blue-400",
                        meta.badgeClass.includes("amber") && "bg-amber-400",
                        meta.badgeClass.includes("red") && "bg-red-400",
                        meta.badgeClass.includes("violet") && "bg-violet-400"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardSurface>
  );
}
