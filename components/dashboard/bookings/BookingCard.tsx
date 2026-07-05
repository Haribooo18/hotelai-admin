"use client";

import {
  CalendarDays,
  Moon,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { BookingStatusBadge } from "./BookingStatusBadge";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function countNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();

  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  booking: Booking;
  roomLabel: string;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
};

export function BookingCard({
  booking,
  roomLabel,
  onEdit,
  onDelete,
}: Props) {
  const guestCount = booking.adults + booking.children;
  const nights = countNights(booking.check_in, booking.check_out);

  return (
    <article
      className={cn(
        "group rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)]",
        "transition-all duration-[var(--ds-duration-slow)] ease-out hover:-translate-y-1 hover:shadow-[var(--shell-shadow-md)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            aria-hidden
            className="flex h-[var(--ds-input-height)] w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[13px] font-semibold text-emerald-500"
          >
            {getInitials(booking.guest_name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-[var(--shell-text)]">
              {booking.guest_name}
            </h3>
            <p className="mt-0.5 truncate text-[13px] text-[var(--shell-muted)]">
              {roomLabel}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for reservation ${booking.guest_name}`}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-all duration-[var(--ds-duration-slow)] ease-out",
              "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            )}
          >
            <MoreHorizontal size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
          >
            <DropdownMenuItem
              onClick={() => onEdit?.(booking)}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete?.(booking)}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
          <CalendarDays size={15} className="shrink-0 text-emerald-500/80" />
          <span>
            {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
          <Moon size={15} className="shrink-0 text-emerald-500/80" />
          <span>
            {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
          <Users size={15} className="shrink-0 text-emerald-500/80" />
          <span>
            {guestCount}{" "}
            {guestCount === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div className="text-[13px] font-medium text-[var(--shell-text)]">
          {formatPrice(booking.total_price)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-[var(--shell-nav-hover-bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--shell-muted)]">
          Direct
        </span>
        <BookingStatusBadge status={booking.status} />
      </div>
    </article>
  );
}

export function buildRoomLabel(
  roomId: string,
  rooms: Room[]
): string {
  const room = rooms.find((item) => item.id === roomId);

  if (!room) {
    return "Room not assigned";
  }

  return room.room_type;
}
