"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartAxisTickProps, chartTokens } from "@/lib/design/chart";
import { createChartTooltip } from "@/components/motion/ChartTooltip";
import { MotionChart } from "@/components/motion/MotionChart";
import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { WorkspaceChartSkeleton } from "@/components/dashboard/shared/skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { TrendPoint } from "./dashboard-metrics";
import { formatDashboardCurrency } from "./dashboard-metrics";

const revenueGridProps = {
  stroke: chartTokens.gridStroke,
  strokeOpacity: 0.18,
  strokeDasharray: chartTokens.gridDasharray,
  vertical: false as const,
};

type Props = {
  data: TrendPoint[];
  loading: boolean;
};

export function DashboardRevenueTrend({ data, loading }: Props) {
  const { t } = useI18n();
  const hasData = data.some((point) => point.value > 0);

  return (
    <GlassSurface
      interactive
      className={cn(cardPaddingClass, "overflow-hidden p-6 md:p-8")}
    >
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2 className="ds-section-title">{t("dashboard.revenueTrend")}</h2>
        <p className="ds-caption text-[var(--shell-muted)]">
          {t("dashboard.revenueTrendSubtitle")}
        </p>
      </div>

      <SkeletonCrossfade
        loading={loading}
        skeleton={<WorkspaceChartSkeleton className="h-72 min-h-[288px]" />}
      >
        <MotionChart
          data={data}
          empty={!hasData}
          className="h-72 min-h-[288px] px-2"
          emptyContent={
            <EmptyState
              title={t("dashboard.noRevenueData")}
              description={t("dashboard.noRevenueDataDesc")}
            />
          }
        >
          {(chartData) => (
            <div
              className="h-full min-h-[288px]"
              role="img"
              aria-label={t("dashboard.revenueTrendAria")}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ ...chartTokens.margin, top: 12, right: 12, left: -4 }}
                >
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--shell-accent)"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--shell-accent)"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...revenueGridProps} />
                  <XAxis
                    dataKey="label"
                    tick={chartAxisTickProps}
                    axisLine={false}
                    tickLine={false}
                    dy={12}
                  />
                  <YAxis
                    tick={chartAxisTickProps}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <Tooltip
                    content={createChartTooltip({
                      formatter: (value) => [
                        formatDashboardCurrency(Number(value)),
                        t("dashboard.revenueToday"),
                      ],
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--shell-accent)"
                    strokeWidth={2}
                    fill="url(#revenueFill)"
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--shell-accent)" }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </MotionChart>
      </SkeletonCrossfade>
    </GlassSurface>
  );
}
