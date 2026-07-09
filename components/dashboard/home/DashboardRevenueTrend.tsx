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

import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { WorkspaceChartSkeleton } from "@/components/dashboard/shared/skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Section } from "@/components/ui/primitives/Section";

import type { TrendPoint } from "./dashboard-metrics";
import { formatDashboardCurrency } from "./dashboard-metrics";
import { useI18n } from "@/lib/i18n";

type Props = {
  data: TrendPoint[];
  loading: boolean;
};

export function DashboardRevenueTrend({ data, loading }: Props) {
  const { t } = useI18n();
  const hasData = data.some((point) => point.value > 0);

  return (
    <GlassSurface interactive className="overflow-hidden p-[var(--ds-surface-padding)]">
      <Section
        title={t("dashboard.revenueTrend")}
        subtitle={t("dashboard.revenueTrendSubtitle")}
      />

      <SkeletonCrossfade
        loading={loading}
        skeleton={<WorkspaceChartSkeleton className="h-52 min-h-[208px]" />}
      >
        {!hasData ? (
          <EmptyState
            title={t("dashboard.noRevenueData")}
            description={t("dashboard.noRevenueDataDesc")}
          />
        ) : (
          <div
            className="h-52 min-h-[208px]"
            role="img"
            aria-label={t("dashboard.revenueTrendAria")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--shell-accent)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--shell-accent)" stopOpacity={0.02} />
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
                  dy={8}
                />
                <YAxis
                  tick={{ fill: "var(--shell-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--shell-surface)",
                    border: "none",
                    borderRadius: "var(--ds-radius-sm)",
                    boxShadow: "var(--shell-shadow-md)",
                    color: "var(--shell-text)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [
                    formatDashboardCurrency(Number(value)),
                    t("dashboard.revenueToday"),
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--shell-accent)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--shell-accent)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </SkeletonCrossfade>
    </GlassSurface>
  );
}
