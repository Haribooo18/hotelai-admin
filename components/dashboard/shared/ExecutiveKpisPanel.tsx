"use client";

import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import {
  cardPaddingClass,
  kpiCellClass,
  kpiGridClass,
  kpiSkeletonCellClass,
  workspaceSurfaceClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type SkeletonVariant = "default" | "trend" | "sparkline";

type Props = {
  ariaLabel: string;
  loading?: boolean;
  count: number;
  gridClassName: string;
  skeletonVariant?: SkeletonVariant;
  children: ReactNode;
};

export function ExecutiveKpisPanel({
  ariaLabel,
  loading = false,
  count,
  gridClassName,
  skeletonVariant = "default",
  children,
}: Props) {
  if (loading) {
    return (
      <GlassSurface className={cardPaddingClass}>
        <div className={cn(kpiGridClass, gridClassName)}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className={cn(kpiCellClass, kpiSkeletonCellClass)}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              {skeletonVariant === "trend" ? (
                <Skeleton className="h-3 w-12" />
              ) : null}
              {skeletonVariant === "sparkline" ? (
                <Skeleton className="h-6 w-full" />
              ) : null}
            </div>
          ))}
        </div>
      </GlassSurface>
    );
  }

  return (
    <GlassSurface
      interactive
      className={workspaceSurfaceClass}
      aria-label={ariaLabel}
    >
      <div className={cn(kpiGridClass, gridClassName)}>{children}</div>
    </GlassSurface>
  );
}
