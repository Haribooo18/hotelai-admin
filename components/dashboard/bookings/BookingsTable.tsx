"use client";

import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRowsSkeleton } from "@/components/dashboard/shared/TableRowsSkeleton";
import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { tableRowClickableClass, iconActionClass } from "@/lib/dashboard/design-system";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
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
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

export function BookingsTable({
  models,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
}: Props) {

  if (loading) {
    return <TableRowsSkeleton />;
  }

  if (models.length === 0) {
    return (
      <DashboardEmptyState
        title="No reservations found"
        description="Adjust filters or create a new reservation to populate this workspace."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-glass)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
      <div className="overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[880px]">
        <caption className="sr-only">Reservation list</caption>
        <thead>
          <tr className="border-b border-[var(--shell-border)]/50">
            {["Guest", "Room", "Stay", "Guests", "Status", "Payment", "Total", "Actions"].map(
              (header) => (
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
              )
            )}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const { booking, guest, roomLabel, guestCount, paymentStatus, source } =
              model;

            return (
              <tr
                key={booking.id}
                onClick={() => onSelect?.(model)}
                className={tableRowClickableClass}
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
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]">
                        {getGuestInitials(booking.guest_name)}
                      </div>
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
                  {guestCount}
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
                    <DropdownMenuContent
                      align="end"
                      className="min-w-40 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
                    >
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit?.(model);
                        }}
                        className="gap-2 rounded-[10px] px-3 py-2 text-[13px]"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
