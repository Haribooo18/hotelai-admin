"use client";

import { useMemo } from "react";
import {
  BedDouble,
  CalendarClock,
  DollarSign,
  LineChart,
  Percent,
  TrendingUp,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent, formatNightsCount } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

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
  labelKey: TranslationPath;
  icon: typeof DollarSign;
  tone: "default" | "success" | "warning";
  value: number;
  format: (value: number) => string;
  trendValues: number[];
};

function buildDisplayKpis(
  kpis: RevenueKpis,
  trend: RevenueTrendPoint[],
  forecast: RevenueForecastPoint[],
  t: (path: TranslationPath) => string
): DisplayKpi[] {
  const periodRevenue = trend.reduce((sum, point) => sum + point.revenue, 0);

  return [
    {
      key: "revenue",
      labelKey: "revenue.periodRevenue",
      icon: DollarSign,
      tone: "success",
      value: periodRevenue,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "revenue"),
    },
    {
      key: "adr",
      labelKey: "revenue.kpiAdr",
      icon: DollarSign,
      tone: "default",
      value: kpis.adr,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "adr"),
    },
    {
      key: "revpar",
      labelKey: "revenue.revpar",
      icon: BedDouble,
      tone: "success",
      value: kpis.revpar,
      format: formatRevenueCurrency,
      trendValues: getTrendSeries(trend, "revpar"),
    },
    {
      key: "occupancy",
      labelKey: "revenue.kpiOccupancy",
      icon: Percent,
      tone: "success",
      value: kpis.occupancy,
      format: formatPercent,
      trendValues: getTrendSeries(trend, "occupancy"),
    },
    {
      key: "averageStay",
      labelKey: "revenue.kpiAverageStay",
      icon: CalendarClock,
      tone: "default",
      value: kpis.averageStay,
      format: (value) => formatNightsCount(value, t),
      trendValues: [],
    },
    {
      key: "forecast",
      labelKey: "revenue.kpiForecast",
      icon: LineChart,
      tone: "warning",
      value: computeDisplayForecastTotal(forecast),
      format: formatRevenueCurrency,
      trendValues: forecast.map((point) => point.projected),
    },
    {
      key: "growth",
      labelKey: "revenue.kpiGrowth",
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
  const { t } = useI18n();
  const items = useMemo(
    () => buildDisplayKpis(kpis, trend, forecast, t),
    [kpis, trend, forecast, t]
  );

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("revenue.kpiAriaLabel")}
      loading={loading}
      count={7}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7"
      skeletonVariant="sparkline"
    >
      {items.map((item, index) => (
        <KpiCard
          key={item.key}
          label={t(item.labelKey)}
          icon={item.icon}
          value={item.value}
          format={item.format}
          tone={item.tone}
          bordered={index > 0}
          sparkline={<MiniTrend values={item.trendValues} />}
        />
      ))}
    </ExecutiveKpisPanel>
  );
}
