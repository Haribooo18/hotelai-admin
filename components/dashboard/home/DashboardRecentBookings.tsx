"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";
import { formatDashboardCurrency } from "./dashboard-metrics";

type Props = {
  bookings: Booking[];
  loading: boolean;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function DashboardRecentBookings({ bookings, loading }: Props) {
  return (
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Recent bookings"
        subtitle="Upcoming check-ins and stays"
        action={
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)] transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-80"
          >
            All
            <ArrowRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : bookings.length === 0 ? (
        <DashboardEmptyState
          title="No upcoming bookings"
          description="Confirmed reservations will show here as they are scheduled."
          icon={<CalendarDays size={18} />}
        />
      ) : (
        <div className="space-y-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-sm)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {booking.guest_name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                    {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                  </p>
                </div>
                <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
                  {formatDashboardCurrency(booking.total_price)}
                </p>
              </div>
              <div className="mt-2">
                <BookingStatusBadge status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSurface>
  );
}
