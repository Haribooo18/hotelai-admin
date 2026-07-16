import type { ComponentProps, ReactNode } from "react";

import { todayIso } from "@/lib/dashboard/date";
import { WorkspaceCard } from "@/components/dashboard/shared/WorkspaceCard";
import { WorkspaceDetailRow } from "@/components/dashboard/shared/WorkspaceDetailRow";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type {
  RevenueDateRange,
  RevenueForecastPoint,
  RevenueTrendPoint,
} from "./revenue-metrics";

export type RevenueRangePreset =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export type RevenueToolbarFilters = {
  search: string;
  status: string;
  roomId: string;
};

function addDays(date: string, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export function buildRevenuePresetRange(
  preset: Exclude<RevenueRangePreset, "custom">
): RevenueDateRange {
  const to = todayIso();

  switch (preset) {
    case "today":
      return { from: to, to };
    case "week":
      return { from: addDays(to, -6), to };
    case "month":
      return { from: addDays(to, -29), to };
    case "quarter":
      return { from: addDays(to, -89), to };
    case "year":
      return { from: addDays(to, -364), to };
  }
}

export function detectRevenuePreset(range: RevenueDateRange): RevenueRangePreset {
  const presets: Array<Exclude<RevenueRangePreset, "custom">> = [
    "today",
    "week",
    "month",
    "quarter",
    "year",
  ];

  for (const preset of presets) {
    const candidate = buildRevenuePresetRange(preset);
    if (candidate.from === range.from && candidate.to === range.to) {
      return preset;
    }
  }

  return "custom";
}

export function computeDisplayGrowth(trend: RevenueTrendPoint[]): number {
  if (trend.length < 2) return 0;

  const midpoint = Math.floor(trend.length / 2);
  const first = trend.slice(0, midpoint);
  const second = trend.slice(midpoint);

  const firstTotal = first.reduce((sum, point) => sum + point.revenue, 0);
  const secondTotal = second.reduce((sum, point) => sum + point.revenue, 0);

  if (firstTotal <= 0) return secondTotal > 0 ? 100 : 0;

  return Math.round(((secondTotal - firstTotal) / firstTotal) * 100);
}

export function computeDisplayForecastTotal(
  forecast: RevenueForecastPoint[]
): number {
  return forecast.reduce((sum, point) => sum + point.projected, 0);
}

export function computeForecastConfidence(trend: RevenueTrendPoint[]): number {
  const sample = trend.slice(-7).map((point) => point.revenue);
  if (sample.length < 2) return 0;

  const average = sample.reduce((sum, value) => sum + value, 0) / sample.length;
  if (average <= 0) return 55;

  const variance =
    sample.reduce((sum, value) => sum + (value - average) ** 2, 0) / sample.length;
  const volatility = Math.sqrt(variance) / average;

  return Math.max(35, Math.min(95, Math.round(88 - volatility * 100)));
}

export function getTrendSeries(
  trend: RevenueTrendPoint[],
  key: keyof Pick<RevenueTrendPoint, "revenue" | "adr" | "revpar" | "occupancy">
): number[] {
  return trend.map((point) => point[key]);
}

export function MiniTrend({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 24 - ((value - min) / span) * 20 - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 24"
      className={cn("h-6 w-full text-[var(--shell-accent)]", className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function RevenueWorkspaceCard({
  className,
  children,
  ...props
}: ComponentProps<typeof WorkspaceCard> & { children: ReactNode }) {
  return (
    <WorkspaceCard interactive={false} className={className} {...props}>
      {children}
    </WorkspaceCard>
  );
}

export function RevenueOpsListItem({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)]/40 bg-[var(--shell-surface-raised)]/50 px-3 py-2.5 text-left",
        motionPresets.transitionBase,
        "hover:border-[var(--shell-border)] hover:bg-[var(--shell-surface-raised)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function RevenueDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return <WorkspaceDetailRow label={label} value={value} />;
}
