"use client";

import { CalendarDays } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { formatDateShort } from "@/lib/dashboard/format";

import type { Booking } from "@/types/booking";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";

import { formatDashboardCurrency } from "./dashboard-metrics";
import {
  DashboardCardAction,
  DashboardListItem,
  matchesDashboardSearch,
} from "./dashboard-ui";

type Props = {
  bookings: Booking[];
  loading: boolean;
  searchQuery?: string;
};

export function DashboardRecentBookings({
  bookings,
  loading,
  searchQuery = "",
}: Props) {
  const filteredBookings = bookings.filter((booking) =>
    matchesDashboardSearch(searchQuery, [booking.guest_name, booking.status])
  );

  return (
    <DataCard
      interactive
      title="Recent bookings"
      subtitle="Upcoming check-ins and stays"
      action={<DashboardCardAction href="/bookings" label="All" />}
    >
      {loading ? (
        <SkeletonGroup />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No upcoming bookings"
          description="Confirmed reservations will show here as they are scheduled."
          icon={<CalendarDays size={18} />}
        />
      ) : (
        <div className="space-y-2" role="list" aria-label="Recent bookings">
          {filteredBookings.map((booking) => (
            <DashboardListItem key={booking.id} as="article">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {booking.guest_name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                    {formatDateShort(booking.check_in)} —{" "}
                    {formatDateShort(booking.check_out)}
                  </p>
                </div>
                <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
                  {formatDashboardCurrency(booking.total_price)}
                </p>
              </div>
              <div className="mt-2">
                <BookingStatusBadge status={booking.status} />
              </div>
            </DashboardListItem>
          ))}
        </div>
      )}
    </DataCard>
  );
}
