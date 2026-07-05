"use client";

import {
  BedDouble,
  Brush,
  DollarSign,
  Percent,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import {
  formatRoomCurrency,
  type RoomOpsKpis,
} from "./room-ops-metrics";

type Props = {
  kpis: RoomOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof RoomOpsKpis;
  label: string;
  icon: typeof BedDouble;
  format: (value: number) => string;
}> = [
  { key: "total", label: "Total rooms", icon: BedDouble, format: (v) => String(v) },
  { key: "occupied", label: "Occupied", icon: BedDouble, format: (v) => String(v) },
  { key: "available", label: "Available", icon: Sparkles, format: (v) => String(v) },
  { key: "cleaning", label: "Dirty", icon: Brush, format: (v) => String(v) },
  { key: "maintenance", label: "Out of service", icon: Wrench, format: (v) => String(v) },
  {
    key: "averageOccupancy",
    label: "Occupancy",
    icon: Percent,
    format: (v) => `${Math.round(v)}%`,
  },
  { key: "adr", label: "ADR", icon: TrendingUp, format: formatRoomCurrency },
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: DollarSign,
    format: formatRoomCurrency,
  },
];

export function RoomsExecutiveKpis({ kpis, loading }: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-20" />
              <DashboardSkeletonBlock className="h-7 w-14" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>
    );
  }

  return (
    <DashboardGlassPanel className="overflow-hidden p-[var(--ds-surface-padding)]">
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {KPI_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const value = kpis[item.key];

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                index > 0 && "2xl:border-l 2xl:border-[var(--shell-border)]/60"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
                  <Icon size={15} />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                  {item.label}
                </p>
              </div>
              <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                <AnimatedMetric value={value} formatter={item.format} />
              </p>
            </div>
          );
        })}
      </div>
    </DashboardGlassPanel>
  );
}
