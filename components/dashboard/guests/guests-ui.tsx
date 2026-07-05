import type { ComponentProps, ReactNode } from "react";

import type { Guest } from "@/types/guest";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type { GuestSortKey, GuestStatusFilter } from "./guest-crm-metrics";

export type GuestsToolbarFilters = {
  search: string;
  tag: string;
  vip: string;
  country: string;
  language: string;
  status: GuestStatusFilter;
  sort: GuestSortKey;
};

const LANGUAGE_HINT =
  /^(english|russian|german|french|spanish|italian|chinese|japanese|en|ru|de|fr|es|it|zh|ja)$/i;

export function extractLanguageOptions(guests: Guest[]): string[] {
  const set = new Set<string>();

  for (const guest of guests) {
    for (const tag of guest.tags ?? []) {
      if (tag.startsWith("lang:")) {
        set.add(tag.slice(5));
        continue;
      }

      if (LANGUAGE_HINT.test(tag)) {
        set.add(tag);
      }
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
}

export function getGuestLanguageLabel(guest: Guest): string | null {
  for (const tag of guest.tags ?? []) {
    if (tag.startsWith("lang:")) return tag.slice(5);
    if (LANGUAGE_HINT.test(tag)) return tag;
  }

  return null;
}

export function matchesGuestLanguageFilter(
  guest: Guest,
  language: string
): boolean {
  if (language === "") return true;

  return (guest.tags ?? []).some(
    (tag) =>
      tag === language ||
      tag === `lang:${language}` ||
      tag.toLowerCase() === language.toLowerCase()
  );
}

export function GuestWorkspaceCard({
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

export function GuestOpsListItem({
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

export function GuestDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <dt className="text-[var(--shell-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--shell-text)]">{value}</dd>
    </div>
  );
}
