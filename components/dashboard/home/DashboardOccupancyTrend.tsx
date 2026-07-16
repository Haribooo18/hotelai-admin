"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartAxisTickProps, chartGridProps, chartTokens } from "@/lib/design/chart";
import { createChartTooltip } from "@/components/motion/ChartTooltip";
import { MotionChart } from "@/components/motion/MotionChart";
import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { WorkspaceChartSkeleton } from "@/components/dashboard/shared/skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Section } from "@/components/ui/primitives/Section";

import type { TrendPoint } from "./dashboard-metrics";
import { useI18n } from "@/lib/i18n";

type Props = {
  data: TrendPoint[];
  loading: boolean;
};

export function DashboardOccupancyTrend({ data, loading }: Props) {
  const { t } = useI18n();
  const hasData = data.some((point) => point.value > 0);

  return (
    <GlassSurface interactive className="overflow-hidden p-[var(--ds-surface-padding)]">
      <Section
        title={t("dashboard.occupancyTrend")}
        subtitle={t("dashboard.occupancyTrendSubtitle")}
      />

      <SkeletonCrossfade
        loading={loading}
        skeleton={<WorkspaceChartSkeleton className="h-52 min-h-[208px]" />}
      >
        <MotionChart
          data={data}
          empty={!hasData}
          className="h-52 min-h-[208px]"
          emptyContent={
            <EmptyState
              title={t("dashboard.noOccupancyData")}
              description={t("dashboard.noOccupancyDataDesc")}
            />
          }
        >
          {(chartData) => (
            <div
              className="h-full min-h-[208px]"
              role="img"
              aria-label={t("dashboard.occupancyTrendAria")}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={chartTokens.margin}
                >
                  <CartesianGrid {...chartGridProps} />
                  <XAxis
                    dataKey="label"
                    tick={chartAxisTickProps}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    tick={chartAxisTickProps}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    width={36}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [`${value}%`, t("dashboard.occupancy")],
                    })}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--shell-accent)"
                    fillOpacity={0.82}
                    radius={[10, 10, 0, 0]}
                    maxBarSize={28}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </MotionChart>
      </SkeletonCrossfade>
    </GlassSurface>
  );
}
