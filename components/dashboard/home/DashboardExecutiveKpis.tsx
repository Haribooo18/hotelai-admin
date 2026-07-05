"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { Metric } from "@/components/ui/display/Metric";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type { TrendPoint } from "./dashboard-metrics";
import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";
import { DashboardTrendHint, type TrendHint } from "./dashboard-ui";

type Props = {
  metrics: DashboardMetrics;
  aiConversations: number;
  loading: boolean;
  revenueTrend?: TrendPoint[];
  occupancyTrend?: TrendPoint[];
};

const KPI_ITEMS: Array<{
  key: string;
  label: string;
  icon: LucideIcon;
  tone: "default" | "success" | "warning" | "muted";
  getValue: (metrics: DashboardMetrics, ai: number) => number;
  format: (value: number) => string;
  trendKey?: "revenue" | "occupancy";
}> = [
  {
    key: "revenue",
    label: "Revenue today",
    icon: Wallet,
    tone: "success",
    getValue: (metrics) => metrics.revenueToday,
    format: formatDashboardCurrency,
    trendKey: "revenue",
  },
  {
    key: "occupancy",
    label: "Occupancy",
    icon: Percent,
    tone: "default",
    getValue: (metrics) => metrics.occupancyPercent,
    format: formatDashboardPercent,
    trendKey: "occupancy",
  },
  {
    key: "arrivals",
    label: "Arrivals",
    icon: DoorOpen,
    tone: "success",
    getValue: (metrics) => metrics.arrivalsToday,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "departures",
    label: "Departures",
    icon: DoorClosed,
    tone: "warning",
    getValue: (metrics) => metrics.departuresToday,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "guests",
    label: "Active guests",
    icon: Users,
    tone: "default",
    getValue: (metrics) => metrics.activeGuests,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "ai",
    label: "AI conversations",
    icon: Bot,
    tone: "default",
    getValue: (_metrics, ai) => ai,
    format: (value) => String(Math.round(value)),
  },
];

function buildTrendHint(points: TrendPoint[] | undefined): TrendHint | null {
  if (!points || points.length < 2) return null;

  const current = points[points.length - 1]?.value ?? 0;
  const previous = points[points.length - 2]?.value ?? 0;
  const delta = current - previous;

  if (Math.abs(delta) < 0.01) {
    return { direction: "flat", label: "Stable" };
  }

  return {
    direction: delta > 0 ? "up" : "down",
    label: `${delta > 0 ? "+" : ""}${Math.round(delta)}`,
  };
}

function PremiumKpiCard({
  label,
  icon: Icon,
  value,
  format,
  tone,
  trend,
  bordered,
  className,
}: {
  label: string;
  icon: LucideIcon;
  value: number;
  format: (value: number) => string;
  tone: "default" | "success" | "warning" | "muted";
  trend: TrendHint | null;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group px-3 py-3",
        motionPresets.transitionBase,
        motionPresets.hover.surfaceLift,
        bordered && "xl:border-l xl:border-[var(--shell-border)]/60",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
            <Icon size={15} aria-hidden />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
            {label}
          </p>
        </div>
        <StatusDot
          tone={
            tone === "warning"
              ? "warning"
              : tone === "success"
                ? "success"
                : "default"
          }
          pulse={tone === "warning" && value > 0}
        />
      </div>
      <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
        <Metric value={value} formatter={format} />
      </p>
      {trend ? (
        <div className="mt-1.5">
          <DashboardTrendHint trend={trend} />
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {format(value)}
      </span>
    </div>
  );
}

export function DashboardExecutiveKpis({
  metrics,
  aiConversations,
  loading,
  revenueTrend,
  occupancyTrend,
}: Props) {
  const trendHints = useMemo(
    () => ({
      revenue: buildTrendHint(revenueTrend),
      occupancy: buildTrendHint(occupancyTrend),
    }),
    [revenueTrend, occupancyTrend]
  );

  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </GlassSurface>
    );
  }

  const borderClass = "xl:border-l xl:border-[var(--shell-border)]/60";

  return (
    <GlassSurface
      interactive
      className="overflow-hidden p-[var(--ds-surface-padding)]"
      aria-label="Executive KPIs"
    >
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {KPI_ITEMS.map((item, index) => (
          <PremiumKpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={item.getValue(metrics, aiConversations)}
            format={item.format}
            tone={item.tone}
            trend={item.trendKey ? trendHints[item.trendKey] : null}
            bordered={index > 0}
            className={index > 0 ? borderClass : undefined}
          />
        ))}
      </div>
    </GlassSurface>
  );
}
