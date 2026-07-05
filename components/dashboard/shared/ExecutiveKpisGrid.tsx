"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";

import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

export type ExecutiveKpiGridItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  value: number;
  format: (value: number) => string;
};

type Props = {
  items: ExecutiveKpiGridItem[];
  loading?: boolean;
  gridClassName: string;
  borderFrom?: "xl" | "2xl";
  skeletonCount: number;
  skeletonLabelClassName?: string;
  skeletonValueClassName?: string;
};

export const ExecutiveKpisGrid = memo(function ExecutiveKpisGrid({
  items,
  loading = false,
  gridClassName,
  borderFrom = "xl",
  skeletonCount,
  skeletonLabelClassName = "h-3 w-20",
  skeletonValueClassName = "h-7 w-14",
}: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className={cn("grid gap-3", gridClassName)}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className={skeletonLabelClassName} />
              <DashboardSkeletonBlock className={skeletonValueClassName} />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>
    );
  }

  const borderClass =
    borderFrom === "2xl"
      ? "2xl:border-l 2xl:border-[var(--shell-border)]/60"
      : "xl:border-l xl:border-[var(--shell-border)]/60";

  return (
    <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
      <div className={cn("grid gap-1", gridClassName)}>
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                index > 0 && borderClass
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
                <AnimatedMetric value={item.value} formatter={item.format} />
              </p>
              <span className="sr-only" aria-live="polite">
                {item.format(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardGlassPanel>
  );
});
