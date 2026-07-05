import type { ComponentProps, ReactNode } from "react";

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <dt className="text-[var(--shell-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--shell-text)]">{value}</dd>
    </div>
  );
}

export function RoomDetailRow({ label, value }: { label: string; value: string }) {
  return <DetailRow label={label} value={value} />;
}
