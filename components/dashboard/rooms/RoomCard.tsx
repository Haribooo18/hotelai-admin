"use client";

import type { ReactNode } from "react";
import {
  Archive,
  BedDouble,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  type RoomCardModel,
  type RoomViewMode,
} from "./room-ops-metrics";

type Props = {
  model: RoomCardModel;
  viewMode: RoomViewMode;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

function MetaLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
      <span className="text-emerald-500/80">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

export function RoomCard({
  model,
  viewMode,
  selected,
  onSelect,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const { room, roomCode, currentGuest, housekeepingLabel, cleaningProgress } =
    model;

  return (
    <article
      className={cn(
        "rounded-[20px] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
        "hover:-translate-y-1 hover:shadow-[var(--shell-shadow-md)]",
        selected && "ring-2 ring-emerald-500/40",
        viewMode === "list" && "md:flex md:items-center md:justify-between md:gap-6"
      )}
    >
      <div className={cn(viewMode === "list" && "min-w-0 flex-1")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <label className="mt-2 flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select room ${room.room_type}`}
                className="h-4 w-4 rounded border-[var(--shell-border)] text-emerald-600 focus:ring-emerald-500/30"
              />
            </label>

            <button
              type="button"
              onClick={onOpen}
              className="min-w-0 text-left"
            >
              <p className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-[var(--shell-text)]">
                {roomCode}
              </p>
              <p className="mt-2 truncate text-[15px] font-medium text-[var(--shell-text)]">
                {room.room_type}
              </p>
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for room ${room.room_type}`}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[var(--shell-muted)] transition-all duration-[180ms] ease-out",
                "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              )}
            >
              <MoreHorizontal size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-44 rounded-[12px] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
            >
              <DropdownMenuItem
                onClick={onOpen}
                className="rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
              >
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onEdit}
                className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
              >
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDuplicate}
                className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
              >
                <Copy size={14} />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-muted)]"
              >
                <Archive size={14} />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
              >
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className={cn(
            "mt-5 gap-3",
            viewMode === "grid"
              ? "space-y-3"
              : "grid md:grid-cols-2 xl:grid-cols-4"
          )}
        >
          <MetaLine icon={<BedDouble size={14} />}>
            {formatRoomCurrency(room.price)} / night
          </MetaLine>
          <MetaLine icon={<Users size={14} />}>
            Up to {room.capacity} guests
          </MetaLine>
          <MetaLine icon={<Users size={14} />}>
            {currentGuest ?? "No current guest"}
          </MetaLine>
          <MetaLine icon={<BedDouble size={14} />}>
            {housekeepingLabel}
          </MetaLine>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RoomStatusBadge status={model.status} />
            <span className="text-[12px] text-[var(--shell-muted)]">
              Room occupancy
            </span>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-[12px] text-[var(--shell-muted)]">
              <span>Cleaning progress</span>
              <span>{cleaningProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--shell-nav-hover-bg)]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-[180ms] ease-out"
                style={{ width: `${cleaningProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
