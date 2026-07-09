"use client";

import type { ReactNode } from "react";

import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import {
  WorkspaceKpiSkeleton,
  type KpiSkeletonVariant,
} from "@/components/dashboard/shared/skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import {
  cardPaddingClass,
  kpiGridClass,
  workspaceSurfaceClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  ariaLabel: string;
  loading?: boolean;
  count: number;
  gridClassName: string;
  skeletonVariant?: KpiSkeletonVariant;
  connected?: boolean;
  children: ReactNode;
};

export function ExecutiveKpisPanel({
  ariaLabel,
  loading = false,
  count,
  gridClassName,
  skeletonVariant = "default",
  connected = false,
  children,
}: Props) {
  return (
    <SkeletonCrossfade
      loading={loading}
      skeleton={
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceKpiSkeleton
            count={count}
            gridClassName={gridClassName}
            variant={skeletonVariant}
          />
        </GlassSurface>
      }
    >
      <GlassSurface
        interactive
        className={cn(
          workspaceSurfaceClass,
          connected && "overflow-hidden"
        )}
        aria-label={ariaLabel}
      >
        <div
          className={cn(
            connected
              ? "grid divide-x divide-y divide-[var(--shell-border)]/20"
              : kpiGridClass,
            gridClassName
          )}
        >
          {children}
        </div>
      </GlassSurface>
    </SkeletonCrossfade>
  );
}
