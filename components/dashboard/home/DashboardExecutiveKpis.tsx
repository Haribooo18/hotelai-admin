"use client";

import {
  Bot,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";
import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "./DashboardPrimitives";
import { cn } from "@/lib/utils";

type Props = {
  metrics: DashboardMetrics;
  aiConversations: number;
  loading: boolean;
};

const KPI_ITEMS: Array<{
  key: string;
  label: string;
  icon: typeof Wallet;
  getValue: (metrics: DashboardMetrics, ai: number) => number;
  format: (value: number) => string;
}> = [
  {
    key: "revenue",
    label: "Revenue",
    icon: Wallet,
    getValue: (metrics) => metrics.revenueToday,
    format: formatDashboardCurrency,
  },
  {
    key: "occupancy",
    label: "Occupancy",
    icon: Percent,
    getValue: (metrics) => metrics.occupancyPercent,
    format: formatDashboardPercent,
  },
  {
    key: "arrivals",
    label: "Today's arrivals",
    icon: DoorOpen,
    getValue: (metrics) => metrics.arrivalsToday,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "departures",
    label: "Today's departures",
    icon: DoorClosed,
    getValue: (metrics) => metrics.departuresToday,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "guests",
    label: "Active guests",
    icon: Users,
    getValue: (metrics) => metrics.activeGuests,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "ai",
    label: "AI conversations",
    icon: Bot,
    getValue: (_metrics, ai) => ai,
    format: (value) => String(Math.round(value)),
  },
];

export function DashboardExecutiveKpis({
  metrics,
  aiConversations,
  loading,
}: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-16" />
              <DashboardSkeletonBlock className="h-7 w-20" />
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
          const rawValue = item.getValue(metrics, aiConversations);

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
                <AnimatedMetric
                  value={rawValue}
                  formatter={item.format}
                />
              </p>
            </div>
          );
        })}
      </div>
    </DashboardGlassPanel>
  );
}
