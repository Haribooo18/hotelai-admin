import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";
import {
  cardPaddingClass,
  kpiCellClass,
  kpiGridClass,
  kpiMetricGapClass,
  kpiSparklineGapClass,
  kpiTrendGapClass,
  tableDefaultSkeletonRows,
  tableSkeletonGapClass,
  tableSkeletonRowClass,
} from "@/lib/dashboard/design-system";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type KpiSkeletonVariant = "default" | "trend" | "sparkline";

type KpiSkeletonProps = {
  count: number;
  gridClassName: string;
  variant?: KpiSkeletonVariant;
  bordered?: boolean;
};

export function WorkspaceKpiSkeleton({
  count,
  gridClassName,
  variant = "default",
  bordered = true,
}: KpiSkeletonProps) {
  return (
    <div className={cn(kpiGridClass, gridClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            kpiCellClass,
            bordered && index > 0 && "xl:border-l xl:border-[var(--shell-border)]/60"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Skeleton className="h-7 w-7 shrink-0 rounded-[var(--ds-radius-sm)]" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
          </div>
          <Skeleton className={cn(kpiMetricGapClass, "h-7 w-16")} />
          {variant === "trend" ? (
            <Skeleton className={cn(kpiTrendGapClass, "h-3 w-12")} />
          ) : null}
          {variant === "sparkline" ? (
            <Skeleton className={cn(kpiSparklineGapClass, "h-6 w-full")} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function WorkspaceTableSkeleton({
  rows = tableDefaultSkeletonRows,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <div className={tableSkeletonGapClass} role="presentation" aria-hidden>
      <div className="flex items-center gap-3 border-b border-[var(--shell-border)]/40 px-2 pb-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-3",
              index === 0 ? "w-24" : index === columns - 1 ? "ml-auto w-8" : "w-16"
            )}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "flex items-center gap-3 px-2",
            tableSkeletonRowClass
          )}
        >
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          {Array.from({ length: Math.max(columns - 2, 1) }).map((__, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-3.5",
                colIndex === 0 ? "max-w-[180px] flex-[2]" : "max-w-[96px] flex-1"
              )}
            />
          ))}
          <Skeleton className="ml-auto h-6 w-6 shrink-0 rounded-[var(--ds-radius-sm)]" />
        </div>
      ))}
    </div>
  );
}

type CalendarGridSkeletonProps = {
  headerHeight?: number;
  rowHeight?: number;
  rowCount?: number;
};

export function WorkspaceCalendarGridSkeleton({
  headerHeight = 68,
  rowHeight = 72,
  rowCount = 6,
}: CalendarGridSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-[var(--ds-radius)]" role="presentation" aria-hidden>
      <Skeleton
        className="mb-2 w-full rounded-[var(--ds-radius-sm)]"
        style={{ height: headerHeight }}
      />
      {Array.from({ length: rowCount }).map((_, index) => (
        <Skeleton
          key={index}
          className="mb-2 w-full rounded-[var(--ds-radius-sm)]"
          style={{ height: rowHeight }}
        />
      ))}
    </div>
  );
}

export function WorkspaceChartSkeleton({
  className = "h-52",
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-end gap-2", className)} aria-hidden>
      <div className="flex h-full items-end gap-2 px-1">
        {[42, 68, 55, 80, 48, 72, 58].map((height, index) => (
          <Skeleton
            key={index}
            className="flex-1 rounded-t-[var(--ds-radius-sm)]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2 px-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-2 flex-1 rounded-[var(--ds-radius-sm)]" />
        ))}
      </div>
    </div>
  );
}

export function WorkspaceInspectorSkeleton() {
  return (
    <div className={motionPresets.inspectorRevealRoot} role="presentation" aria-hidden>
      <MotionReveal order={0}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </MotionReveal>
      <MotionReveal order={1}>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
          <Skeleton className="mt-2 h-20 w-full rounded-[var(--ds-radius-sm)]" />
        </div>
      </MotionReveal>
      <MotionReveal order={2}>
        <Skeleton className="mt-4 h-8 w-28 rounded-[var(--ds-radius-sm)]" />
      </MotionReveal>
    </div>
  );
}

type CardGridSkeletonProps = {
  count?: number;
  heightClass?: string;
  gridClassName?: string;
};

