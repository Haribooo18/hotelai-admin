"use client";

import {
  Bot,
  Clock3,
  MessageSquare,
  Percent,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import type { AIOpsKpis } from "./ai-ops-metrics";

type Props = {
  kpis: AIOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof AIOpsKpis;
  label: string;
  icon: typeof Bot;
  format: (value: number) => string;
}> = [
  {
    key: "activeConversations",
    label: "Active conversations",
    icon: MessageSquare,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "aiResolvedToday",
    label: "AI resolved today",
    icon: Bot,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "humanTakeoverRate",
    label: "Human takeover rate",
    icon: UserRound,
    format: (value) => `${Math.round(value)}%`,
  },
  {
    key: "avgResponseMinutes",
    label: "Avg response time",
    icon: Clock3,
    format: (value) => `${Math.round(value)}m`,
  },
  {
    key: "conversionRate",
    label: "Conversion rate",
    icon: Percent,
    format: (value) => `${Math.round(value)}%`,
  },
  {
    key: "aiSatisfaction",
    label: "AI satisfaction",
    icon: Sparkles,
    format: (value) => `${Math.round(value)}%`,
  },
];

export function AIExecutiveKpis({ kpis, loading }: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-24" />
              <DashboardSkeletonBlock className="h-7 w-14" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>
    );
  }

  return (
    <DashboardGlassPanel className="overflow-hidden p-[var(--ds-surface-padding)]">
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-6">
        {KPI_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const value = kpis[item.key];

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                index > 0 && "xl:border-l xl:border-[var(--shell-border)]/60"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
                  <Icon size={15} />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                  {item.label}
                </p>
              </div>
              <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                <AnimatedMetric value={value} formatter={item.format} />
              </p>
            </div>
          );
        })}
      </div>
    </DashboardGlassPanel>
  );
}
