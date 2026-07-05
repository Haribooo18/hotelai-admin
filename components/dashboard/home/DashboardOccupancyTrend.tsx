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
  DashboardSectionTitle,
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
    <DashboardSurface className="p-6">
      <DashboardSectionTitle
        title="Occupancy trend"
        subtitle="Occupancy percentage over 7 days"
      />

      {loading ? (
        <DashboardSkeleton className="h-56" />
      ) : !hasData ? (
        <DashboardEmptyState
          title="No occupancy data"
          description="Add rooms and reservations to track daily hotel occupancy."
        />
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                domain={[0, 100]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--shell-surface)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "var(--shell-shadow-md)",
                  color: "var(--shell-text)",
                }}
                formatter={(value) => [`${value}%`, "Occupancy"]}
              />
              <Bar
                dataKey="value"
                fill="#34d399"
                radius={[10, 10, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSurface>
  );
}
