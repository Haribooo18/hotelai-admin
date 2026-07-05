"use client";

import {
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

import {
  DashboardEmptyState,
  DashboardSectionTitle,
  DashboardSkeleton,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import {
  formatRevenueCurrency,
  type RevenueBreakdownPoint,
  type RevenueTrendPoint,
} from "./revenue-metrics";

type Props = {
  trend: RevenueTrendPoint[];
  occupancyTrend: RevenueTrendPoint[];
  adrTrend: RevenueTrendPoint[];
  byChannel: RevenueBreakdownPoint[];
  byRoomType: RevenueBreakdownPoint[];
  monthlyComparison: RevenueBreakdownPoint[];
  compareEnabled: boolean;
  loading?: boolean;
};

function ChartCard({
  title,
  subtitle,
  children,
  loading,
  empty,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <DashboardSurface className="p-6">
      <DashboardSectionTitle title={title} subtitle={subtitle} />
      {loading ? (
        <DashboardSkeleton className="h-56" />
      ) : empty ? (
        <DashboardEmptyState
          title="No data"
          description="Data appears after bookings in the selected period."
        />
      ) : (
        children
      )}
    </DashboardSurface>
  );
}

export function RevenueCharts({
  trend,
  occupancyTrend,
  adrTrend,
  byChannel,
  byRoomType,
  monthlyComparison,
  compareEnabled,
  loading = false,
}: Props) {
  const hasRevenue = trend.some((point) => point.revenue > 0);

  return (
    <div className="space-y-6">
      <ChartCard
        title="Revenue trend"
        subtitle="Primary financial metric"
        loading={loading}
        empty={!hasRevenue}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
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
                width={56}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--shell-surface)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "var(--shell-shadow-md)",
                }}
                formatter={(value) => [
                  formatRevenueCurrency(Number(value)),
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Occupancy trend"
          loading={loading}
          empty={!occupancyTrend.some((p) => p.occupancy > 0)}
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrend}>
                <CartesianGrid stroke="var(--shell-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} width={40} />
                <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="ADR trend"
          loading={loading}
          empty={!adrTrend.some((p) => p.adr > 0)}
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adrTrend}>
                <CartesianGrid stroke="var(--shell-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis width={48} />
                <Tooltip
                  formatter={(value) => [
                    formatRevenueCurrency(Number(value)),
                    "ADR",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="adr"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          title="Revenue by channel"
          loading={loading}
          empty={byChannel.length === 0}
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byChannel}>
                <CartesianGrid stroke="var(--shell-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis width={48} />
                <Tooltip
                  formatter={(value) => [
                    formatRevenueCurrency(Number(value)),
                    "Revenue",
                  ]}
                />
                <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Revenue by room type"
          loading={loading}
          empty={byRoomType.length === 0}
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRoomType}>
                <CartesianGrid stroke="var(--shell-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis width={48} />
                <Tooltip
                  formatter={(value) => [
                    formatRevenueCurrency(Number(value)),
                    "Revenue",
                  ]}
                />
                <Bar dataKey="value" fill="#34d399" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Monthly comparison"
          subtitle={compareEnabled ? "Current vs previous" : undefined}
          loading={loading}
          empty={monthlyComparison.every((item) => item.value === 0)}
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid stroke="var(--shell-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis width={48} />
                <Tooltip
                  formatter={(value) => [
                    formatRevenueCurrency(Number(value)),
                    "Revenue",
                  ]}
                />
                <Bar dataKey="value" fill="#60a5fa" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
