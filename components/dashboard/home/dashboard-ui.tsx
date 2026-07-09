import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import { motionPresets } from "@/lib/design/motion";
import { cardListItemClass } from "@/lib/dashboard/design-system";
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
        "inline-flex items-center gap-1 ds-caption font-medium text-[var(--shell-accent)]",
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
        cardListItemClass,
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

export function DashboardTrendHint({
  trend,
  comparisonLabel,
}: {
  trend: TrendHint;
  comparisonLabel?: string;
}) {
  const content =
    trend.direction === "flat" ? (
      <span className="ds-caption font-medium text-[var(--shell-muted)]">
        {trend.label}
      </span>
    ) : (
      <span
        className={cn(
          "inline-flex items-center gap-1 ds-caption font-medium",
          trend.direction === "up" ? "text-emerald-400" : "text-amber-400"
        )}
      >
        {trend.direction === "up" ? (
          <TrendingUp size={12} aria-hidden />
        ) : (
          <TrendingDown size={12} aria-hidden />
        )}
        {trend.label}
      </span>
    );

  if (!comparisonLabel) return content;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {content}
      <span className="ds-caption text-[var(--shell-muted)]">
        {comparisonLabel}
      </span>
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
