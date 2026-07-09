"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { createChartTooltip } from "@/components/motion/ChartTooltip";
import { MotionChart } from "@/components/motion/MotionChart";
import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { WorkspaceChartSkeleton } from "@/components/dashboard/shared/skeleton";
import { DataCard } from "@/components/ui/data/DataCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { workspaceSurfaceClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import {
  formatRevenueCurrency,
  type RevenueBreakdownPoint,
  type RevenueForecastPoint,
  type RevenueTrendPoint,
} from "./revenue-metrics";

type Props = {
  trend: RevenueTrendPoint[];
  compareTrend: RevenueTrendPoint[];
  bySource: RevenueBreakdownPoint[];
  byRoomType: RevenueBreakdownPoint[];
  forecast: RevenueForecastPoint[];
  compareEnabled: boolean;
  loading?: boolean;
};

function ChartCard<T>({
  title,
  subtitle,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  heightClass,
  chartData,
  children,
  noDataTitle,
  noDataDescription,
}: {
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  heightClass: string;
  chartData: T;
  children: (data: T) => ReactNode;
  noDataTitle: string;
  noDataDescription: string;
}) {
  return (
    <DataCard
      interactive
      title={title}
      subtitle={subtitle}
      className={cn(motionPresets.transitionBase, motionPresets.hover.surfaceLift)}
    >
      <SkeletonCrossfade
        loading={!!loading}
        skeleton={<WorkspaceChartSkeleton className={heightClass} />}
      >
        <MotionChart
          data={chartData}
          empty={!!empty}
          className={heightClass}
          emptyContent={
            <EmptyState
              title={emptyTitle ?? noDataTitle}
              description={emptyDescription ?? noDataDescription}
            />
          }
        >
          {(data) => (
            <div className="h-full" role="img" aria-label={`${title} chart`}>
              {children(data)}
            </div>
          )}
        </MotionChart>
      </SkeletonCrossfade>
    </DataCard>
  );
}

