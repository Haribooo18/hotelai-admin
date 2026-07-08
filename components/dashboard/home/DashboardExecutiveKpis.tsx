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

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { useI18n } from "@/lib/i18n";

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

function buildTrendHint(
  points: TrendPoint[] | undefined,
  stableLabel: string
): TrendHint | null {
  if (!points || points.length < 2) return null;

  const current = points[points.length - 1]?.value ?? 0;
  const previous = points[points.length - 2]?.value ?? 0;
  const delta = current - previous;

  if (Math.abs(delta) < 0.01) {
    return { direction: "flat", label: stableLabel };
  }

  return {
    direction: delta > 0 ? "up" : "down",
    label: `${delta > 0 ? "+" : ""}${Math.round(delta)}`,
  };
}

export function DashboardExecutiveKpis({
  metrics,
  aiConversations,
  loading,
  revenueTrend,
  occupancyTrend,
}: Props) {
  const { t } = useI18n();

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
      },
      {
        key: "occupancy",
        label: t("dashboard.occupancy"),
        icon: Percent,
        tone: "default" as const,
        getValue: (m: DashboardMetrics) => m.occupancyPercent,
        format: formatDashboardPercent,
        trendKey: "occupancy" as const,
      },
      {
        key: "arrivals",
        label: t("dashboard.arrivals"),
        icon: DoorOpen,
        tone: "success" as const,
        getValue: (m: DashboardMetrics) => m.arrivalsToday,
        format: (value: number) => String(Math.round(value)),
      },
      {
        key: "departures",
        label: t("dashboard.departures"),
        icon: DoorClosed,
        tone: "warning" as const,
        getValue: (m: DashboardMetrics) => m.departuresToday,
        format: (value: number) => String(Math.round(value)),
        pulse: true,
      },
      {
        key: "guests",
        label: t("dashboard.kpiActiveGuests"),
        icon: Users,
        tone: "default" as const,
        getValue: (m: DashboardMetrics) => m.activeGuests,
        format: (value: number) => String(Math.round(value)),
      },
      {
        key: "ai",
        label: t("dashboard.aiConversations"),
        icon: Bot,
        tone: "default" as const,
        getValue: (_m: DashboardMetrics, ai = 0) => ai,
        format: (value: number) => String(Math.round(value)),
      },
    ],
    [t]
  );

  const trendHints = useMemo(
    () => ({
      revenue: buildTrendHint(revenueTrend, t("dashboard.stable")),
      occupancy: buildTrendHint(occupancyTrend, t("dashboard.stable")),
    }),
    [revenueTrend, occupancyTrend, t]
  );

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("dashboard.kpiAriaLabel")}
      loading={loading}
      count={6}
      gridClassName="sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
      skeletonVariant="trend"
    >
      {kpiItems.map((item, index) => {
        const value = item.getValue(metrics, aiConversations);

        return (
          <KpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={value}
            format={item.format}
            tone={item.tone}
            bordered={index > 0}
            pulse={"pulse" in item && item.pulse ? value > 0 : false}
            trend={
              item.trendKey && trendHints[item.trendKey] ? (
                <DashboardTrendHint trend={trendHints[item.trendKey]!} />
              ) : null
            }
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
