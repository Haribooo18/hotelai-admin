"use client";

import {
  BedDouble,
  CalendarClock,
  DollarSign,
  LineChart,
  Percent,
  TrendingUp,
} from "lucide-react";

import { Metric } from "@/components/ui/display/Metric";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { formatPercent } from "@/lib/dashboard/format";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import {
  computeDisplayForecastTotal,
  computeDisplayGrowth,
  getTrendSeries,
  MiniTrend,
} from "./revenue-ui";
import {
  formatRevenueCurrency,
  type RevenueForecastPoint,
  type RevenueKpis,
  type RevenueTrendPoint,
} from "./revenue-metrics";

type Props = {
  kpis: RevenueKpis;
  trend: RevenueTrendPoint[];
  forecast: RevenueForecastPoint[];
  loading?: boolean;
};

type DisplayKpi = {
  key: string;
  label: string;
  icon: typeof DollarSign;
  tone: "default" | "success" | "warning";
  value: number;
  format: (value: number) => string;
  trendValues: number[];
};

function buildDisplayKpis(
  kpis: RevenueKpis,
  trend: RevenueTrendPoint[],
  forecast: RevenueForecastPoint[]
): DisplayKpi[] {
  const periodRevenue = trend.reduce((sum, point) => sum + point.revenue, 0);

  return [
    {
      key: "revenue",
      label: "Revenue",
      icon: DollarSign,
      tone: "success",
      value: periodRevenue,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "revenue"),
    },
    {
      key: "adr",
      label: "ADR",
      icon: DollarSign,
      tone: "default",
      value: kpis.adr,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "adr"),
    },
    {
      key: "revpar",
      label: "RevPAR",
      icon: BedDouble,
      tone: "success",
      value: kpis.revpar,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "revpar"),
    },
    {
      key: "occupancy",
      label: "Occupancy",
      icon: Percent,
      tone: "success",
      value: kpis.occupancy,
      format: formatPercent,
      trendValues: getTrendSeries(trend, "occupancy"),
    },
    {
      key: "averageStay",
      label: "Average stay",
      icon: CalendarClock,
      tone: "default",
      value: kpis.averageStay,
      format: (value) => `${Math.round(value)}n`,
      trendValues: [],
    },
    {
      key: "forecast",
      label: "Forecast",
      icon: LineChart,
      tone: "warning",
      value: computeDisplayForecastTotal(forecast),
      format: formatRevenueCurrency,
      trendValues: forecast.map((point) => point.projected),
    },
    {
      key: "growth",
      label: "Growth",
      icon: TrendingUp,
      tone: "success",
      value: computeDisplayGrowth(trend),
      format: (value) => `${value >= 0 ? "+" : ""}${Math.round(value)}%`,
      trendValues: getTrendSeries(trend, "revenue"),
    },
  ];
}

export function RevenueExecutiveKpis({
  kpis,
  trend,
  forecast,
  loading,
}: Props) {
  const items = buildDisplayKpis(kpis, trend, forecast);

  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-6 w-full" />
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
      aria-label="Revenue executive KPIs"
    >
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-3",
                motionPresets.transitionBase,
                motionPresets.hover.surfaceLift,
                index > 0 && borderClass
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
                    <Icon size={15} aria-hidden />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                    {item.label}
                  </p>
                </div>
                <StatusDot
                  tone={
                    item.tone === "warning"
                      ? "warning"
                      : item.tone === "success"
                        ? "success"
                        : "default"
                  }
                />
              </div>
              <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                <Metric value={item.value} formatter={item.format} />
              </p>
              <div className="mt-2">
                <MiniTrend values={item.trendValues} />
              </div>
            </div>
          );
        })}
      </div>
    </GlassSurface>
  );
}
