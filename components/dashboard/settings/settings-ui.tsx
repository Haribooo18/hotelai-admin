import type { ComponentProps, ReactNode } from "react";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type { SettingsSection } from "./settings-ops-metrics";

export type SettingsNavSection = SettingsSection | "advanced";

export function SettingsNavButton({
  selected = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full min-h-11 items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-3 py-2.5 text-left text-[13px] font-medium",
        motionPresets.transitionBase,
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
        selected
          ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] ring-1 ring-[var(--shell-accent)]/20"
          : "text-[var(--shell-muted)] hover:bg-[var(--shell-surface-raised)] hover:text-[var(--shell-text)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SettingsDetailRow({
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

export function SettingsOpsListItem({
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
