import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export function DashboardCardAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)]",
        motionPresets.transitionOpacity,
        "hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
      )}
    >
      {label}
      <ArrowRight size={13} aria-hidden />
    </Link>
  );
}

export function DashboardListItem({
  className,
  children,
  as: Component = "div",
  ...props
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article";
} & ComponentProps<"div">) {
  return (
    <Component
      className={cn(
        "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
        motionPresets.transitionBase,
        motionPresets.hover.surfaceLift,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export type TrendHint = {
  direction: "up" | "down" | "flat";
  label: string;
};

export function DashboardTrendHint({ trend }: { trend: TrendHint }) {
  if (trend.direction === "flat") {
    return (
      <span className="text-[11px] font-medium text-[var(--shell-muted)]">
        {trend.label}
      </span>
    );
  }

  const Icon = trend.direction === "up" ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium",
        trend.direction === "up" ? "text-emerald-400" : "text-amber-400"
      )}
    >
      <Icon size={12} aria-hidden />
      {trend.label}
    </span>
  );
}

export function matchesDashboardSearch(
  query: string,
  values: Array<string | null | undefined>
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) =>
    (value ?? "").toLowerCase().includes(normalized)
  );
}
