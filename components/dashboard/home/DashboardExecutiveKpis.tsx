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

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";

import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";

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
  const items = useMemo(
    () =>
      KPI_ITEMS.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        value: item.getValue(metrics, aiConversations),
        format: item.format,
      })),
    [metrics, aiConversations]
  );

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-6"
      skeletonCount={6}
      skeletonLabelClassName="h-3 w-16"
      skeletonValueClassName="h-7 w-20"
    />
  );
}
