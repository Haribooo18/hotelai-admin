"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Metric } from "@/components/ui/display/Metric";
import {
  Skeleton,
  SkeletonGroup,
} from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";
import { Surface } from "@/components/ui/primitives/Surface";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { pageStackClass } from "@/lib/dashboard/design-system";
import { surfaceClass, surfaceStaticClass } from "@/lib/design/elevation";
import { sectionTitleClass } from "@/lib/design/typography";
import { cn } from "@/lib/utils";

type ShellSurfaceProps = {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  interactive?: boolean;
};

export function DashboardSurface({
  children,
  className,
  glass = false,
  interactive = true,
}: ShellSurfaceProps) {
  if (glass) {
    return (
      <Surface
        interactive={interactive}
        className={cn(
          "bg-[var(--shell-glass)] backdrop-blur-xl",
          className
        )}
      >
        {children}
      </Surface>
    );
  }

  return (
    <Surface interactive={interactive} className={className}>
      {children}
    </Surface>
  );
}

export function DashboardEmptyState(
  props: React.ComponentProps<typeof EmptyState>
) {
  return <EmptyState {...props} />;
}

export function DashboardSkeleton({
  className,
}: {
  className?: string;
}) {
  return <SkeletonGroup className={className} />;
}

export function DashboardSkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return <Skeleton className={className} />;
}

export function DashboardGlassPanel({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <GlassSurface interactive={interactive} className={className}>
      {children}
    </GlassSurface>
  );
}

export function AnimatedMetric(
  props: React.ComponentProps<typeof Metric>
) {
  return <Metric {...props} />;
}

export function DashboardPanelHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className={sectionTitleClass}>{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-[var(--type-caption-size)] leading-[var(--type-caption-leading)] text-[var(--shell-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardPageHeader(
  props: React.ComponentProps<typeof PageHeader>
) {
  return <PageHeader {...props} />;
}

export function AdminPageStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Stack gap="md" className={className}>{children}</Stack>;
}

export function AdminPageSkeleton() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48 rounded-[var(--ds-radius-sm)]" />
      <Skeleton className="h-[88px] rounded-[var(--ds-radius)]" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-[var(--ds-radius)]" />
          <Skeleton className="h-64 rounded-[var(--ds-radius)]" />
          <Skeleton className="h-72 rounded-[var(--ds-radius)]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-52 rounded-[var(--ds-radius)]" />
          <Skeleton className="h-56 rounded-[var(--ds-radius)]" />
          <Skeleton className="h-40 rounded-[var(--ds-radius)]" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-56 rounded-[var(--ds-radius)]"
          />
        ))}
      </div>
    </div>
  );
}

export { surfaceClass, surfaceStaticClass };
