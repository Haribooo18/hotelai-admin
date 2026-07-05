"use client";

import { memo } from "react";
import {
  CalendarDays,
  Moon,
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
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { cn } from "@/lib/utils";
import { hoverRevealClass, iconActionClass } from "@/lib/dashboard/design-system";

import { BookingSourceBadge } from "./BookingSourceBadge";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  formatBookingCurrency,
  formatBookingDate,
  getGuestInitials,
  type BookingCardModel,
} from "./booking-ops-metrics";

type Props = {
  model: BookingCardModel;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

export const BookingCard = memo(function BookingCard({
  model,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const { booking, guest, roomLabel, nights, guestCount, paymentStatus, source } =
    model;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open reservation for ${booking.guest_name}`}
      onClick={() => onSelect?.(model)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(model);
        }
      }}
      className={cn(
        "group cursor-pointer rounded-[var(--ds-radius)] bg-[var(--shell-glass)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
        "transition-[transform,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-md)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {guest ? (
            <GuestAvatar
              firstName={guest.first_name}
              lastName={guest.last_name}
              avatarUrl={guest.avatar_url}
              size="sm"
            />
          ) : (
            <div
              role="img"
              aria-label={booking.guest_name}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[12px] font-semibold text-[var(--shell-accent)]"
            >
              {getGuestInitials(booking.guest_name)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--shell-text)]">
              {booking.guest_name}
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-[var(--shell-muted)]">
              {roomLabel}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for reservation ${booking.guest_name}`}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              iconActionClass,
              hoverRevealClass,
              "shrink-0"
            )}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
          >
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(model);
              }}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(model);
              }}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <CalendarDays size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span className="truncate">
            {formatBookingDate(booking.check_in)} — {formatBookingDate(booking.check_out)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Moon size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span>
            {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Users size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span>
            {guestCount} {guestCount === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div className="text-right text-[13px] font-semibold text-[var(--shell-text)]">
          {formatBookingCurrency(booking.total_price)}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <BookingStatusBadge status={booking.status} />
        <PaymentStatusBadge status={paymentStatus} />
        <BookingSourceBadge source={source} />
      </div>
    </article>
  );
});

export { buildRoomLabel } from "./booking-ops-metrics";
