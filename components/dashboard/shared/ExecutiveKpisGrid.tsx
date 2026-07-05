"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";

import { DashboardGlassPanel } from "@/components/dashboard/home/DashboardPrimitives";
import { KpiCard } from "@/components/ui/data/KpiCard";
import { Skeleton } from "@/components/ui/display/Skeleton";
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
              <Skeleton className={skeletonLabelClassName} />
              <Skeleton className={skeletonValueClassName} />
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
        {items.map((item, index) => (
          <KpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={item.value}
            format={item.format}
            bordered={index > 0}
            className={index > 0 ? borderClass : undefined}
          />
        ))}
      </div>
    </DashboardGlassPanel>
  );
});
