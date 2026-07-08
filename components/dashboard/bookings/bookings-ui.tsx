import type { ComponentProps, ReactNode } from "react";

import { WorkspaceCard } from "@/components/dashboard/shared/WorkspaceCard";
import { Divider } from "@/components/ui/primitives/Divider";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type BookingsSortOption =
  | "check_in"
  | "guest"
  | "total"
  | "status";

export type BookingsToolbarFilters = {
  search: string;
  chipFilter: BookingsChipFilter;
  dateFilter: string;
  status: string;
  payment: string;
  source: string;
  roomId: string;
  sort: BookingsSortOption;
};

export type BookingsChipFilter =
  | "all"
  | "new"
  | "confirmed"
  | "check_in_today"
  | "check_out_today";

export function BookingWorkspaceCard({
  selected = false,
  className,
  children,
  ...props
}: ComponentProps<typeof WorkspaceCard> & {
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <WorkspaceCard selected={selected} className={className} {...props}>
      {children}
    </WorkspaceCard>
  );
}

export function BookingOpsListItem({
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

export function BookingTimelineSeparator({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 py-1"
      role="separator"
      aria-label={label}
    >
      <Divider className="flex-1 bg-[var(--shell-border)]/60" />
      <span className="ds-overline">{label}</span>
      <Divider className="flex-1 bg-[var(--shell-border)]/60" />
    </div>
  );
}