export function WorkspaceCardGridSkeleton({
  count = 6,
  heightClass = "h-52",
  gridClassName = "grid gap-4 md:grid-cols-2 2xl:grid-cols-3",
}: CardGridSkeletonProps) {
  return (
    <div className={gridClassName} role="presentation" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cn(heightClass, "rounded-[var(--ds-radius)]")} />
      ))}
    </div>
  );
}

export type WorkspacePageSkeletonVariant =
  | "dashboard"
  | "bookings"
  | "calendar"
  | "revenue"
  | "guests"
  | "rooms"
  | "knowledge"
  | "settings"
  | "generic";

type PageSkeletonConfig = {
  kpiCount: number;
  kpiGridClassName: string;
  kpiVariant?: KpiSkeletonVariant;
  toolbar?: boolean;
  chart?: boolean;
  table?: boolean;
  calendar?: boolean;
  inspector?: boolean;
  cardGrid?: boolean;
  cardGridHeight?: string;
  operations?: boolean;
  children?: ReactNode;
};

const PAGE_SKELETON_CONFIG: Record<WorkspacePageSkeletonVariant, PageSkeletonConfig> = {
  dashboard: {
    kpiCount: 6,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-6",
    chart: true,
    table: true,
    operations: true,
  },
  bookings: {
    kpiCount: 5,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-5",
    toolbar: true,
    cardGrid: true,
    operations: true,
  },
  calendar: {
    kpiCount: 6,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-6",
    toolbar: true,
    calendar: true,
    operations: true,
  },
  revenue: {
    kpiCount: 7,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7",
    kpiVariant: "sparkline",
    toolbar: true,
    chart: true,
    inspector: true,
    operations: true,
  },
  guests: {
    kpiCount: 6,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-6",
    toolbar: true,
    cardGrid: true,
    cardGridHeight: "h-56",
    operations: true,
  },
  rooms: {
    kpiCount: 8,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8",
    toolbar: true,
    cardGrid: true,
    operations: true,
  },
  knowledge: {
    kpiCount: 6,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-3",
    toolbar: true,
    cardGrid: true,
    cardGridHeight: "h-40",
    inspector: true,
    operations: true,
  },
  settings: {
    kpiCount: 0,
    kpiGridClassName: "",
    children: (
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-[var(--ds-radius)]" />
        <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
      </div>
    ),
  },
  generic: {
    kpiCount: 4,
    kpiGridClassName: "sm:grid-cols-2 xl:grid-cols-4",
    chart: true,
    table: true,
  },
};

type WorkspacePageSkeletonProps = {
  label: string;
  variant?: WorkspacePageSkeletonVariant;
};

export function WorkspacePageSkeleton({
  label,
  variant = "generic",
}: WorkspacePageSkeletonProps) {
  const config = PAGE_SKELETON_CONFIG[variant];

  return (
    <Stack gap="md" aria-busy="true" aria-label={label}>
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />

      {config.toolbar ? (
        <Skeleton className="h-12 w-full rounded-[var(--ds-radius)]" />
      ) : null}

      {config.kpiCount > 0 ? (
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceKpiSkeleton
            count={config.kpiCount}
            gridClassName={config.kpiGridClassName}
            variant={config.kpiVariant}
          />
        </GlassSurface>
      ) : null}

      {config.chart ? (
        <div className="grid gap-4 md:grid-cols-2">
          <GlassSurface className={cardPaddingClass}>
            <WorkspaceChartSkeleton />
          </GlassSurface>
          <GlassSurface className={cardPaddingClass}>
            <WorkspaceChartSkeleton />
          </GlassSurface>
        </div>
      ) : null}

      {config.calendar ? (
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceCalendarGridSkeleton />
        </GlassSurface>
      ) : null}

      {config.table ? (
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceTableSkeleton />
        </GlassSurface>
      ) : null}

      {config.cardGrid ? (
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceCardGridSkeleton heightClass={config.cardGridHeight} />
        </GlassSurface>
      ) : null}

      {config.inspector ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
          <GlassSurface className={cn("hidden p-[var(--ds-surface-padding)] xl:block")}>
            <WorkspaceInspectorSkeleton />
          </GlassSurface>
        </div>
      ) : null}

      {config.operations ? (
        <GlassSurface className={cardPaddingClass}>
          <WorkspaceCardGridSkeleton count={3} heightClass="h-44" gridClassName="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" />
        </GlassSurface>
      ) : null}

      {config.children}
    </Stack>
  );
}
