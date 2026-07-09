"use client";

import { useMemo } from "react";
import {
  Bot,
  DoorClosed,
  DoorOpen,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

import { MiniTrend } from "@/components/dashboard/revenue/revenue-ui";
import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import type { MotionRevealOrder } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";

import {
  buildKpiTrendDelta,
  buildKpiTrendSeries,
} from "./dashboard-insights";
import type { TrendPoint } from "./dashboard-metrics";
import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";
import { DashboardTrendHint } from "./dashboard-ui";

type Props = {
  metrics: DashboardMetrics;
  aiConversations: number;
  loading: boolean;
  revenueTrend?: TrendPoint[];
  occupancyTrend?: TrendPoint[];
};

function buildTrendHint(
  points: TrendPoint[] | undefined,
  stableLabel: string,
  comparisonLabel: string
) {
  const delta = buildKpiTrendDelta(points);
  if (!delta) return null;

  if (delta.direction === "flat") {
    return (
      <DashboardTrendHint
        trend={{ direction: "flat", label: stableLabel }}
        comparisonLabel={comparisonLabel}
      />
    );
  }

  return (
    <DashboardTrendHint
      trend={{ direction: delta.direction, label: delta.percentLabel }}
      comparisonLabel={comparisonLabel}
    />
  );
}

function buildCountSparkline(value: number): number[] {
  const safe = Math.max(0, Math.round(value));
  if (safe === 0) return [0, 0, 0, 0, 0, 0, 0];
  return Array.from({ length: 7 }, (_, index) =>
    Math.max(0, Math.round((safe * (index + 1)) / 7))
  );
}

export function DashboardExecutiveKpis({
  metrics,
  aiConversations,
  loading,
  revenueTrend,
  occupancyTrend,
}: Props) {
  const { t } = useI18n();
  const comparisonLabel = t("dashboard.kpiVsYesterday");

  const kpiItems = useMemo(
    () => [
      {
        key: "revenue",
        label: t("dashboard.revenueToday"),
        icon: Wallet,
        tone: "success" as const,
        getValue: (m: DashboardMetrics) => m.revenueToday,
        format: formatDashboardCurrency,
        trendKey: "revenue" as const,
        sparkline: revenueTrend,
      },
      {
        key: "occupancy",
        label: t("dashboard.occupancy"),
        icon: Percent,
        tone: "default" as const,
        getValue: (m: DashboardMetrics) => m.occupancyPercent,
        format: formatDashboardPercent,
        trendKey: "occupancy" as const,
        sparkline: occupancyTrend,
      },
      {
        key: "arrivals",
        label: t("dashboard.arrivals"),
        icon: DoorOpen,
        tone: "success" as const,
        getValue: (m: DashboardMetrics) => m.arrivalsToday,
        format: (value: number) => String(Math.round(value)),
        sparklineValues: buildCountSparkline(metrics.arrivalsToday),
      },
      {
        key: "departures",
        label: t("dashboard.departures"),
        icon: DoorClosed,
        tone: "warning" as const,
        getValue: (m: DashboardMetrics) => m.departuresToday,
        format: (value: number) => String(Math.round(value)),
        pulse: true,
        sparklineValues: buildCountSparkline(metrics.departuresToday),
      },
      {
        key: "guests",
        label: t("dashboard.kpiActiveGuests"),
        icon: Users,
        tone: "default" as const,
        getValue: (m: DashboardMetrics) => m.activeGuests,
        format: (value: number) => String(Math.round(value)),
        sparklineValues: buildCountSparkline(metrics.activeGuests),
      },
      {
        key: "ai",
        label: t("dashboard.aiConversations"),
        icon: Bot,
        tone: "default" as const,
        getValue: (_m: DashboardMetrics, ai = 0) => ai,
        format: (value: number) => String(Math.round(value)),
        sparklineValues: buildCountSparkline(aiConversations),
      },
    ],
    [t, metrics.arrivalsToday, metrics.departuresToday, metrics.activeGuests, aiConversations, revenueTrend, occupancyTrend]
  );

  const trendHints = useMemo(
    () => ({
      revenue: buildTrendHint(revenueTrend, t("dashboard.stable"), comparisonLabel),
      occupancy: buildTrendHint(
        occupancyTrend,
        t("dashboard.stable"),
        comparisonLabel
      ),
    }),
    [revenueTrend, occupancyTrend, t, comparisonLabel]
  );

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("dashboard.kpiAriaLabel")}
      loading={loading}
      count={6}
      connected
      gridClassName="sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
      skeletonVariant="sparkline"
    >
      {kpiItems.map((item, index) => {
        const value = item.getValue(metrics, aiConversations);
        const sparklineSeries: number[] =
          "sparkline" in item && item.sparkline
            ? buildKpiTrendSeries(item.sparkline)
            : "sparklineValues" in item && item.sparklineValues
              ? item.sparklineValues
              : [];

        return (
          <KpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={value}
            format={item.format}
            tone={item.tone}
            executive
            connected
            revealOrder={Math.min(index, 7) as MotionRevealOrder}
            pulse={"pulse" in item && item.pulse ? value > 0 : false}
            trend={
              item.trendKey && trendHints[item.trendKey]
                ? trendHints[item.trendKey]
                : null
            }
            trendKey={
              item.trendKey && trendHints[item.trendKey]
                ? `${item.trendKey}-${comparisonLabel}`
                : undefined
            }
            sparkline={
              sparklineSeries.length >= 2 ? (
                <MiniTrend values={sparklineSeries} className="h-6 opacity-35" />
              ) : null
            }
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
