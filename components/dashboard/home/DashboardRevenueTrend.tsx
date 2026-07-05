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

import type { TrendPoint } from "./dashboard-metrics";
import { formatDashboardCurrency } from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";

type Props = {
  data: TrendPoint[];
  loading: boolean;
};

export function DashboardRevenueTrend({ data, loading }: Props) {
  const hasData = data.some((point) => point.value > 0);

  return (
    <DashboardSurface glass className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Revenue trend"
        subtitle="Daily revenue over the last 7 days"
      />

      {loading ? (
        <DashboardSkeleton className="h-52" />
      ) : !hasData ? (
        <DashboardEmptyState
          title="No revenue data"
          description="When reservations with check-ins from the last week appear, the chart will fill in automatically."
        />
      ) : (
        <div className="h-52" role="img" aria-label="Revenue trend chart for the last 7 days">
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
                  "Revenue",
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
    </DashboardSurface>
  );
}
