"use client";

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

import {
  DashboardEmptyState,
  DashboardGlassPanel,
  DashboardPanelHeader,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";

import {
  formatRevenueCurrency,
  type RevenueBreakdownPoint,
  type RevenueForecastPoint,
  type RevenueTrendPoint,
} from "./revenue-metrics";

const TOOLTIP_STYLE = {
  background: "var(--shell-surface)",
  border: "none",
  borderRadius: "var(--ds-radius-sm)",
  boxShadow: "var(--shell-shadow-md)",
  color: "var(--shell-text)",
  fontSize: 12,
};

type Props = {
  trend: RevenueTrendPoint[];
  compareTrend: RevenueTrendPoint[];
  bySource: RevenueBreakdownPoint[];
  byRoomType: RevenueBreakdownPoint[];
  forecast: RevenueForecastPoint[];
  compareEnabled: boolean;
  loading?: boolean;
};

function ChartShell({
  title,
  subtitle,
  loading,
  empty,
  heightClass,
  children,
}: {
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  heightClass: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardGlassPanel className="p-4">
      <DashboardPanelHeader
        title={title}
        subtitle={subtitle}
        className="mb-3"
      />
      {loading ? (
        <DashboardSkeletonBlock className={heightClass} />
      ) : empty ? (
        <DashboardEmptyState
          title="No data"
          description="Data appears after bookings in the selected period."
        />
      ) : (
        <div className={heightClass}>{children}</div>
      )}
    </DashboardGlassPanel>
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
  const mergedTrend = trend.map((point, index) => ({
    ...point,
    compareRevenue: compareTrend[index]?.revenue ?? 0,
  }));

  const hasRevenue = trend.some((point) => point.revenue > 0);
  const hasOccupancy = trend.some((point) => point.occupancy > 0);
  const hasAdr = trend.some((point) => point.adr > 0);
  const hasRevpar = trend.some((point) => point.revpar > 0);

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-7">
        <ChartShell
          title="Revenue trend"
          subtitle="Daily gross revenue"
          loading={loading}
          empty={!hasRevenue}
          heightClass="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mergedTrend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--shell-accent)" stopOpacity={0.3} />
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
              />
              <YAxis
                tick={{ fill: "var(--shell-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value, name) => [
                  formatRevenueCurrency(Number(value)),
                  name === "compareRevenue" ? "Previous period" : "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--shell-accent)"
                strokeWidth={2.5}
                fill="url(#revenueArea)"
                dot={false}
              />
              {compareEnabled ? (
                <Line
                  type="monotone"
                  dataKey="compareRevenue"
                  stroke="var(--shell-muted)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </ChartShell>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartShell
            title="ADR trend"
            subtitle="Average daily rate"
            loading={loading}
            empty={!hasAdr}
            heightClass="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--shell-muted)" }} width={44} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [formatRevenueCurrency(Number(value)), "ADR"]}
                />
                <Line type="monotone" dataKey="adr" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>

          <ChartShell
            title="RevPAR trend"
            subtitle="Revenue per available room"
            loading={loading}
            empty={!hasRevpar}
            heightClass="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--shell-muted)" }} width={44} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [formatRevenueCurrency(Number(value)), "RevPAR"]}
                />
                <Line type="monotone" dataKey="revpar" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
        </div>
      </div>

      <div className="space-y-4 xl:col-span-5">
        <ChartShell
          title="Revenue by room type"
          loading={loading}
          empty={byRoomType.length === 0}
          heightClass="h-44"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byRoomType} layout="vertical" margin={{ left: 4, right: 8 }}>
              <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={72}
                tick={{ fontSize: 10, fill: "var(--shell-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [formatRevenueCurrency(Number(value)), "Revenue"]}
              />
              <Bar dataKey="value" fill="var(--shell-accent)" radius={[0, 8, 8, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title="Revenue by source"
          loading={loading}
          empty={bySource.length === 0}
          heightClass="h-44"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bySource}>
              <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--shell-muted)" }} width={44} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [formatRevenueCurrency(Number(value)), "Revenue"]}
              />
              <Bar dataKey="value" fill="#34d399" radius={[8, 8, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title="Occupancy trend"
          loading={loading}
          empty={!hasOccupancy}
          heightClass="h-40"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="occArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--shell-muted)" }} width={36} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [`${value}%`, "Occupancy"]}
              />
              <Area type="monotone" dataKey="occupancy" stroke="#34d399" fill="url(#occArea)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title="Forecast"
          subtitle="7-day projection from recent average"
          loading={loading}
          empty={forecast.length === 0}
          heightClass="h-40"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid stroke="var(--shell-border)" strokeOpacity={0.35} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--shell-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--shell-muted)" }} width={44} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [formatRevenueCurrency(Number(value)), "Projected"]}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </div>
  );
}
