import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ShellSurfaceProps = {
  children: ReactNode;
  className?: string;
  glass?: boolean;
};

export function DashboardSurface({
  children,
  className,
  glass = false,
}: ShellSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
        glass && "bg-[var(--shell-surface)]/80 backdrop-blur-xl",
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
    <DashboardSurface className="p-5 hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-[var(--shell-muted)]">
          {label}
        </p>
        {icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-500">
            {icon}
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[12px] text-[var(--shell-muted)]">{hint}</p>
      ) : null}
    </DashboardSurface>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function DashboardEmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shell-nav-hover-bg)] text-[var(--shell-muted)]">
          {icon}
        </div>
      ) : null}
      <p className="text-[15px] font-medium text-[var(--shell-text)]">
        {title}
      </p>
      <p className="mt-2 max-w-sm text-[13px] text-[var(--shell-muted)]">
        {description}
      </p>
    </div>
  );
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      <div className="h-4 w-1/3 rounded-full bg-[var(--shell-nav-hover-bg)]" />
      <div className="h-8 w-1/2 rounded-[12px] bg-[var(--shell-nav-hover-bg)]" />
      <div className="h-24 rounded-[16px] bg-[var(--shell-nav-hover-bg)]" />
    </div>
  );
}

export function DashboardSectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-[13px] text-[var(--shell-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}
