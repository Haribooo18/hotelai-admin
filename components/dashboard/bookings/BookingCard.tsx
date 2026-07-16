"use client";

import { memo } from "react";
import {
  Baby,
  CalendarDays,
  Moon,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { activateOnKeyboard } from "@/lib/dashboard/a11y";
import { hoverRevealClass, iconActionClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { BookingSourceBadge } from "./BookingSourceBadge";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  formatBookingCurrency,
  formatBookingDate,
  getGuestInitials,
  type BookingCardModel,
} from "./booking-ops-metrics";
import { BookingWorkspaceCard } from "./bookings-ui";

type Props = {
  model: BookingCardModel;
  selected?: boolean;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

export const BookingCard = memo(function BookingCard({
  model,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const { booking, guest, roomLabel, nights, paymentStatus, source } = model;

  return (
    <BookingWorkspaceCard
      selected={selected}
      role="button"
      tabIndex={0}
      aria-label={`Open reservation for ${booking.guest_name}`}
      aria-pressed={selected}
      onClick={() => onSelect?.(model)}
      onKeyDown={(event) =>
        activateOnKeyboard(event, () => onSelect?.(model))
      }
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
            <Avatar className="size-9" aria-label={booking.guest_name}>
              <AvatarFallback className="text-[12px] font-semibold">
                {getGuestInitials(booking.guest_name)}
              </AvatarFallback>
            </Avatar>
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
            className={cn(iconActionClass, hoverRevealClass, "shrink-0")}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(model);
              }}
              className="gap-2"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(model);
              }}
              className="gap-2 text-red-400"
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
            {formatBookingDate(booking.check_in)} —{" "}
            {formatBookingDate(booking.check_out)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Moon size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span>
            {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <UserRound size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span>
            {booking.adults} {booking.adults === 1 ? "adult" : "adults"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Baby size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span>
            {booking.children}{" "}
            {booking.children === 1 ? "child" : "children"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={paymentStatus} />
          <BookingSourceBadge source={source} />
        </div>
        <p className="shrink-0 text-[14px] font-semibold text-[var(--shell-text)]">
          {formatBookingCurrency(booking.total_price)}
        </p>
      </div>
    </BookingWorkspaceCard>
  );
});

export { buildRoomLabel } from "./booking-ops-metrics";
