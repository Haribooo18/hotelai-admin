import type { ComponentProps, ReactNode } from "react";

import type { KnowledgeSortKey } from "./knowledge-ops-metrics";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type KnowledgeQualityFilter = "" | "high" | "medium" | "low";

export type KnowledgeToolbarFilters = {
  search: string;
  category: string;
  status: string;
  aiReady: string;
  quality: KnowledgeQualityFilter;
  sort: KnowledgeSortKey;
};

export function matchesKnowledgeQualityFilter(
  qualityScore: number,
  quality: KnowledgeQualityFilter
): boolean {
  switch (quality) {
    case "high":
      return qualityScore >= 80;
    case "medium":
      return qualityScore >= 60 && qualityScore < 80;
    case "low":
      return qualityScore < 60;
    default:
      return true;
  }
}

export function KnowledgeWorkspaceCard({
  selected = false,
  className,
  children,
  ...props
}: ComponentProps<"article"> & {
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "group rounded-[var(--ds-radius)] bg-[var(--shell-glass)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
        motionPresets.transitionBase,
        motionPresets.hover.surfaceLift,
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
        selected &&
          "ring-1 ring-[var(--shell-accent)]/30 shadow-[var(--shell-shadow-md)]",
        className
      )}
      {...props}
    >
      {children}
    </article>
  );
}

export function KnowledgeOpsListItem({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)]/40 bg-[var(--shell-surface-raised)]/50 px-3 py-2.5 text-left",
        motionPresets.transitionBase,
        "hover:border-[var(--shell-border)] hover:bg-[var(--shell-surface-raised)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function KnowledgeDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <dt className="text-[var(--shell-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--shell-text)]">{value}</dd>
    </div>
  );
}
