"use client";

import {
  CalendarDays,
  Eye,
  MoreHorizontal,
  Pencil,
  Users,
  Wrench,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  type RoomCardModel,
} from "./room-ops-metrics";

type Props = {
  model: RoomCardModel;
  onOpen: () => void;
  onEdit: () => void;
};

export function RoomCard({ model, onOpen, onEdit }: Props) {
  const {
    room,
    roomCode,
    currentGuest,
    activeBooking,
    upcomingBooking,
    housekeepingStatus,
    revenueToday,
    status,
  } = model;

  const stayBooking = activeBooking ?? upcomingBooking;
  const occupancyLabel =
    status === "occupied"
      ? "In-house"
      : status === "reserved"
        ? "Arriving"
        : status === "cleaning"
          ? "Turnover"
          : "Vacant";

  return (
    <article
      className={cn(
        "group rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/85 p-4 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
        "transition-[transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="min-w-0 text-left">
          <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--shell-text)]">
            {roomCode}
          </p>
          <p className="mt-1 truncate text-[13px] font-medium text-[var(--shell-text)]">
            {room.room_type}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
            {model.floorLabel} · {occupancyLabel}
          </p>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for room ${room.room_type}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] opacity-0 transition-[opacity,background-color] duration-[var(--ds-duration)] group-hover:opacity-100 hover:bg-[var(--shell-nav-hover-bg)]"
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen} className="gap-2">
              <Eye size={14} />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[10px] font-semibold text-[var(--shell-accent)]">
          {getGuestInitials(currentGuest)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
            {currentGuest ?? "No guest assigned"}
          </p>
          {stayBooking ? (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--shell-muted)]">
              <CalendarDays size={11} />
              {formatRoomDate(stayBooking.check_in)} →{" "}
              {formatRoomDate(stayBooking.check_out)}
            </p>
          ) : (
            <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
              No active stay
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <RoomStatusBadge status={status} />
        <HousekeepingBadge status={housekeepingStatus} />
        {status === "maintenance" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-400">
            <Wrench size={10} />
            Maintenance
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
          <p className="text-[var(--shell-muted)]">Revenue today</p>
          <p className="mt-0.5 font-semibold text-[var(--shell-text)]">
            {formatRoomCurrency(revenueToday)}
          </p>
        </div>
        <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
          <p className="text-[var(--shell-muted)]">Capacity</p>
          <p className="mt-0.5 flex items-center gap-1 font-semibold text-[var(--shell-text)]">
            <Users size={11} />
            {room.capacity}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="h-8 flex-1 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] text-[11px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color] hover:bg-[var(--shell-nav-hover-bg)]"
        >
          Details
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="h-8 flex-1 rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[11px] font-medium text-[var(--shell-accent)] transition-[background-color] hover:bg-[var(--shell-nav-active-bg)]"
        >
          Edit
        </button>
      </div>
    </article>
  );
}
