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

import type { TrendPoint } from "./dashboard-metrics";
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

export function DashboardOccupancyTrend({ data, loading }: Props) {
  const hasData = data.some((point) => point.value > 0);

  return (
    <DashboardSurface glass className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Occupancy trend"
        subtitle="Occupancy percentage over 7 days"
      />

      {loading ? (
        <DashboardSkeleton className="h-52" />
      ) : !hasData ? (
        <DashboardEmptyState
          title="No occupancy data"
          description="Add rooms and reservations to track daily hotel occupancy."
        />
      ) : (
        <div className="h-52" role="img" aria-label="Occupancy trend chart for the last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
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
                domain={[0, 100]}
                width={36}
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
                formatter={(value) => [`${value}%`, "Occupancy"]}
              />
              <Bar
                dataKey="value"
                fill="var(--shell-accent)"
                fillOpacity={0.82}
                radius={[10, 10, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSurface>
  );
}
