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
  DashboardSectionTitle,
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
    <DashboardSurface className="p-6">
      <DashboardSectionTitle
        title="Revenue trend"
        subtitle="Over the last 7 days"
      />

      {loading ? (
        <DashboardSkeleton className="h-56" />
      ) : !hasData ? (
        <DashboardEmptyState
          title="No revenue data"
          description="When reservations with check-ins from the last week appear, the chart will fill in automatically."
        />
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--shell-border)"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--shell-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--shell-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--shell-surface)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "var(--shell-shadow-md)",
                  color: "var(--shell-text)",
                }}
                formatter={(value) => [
                  formatDashboardCurrency(Number(value)),
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSurface>
  );
}
