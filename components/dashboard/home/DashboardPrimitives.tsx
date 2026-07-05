import type { ReactNode } from "react";

import {
  labelClass,
  pageStackClass,
  sectionTitleClass,
  shellEmptyStateClass,
  surfaceClass,
  surfaceStaticClass,
} from "@/lib/dashboard/design-system";
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
  return (
    <div
      className={cn(
        interactive ? surfaceClass : surfaceStaticClass,
        glass && "bg-[var(--shell-glass)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
};

export function DashboardKpiCard({
  label,
  value,
  hint,
  icon,
}: KpiCardProps) {
  return (
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <div className="flex items-start justify-between gap-3">
        <p className={cn(labelClass, "normal-case tracking-[0.01em]")}>
          {label}
        </p>
        {icon ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
            {icon}
          </div>
        ) : null}
      </div>
      <p
        className="mt-3 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]"
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[var(--type-caption-size)] leading-[var(--type-caption-leading)] text-[var(--shell-muted)]">
          {hint}
        </p>
      ) : null}
    </DashboardSurface>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function DashboardEmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className={shellEmptyStateClass}>
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        {icon ? (
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)]">
            {icon}
          </div>
        ) : null}
        <p className="text-[14px] font-medium tracking-[-0.01em] text-[var(--shell-text)]">
          {title}
        </p>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--shell-muted)]">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="ds-skeleton h-3.5 w-1/3" />
      <div className="ds-skeleton h-7 w-1/2" />
      <div className="ds-skeleton h-20 w-full" />
    </div>
  );
}

export function DashboardSkeletonLine({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("ds-skeleton h-3.5", className)} />;
}

export function DashboardSkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("ds-skeleton", className)} />;
}

export function DashboardSectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className={sectionTitleClass}>{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-[var(--type-caption-size)] leading-[var(--type-caption-leading)] text-[var(--shell-muted)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function DashboardPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="ds-display">{title}</h1>
        {subtitle ? (
          <p className="mt-1.5 text-[var(--type-body-size)] leading-[var(--type-body-leading)] tracking-[var(--type-body-tracking)] text-[var(--shell-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/** Consistent vertical page layout */
export function AdminPageStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(pageStackClass, className)}>{children}</div>;
}

/** Route-level loading skeleton */
export function AdminPageSkeleton() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading">
      <div className="ds-skeleton h-8 w-44 rounded-[var(--ds-radius-sm)]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="ds-skeleton h-24 rounded-[var(--ds-radius)]"
          />
        ))}
      </div>
      <div className="ds-skeleton h-14 rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-72 rounded-[var(--ds-radius)]" />
    </div>
  );
}
