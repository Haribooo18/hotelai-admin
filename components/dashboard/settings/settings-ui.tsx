import type { ComponentProps, ReactNode } from "react";

import { WorkspaceDetailRow } from "@/components/dashboard/shared/WorkspaceDetailRow";
import {
  cardContentGapClass,
  cardPaddingClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";

import type { SettingsSection } from "./settings-ops-metrics";

export type SettingsNavSection = SettingsSection | "advanced";

/** Vertical rhythm between settings sections — 24px */
export const settingsSectionStackClass = "space-y-6";

export function SettingsSectionPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Panel variant="glass" className={cardPaddingClass}>
      <Section title={title} subtitle={subtitle} />
      <div className={cardContentGapClass}>{children}</div>
    </Panel>
  );
}

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
        "ds-body flex w-full min-h-11 items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-3 py-2.5 text-left font-medium",
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
  return <WorkspaceDetailRow label={label} value={value} />;
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
