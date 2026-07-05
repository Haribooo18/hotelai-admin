"use client";

import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { SkeletonRows } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { TableContainer } from "@/components/ui/data/TableContainer";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
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

type Props = {
  models: BookingCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

const HEADERS = [
  "Guest",
  "Room",
  "Stay",
  "Guests",
  "Status",
  "Payment",
  "Total",
  "Actions",
] as const;

export function BookingsTable({
  models,
  loading = false,
  selectedId = null,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <TableContainer>
        <SkeletonRows rows={8} />
      </TableContainer>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        description="Adjust filters or create a new reservation to populate this workspace."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <TableContainer scrollable className="shadow-[var(--shell-shadow-sm)]">
      <table className="w-full min-w-[920px] border-collapse">
        <caption className="sr-only">Reservation list</caption>
        <thead className="sticky top-0 z-10 bg-[var(--shell-surface)]">
          <tr className="border-b border-[var(--shell-border)]/50">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] last:text-right"
              >
                {header === "Actions" ? (
                  <span className="sr-only">{header}</span>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const { booking, guest, roomLabel, guestCount, paymentStatus, source } =
              model;
            const selected = selectedId === booking.id;

            return (
              <tr
                key={booking.id}
                onClick={() => onSelect?.(model)}
                aria-selected={selected}
                className={cn(
                  "cursor-pointer border-b border-[var(--shell-border)]/30 last:border-b-0",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-surface-raised)]/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)]",
                  selected &&
                    "bg-[var(--shell-nav-active-bg)]/40 shadow-[inset_2px_0_0_0_var(--shell-accent)]"
                )}
                {...tableRowA11yProps(
                  `Open reservation for ${booking.guest_name}`,
                  () => onSelect?.(model)
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {guest ? (
                      <GuestAvatar
                        firstName={guest.first_name}
                        lastName={guest.last_name}
                        avatarUrl={guest.avatar_url}
                        size="sm"
                      />
                    ) : (
                      <Avatar className="size-9">
                        <AvatarFallback className="text-[11px] font-semibold">
                          {getGuestInitials(booking.guest_name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                        {booking.guest_name}
                      </p>
                      <BookingSourceBadge source={source} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--shell-muted)]">
                  {roomLabel}
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {formatBookingDate(booking.check_in)} —{" "}
                  {formatBookingDate(booking.check_out)}
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--shell-text)]">
                  {booking.adults}+{booking.children}
                  <span className="sr-only"> guests, total {guestCount}</span>
                </td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={paymentStatus} />
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[var(--shell-text)]">
                  {formatBookingCurrency(booking.total_price)}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for reservation ${booking.guest_name}`}
                      onClick={(event) => event.stopPropagation()}
                      className={cn(iconActionClass, "max-md:opacity-100")}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableContainer>
  );
}
