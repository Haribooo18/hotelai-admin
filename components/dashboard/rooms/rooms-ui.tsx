import type { ComponentProps, ReactNode } from "react";

import { WorkspaceCard } from "@/components/dashboard/shared/WorkspaceCard";
import { WorkspaceDetailRow } from "@/components/dashboard/shared/WorkspaceDetailRow";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type { RoomSortKey } from "./room-ops-metrics";

export type RoomsToolbarFilters = {
  search: string;
  status: string;
  housekeeping: string;
  maintenance: string;
  floor: string;
  roomType: string;
  sort: RoomSortKey;
};

export function RoomWorkspaceCard({
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

export function RoomOpsListItem({
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

export function RoomDetailRow({ label, value }: { label: string; value: string }) {
  return <WorkspaceDetailRow label={label} value={value} />;
}
