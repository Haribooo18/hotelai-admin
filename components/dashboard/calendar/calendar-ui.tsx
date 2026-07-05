import type { ComponentProps, ReactNode } from "react";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export function CalendarAgendaCard({
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
        "flex w-full flex-col items-stretch gap-3 rounded-[var(--ds-radius)] bg-[var(--shell-glass)] p-[var(--ds-surface-padding)] text-left shadow-[var(--shell-shadow-sm)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between",
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
    </button>
  );
}

export function CalendarOpsListItem({
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

export function CalendarDetailRow({
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
