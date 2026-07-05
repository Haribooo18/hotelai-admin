import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import type { Booking } from "@/types/booking";
import { formatDashboardCurrency } from "./dashboard-metrics";
import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import {
  DashboardEmptyState,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";

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

export function DashboardLatestReservations({ bookings, loading }: Props) {
  return (
    <DashboardSurface className="p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
            Latest reservations
          </h2>
          <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
            Recently created entries
          </p>
        </div>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-500 transition-opacity duration-[180ms] ease-out hover:opacity-80"
        >
          All
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : bookings.length === 0 ? (
        <DashboardEmptyState
          title="No reservations yet"
          description="Create your first reservation to see it in this widget."
          icon={<CalendarDays size={20} />}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[16px] bg-[var(--shell-nav-hover-bg)]/50 p-4 transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-hover-bg)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[var(--shell-text)]">
                    {booking.guest_name}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
                    {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-semibold text-[var(--shell-text)]">
                  {formatDashboardCurrency(booking.total_price)}
                </p>
              </div>
              <div className="mt-3">
                <BookingStatusBadge status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSurface>
  );
}
