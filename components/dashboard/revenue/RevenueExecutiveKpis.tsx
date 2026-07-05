"use client";

import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  DollarSign,
  Percent,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import {
  formatRevenueCurrency,
  type RevenueKpis,
} from "./revenue-metrics";

type Props = {
  kpis: RevenueKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof RevenueKpis;
  label: string;
  icon: typeof DollarSign;
  format: (value: number) => string;
}> = [
  {
    key: "revenueToday",
    label: "Revenue today",
    icon: DollarSign,
    format: formatRevenueCurrency,
  },
  {
    key: "revenueWeek",
    label: "Revenue this week",
    icon: CalendarDays,
    format: formatRevenueCurrency,
  },
  {
    key: "revenueMonth",
    label: "Revenue this month",
    icon: TrendingUp,
    format: formatRevenueCurrency,
  },
  {
    key: "adr",
    label: "ADR",
    icon: DollarSign,
    format: formatRevenueCurrency,
  },
  {
    key: "revpar",
    label: "RevPAR",
    icon: BedDouble,
    format: formatRevenueCurrency,
  },
  {
    key: "occupancy",
    label: "Occupancy",
    icon: Percent,
    format: formatPercent,
  },
  {
    key: "averageStay",
    label: "Average stay",
    icon: CalendarClock,
    format: (value) => `${Math.round(value)}n`,
  },
  {
    key: "cancellationRate",
    label: "Cancellation rate",
    icon: TrendingDown,
    format: formatPercent,
  },
];

export function RevenueExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
      borderFrom="2xl"
      skeletonCount={8}
      skeletonValueClassName="h-7 w-16"
    />
  );
}
