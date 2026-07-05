"use client";

import {
  BedDouble,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { formatBookingCurrency } from "@/components/dashboard/bookings/booking-ops-metrics";
import { cn } from "@/lib/utils";

import type { CalendarOpsKpis } from "./calendar-ops-metrics";

type Props = {
  kpis: CalendarOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof CalendarOpsKpis;
  label: string;
  icon: typeof Wallet;
  format: (value: number) => string;
}> = [
  {
    key: "occupancyPercent",
    label: "Occupancy",
    icon: Percent,
    format: (value) => `${Math.round(value)}%`,
  },
  {
    key: "checkInsToday",
    label: "Check-ins today",
    icon: DoorOpen,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "checkOutsToday",
    label: "Check-outs today",
    icon: DoorClosed,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "availableRooms",
    label: "Available rooms",
    icon: BedDouble,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: Wallet,
    format: formatBookingCurrency,
  },
  {
    key: "activeStays",
    label: "Active stays",
    icon: Users,
    format: (value) => String(Math.round(value)),
  },
];

export function CalendarExecutiveKpis({ kpis, loading }: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-20" />
              <DashboardSkeletonBlock className="h-7 w-16" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>
    );
  }

  return (
    <DashboardGlassPanel className="overflow-hidden p-[var(--ds-surface-padding)]">
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-6">
        {KPI_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const value = kpis[item.key];

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                index > 0 && "xl:border-l xl:border-[var(--shell-border)]/60"
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
