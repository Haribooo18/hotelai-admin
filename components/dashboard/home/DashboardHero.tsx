"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  DoorOpen,
  DoorClosed,
  Percent,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
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

function resolveGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function resolveDisplayName(
  email: string | undefined,
  metadataName: string | undefined
): string {
  if (metadataName?.trim()) return metadataName.trim();

  if (email) {
    const local = email.split("@")[0] ?? "colleague";
    return local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "colleague";
}

export function DashboardHero({ metrics, loading }: Props) {
  const [displayName, setDisplayName] = useState("colleague");

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;

      const metadataName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : undefined;

      setDisplayName(resolveDisplayName(user.email, metadataName));
    });
  }, []);

  if (loading) {
    return (
      <DashboardSurface glass className="p-6 lg:p-8">
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
      className="overflow-hidden p-6 lg:p-8 hover:shadow-[var(--shell-shadow-md)]"
    >
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-emerald-500">
            Hotel overview
          </p>
          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-[var(--shell-text)] lg:text-[40px]">
            {resolveGreeting()}, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--shell-muted)]">
            Today&apos;s operational status: occupancy, guest movement, and
            financial metrics in one place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {heroStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-[16px] bg-[var(--shell-nav-hover-bg)]/60 p-4 transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-hover-bg)]"
                >
                  <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--shell-muted)]">
                    <Icon size={14} className="text-emerald-500" />
                    {stat.label}
                  </div>
                  <p className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <DashboardSurface className="w-full shrink-0 p-5 xl:w-[280px]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--shell-nav-hover-bg)] text-[var(--shell-muted)]">
              <CloudSun size={20} />
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