export function RevenueAnalytics({
  trend,
  compareTrend,
  bySource,
  byRoomType,
  forecast,
  compareEnabled,
  loading = false,
}: Props) {
  const { t } = useI18n();
  const noDataTitle = t("revenue.noData");
  const noDataDescription = t("revenue.noDataDesc");
  const mergedTrend = trend.map((point, index) => ({
    ...point,
    compareRevenue: compareTrend[index]?.revenue ?? 0,
  }));

  const hasRevenue = trend.some((point) => point.revenue > 0);
  const hasOccupancy = trend.some((point) => point.occupancy > 0);
  const hasAdr = trend.some((point) => point.adr > 0);
  const hasRevpar = trend.some((point) => point.revpar > 0);

  return (
    <GlassSurface className={workspaceSurfaceClass}>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <ChartCard
            title={t("revenue.revenueTrend")}
            subtitle={t("revenue.dailyGrossRevenue")}
            loading={loading}
            empty={!hasRevenue}
            emptyTitle={t("revenue.noTrend")}
            emptyDescription={t("revenue.noDataDesc")}
            noDataTitle={noDataTitle}
            noDataDescription={noDataDescription}
            heightClass="h-64 min-h-[256px]"
            chartData={mergedTrend}
          >
            {(chartTrend) => (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartTrend}
                  margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--shell-accent)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--shell-accent)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--shell-border)"
                    strokeOpacity={0.35}
                    strokeDasharray="3 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--shell-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--shell-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value, name) => [
                        formatRevenueCurrency(Number(value)),
                        name === "compareRevenue"
                          ? t("revenue.previousPeriod")
                          : t("revenue.periodRevenue"),
                      ],
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--shell-accent)"
                    strokeWidth={2.5}
                    fill="url(#revenueArea)"
                    dot={false}
                    isAnimationActive={false}
                  />
                  {compareEnabled ? (
                    <Line
                      type="monotone"
                      dataKey="compareRevenue"
                      stroke="var(--shell-muted)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                      isAnimationActive={false}
                    />
                  ) : null}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title={t("revenue.adrTrend")}
              subtitle={t("revenue.adrSubtitle")}
              loading={loading}
              empty={!hasAdr}
              emptyDescription={t("revenue.noDataDesc")}
              noDataTitle={noDataTitle}
              noDataDescription={noDataDescription}
              heightClass="h-48 min-h-[192px]"
              chartData={trend}
            >
              {(chartTrend) => (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartTrend}>
                    <CartesianGrid
                      stroke="var(--shell-border)"
                      strokeOpacity={0.35}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                      width={44}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={createChartTooltip({
                        formatter: (value) => [
                          formatRevenueCurrency(Number(value)),
                          t("revenue.kpiAdr"),
                        ],
                      })}
                    />
                    <Line
                      type="monotone"
                      dataKey="adr"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard
              title={t("revenue.revpar")}
              subtitle={t("revenue.revparSubtitle")}
              loading={loading}
              empty={!hasRevpar}
              emptyDescription={t("revenue.noDataDesc")}
              noDataTitle={noDataTitle}
              noDataDescription={noDataDescription}
              heightClass="h-48 min-h-[192px]"
              chartData={trend}
            >
              {(chartTrend) => (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartTrend}>
                    <CartesianGrid
                      stroke="var(--shell-border)"
                      strokeOpacity={0.35}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                      width={44}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={createChartTooltip({
                        formatter: (value) => [
                          formatRevenueCurrency(Number(value)),
                          t("revenue.revpar"),
                        ],
                      })}
                    />
                    <Line
                      type="monotone"
                      dataKey="revpar"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <ChartCard
            title={t("revenue.roomTypeRevenue")}
            subtitle={t("revenue.roomTypeRevenueSubtitle")}
            loading={loading}
            empty={byRoomType.length === 0}
            emptyDescription={t("revenue.noDataDesc")}
            noDataTitle={noDataTitle}
            noDataDescription={noDataDescription}
            heightClass="h-44 min-h-[176px]"
            chartData={byRoomType}
          >
            {(chartData) => (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 4, right: 8 }}
                >
                  <CartesianGrid
                    stroke="var(--shell-border)"
                    strokeOpacity={0.35}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={72}
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [
                        formatRevenueCurrency(Number(value)),
                        t("revenue.periodRevenue"),
                      ],
                    })}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--shell-accent)"
                    radius={[0, 8, 8, 0]}
                    barSize={14}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title={t("revenue.revenueSources")}
            subtitle={t("revenue.revenueSourcesSubtitle")}
            loading={loading}
            empty={bySource.length === 0}
            emptyDescription={t("revenue.noDataDesc")}
            noDataTitle={noDataTitle}
            noDataDescription={noDataDescription}
            heightClass="h-44 min-h-[176px]"
            chartData={bySource}
          >
            {(chartData) => (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    stroke="var(--shell-border)"
                    strokeOpacity={0.35}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    width={44}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [
                        formatRevenueCurrency(Number(value)),
                        t("revenue.periodRevenue"),
                      ],
                    })}
                  />
                  <Bar
                    dataKey="value"
                    fill="#34d399"
                    radius={[8, 8, 0, 0]}
                    barSize={22}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title={t("revenue.occupancyTrend")}
            subtitle={t("revenue.occupancyTrendSubtitle")}
            loading={loading}
            empty={!hasOccupancy}
            emptyDescription={t("revenue.noDataDesc")}
            noDataTitle={noDataTitle}
            noDataDescription={noDataDescription}
            heightClass="h-40 min-h-[160px]"
            chartData={trend}
          >
            {(chartTrend) => (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrend}>
                  <defs>
                    <linearGradient id="occArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--shell-border)"
                    strokeOpacity={0.35}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    width={36}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [
                        `${value}%`,
                        t("revenue.chartOccupancyLabel"),
                      ],
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#34d399"
                    fill="url(#occArea)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title={t("revenue.forecastChartTitle")}
            subtitle={t("revenue.forecastSubtitle")}
            loading={loading}
            empty={forecast.length === 0}
            emptyDescription={t("revenue.noForecastDesc")}
            noDataTitle={noDataTitle}
            noDataDescription={noDataDescription}
            heightClass="h-40 min-h-[160px]"
            chartData={forecast}
          >
            {(chartForecast) => (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartForecast}>
                  <CartesianGrid
                    stroke="var(--shell-border)"
                    strokeOpacity={0.35}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                    width={44}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [
                        formatRevenueCurrency(Number(value)),
                        t("revenue.projectedLabel"),
                      ],
                    })}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </GlassSurface>
  );
}
