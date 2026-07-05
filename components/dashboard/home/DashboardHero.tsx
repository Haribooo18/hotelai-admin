"use client";

import {
  CloudSun,
  DoorOpen,
  DoorClosed,
  Percent,
  Wallet,
} from "lucide-react";

import {
  formatDashboardCurrency,
  formatDashboardPercent,
  type DashboardMetrics,
} from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";

type Props = {
  metrics: DashboardMetrics;
  loading: boolean;
};

export function DashboardHero({ metrics, loading }: Props) {
  if (loading) {
    return (
      <DashboardSurface glass className="p-[var(--ds-surface-padding)]">
        <DashboardSkeleton />
      </DashboardSurface>
    );
  }

  const heroStats = [
    {
      label: "Occupancy",
      value: formatDashboardPercent(metrics.occupancyPercent),
      icon: Percent,
    },
    {
      label: "Revenue today",
      value: formatDashboardCurrency(metrics.revenueToday),
      icon: Wallet,
    },
    {
      label: "Check-ins",
      value: metrics.arrivalsToday,
      icon: DoorOpen,
    },
    {
      label: "Check-outs",
      value: metrics.departuresToday,
      icon: DoorClosed,
    },
  ];

  return (
    <DashboardSurface
      glass
      className="overflow-hidden p-[var(--ds-surface-padding)]"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {heroStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-3.5 transition-[transform,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-sm)]"
                >
                  <div className="flex items-center gap-2 text-[var(--type-caption-size)] font-medium text-[var(--shell-muted)]">
                    <Icon size={14} className="text-[var(--shell-accent)]" />
                    {stat.label}
                  </div>
                  <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <DashboardSurface
          interactive={false}
          className="w-full shrink-0 p-4 xl:w-[240px]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]">
              <CloudSun size={17} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--shell-text)]">
                Weather
              </p>
              <p className="text-[12px] text-[var(--shell-muted)]">
                Unavailable
              </p>
            </div>
          </div>
          <DashboardEmptyState
            title="Weather unavailable"
            description="Connect a weather service to see the forecast alongside operational metrics."
          />
        </DashboardSurface>
      </div>
    </DashboardSurface>
  );
}
