"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DashboardEmptyState,
  DashboardSectionTitle,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import {
  formatRevenueCurrency,
  formatRevenueDate,
  type RevenueTransaction,
} from "./revenue-metrics";

type Props = {
  transactions: RevenueTransaction[];
};

export function RevenueTransactions({ transactions }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <DashboardSectionTitle
        title="Transactions"
        subtitle="Booking-based operations"
      />

      {transactions.length === 0 ? (
        <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]">
          <DashboardEmptyState
            title="No transactions"
            description="Transactions appear after bookings are created in the selected period."
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {transactions.map((item) => (
            <article
              key={item.id}
              className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)] transition-all duration-[var(--ds-duration-slow)] ease-out hover:-translate-y-1 hover:shadow-[var(--shell-shadow-md)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-[var(--shell-text)]">
                    {item.guestName}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                    {item.roomLabel}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Actions for transaction ${item.guestName}`}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-all duration-[var(--ds-duration-slow)] ease-out",
                      "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
                    )}
                  >
                    <MoreHorizontal size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-40 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
                  >
                    <DropdownMenuItem
                      className="rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
                      onClick={() => router.push("/bookings")}
                    >
                      Open bookings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-5 grid gap-3 text-[13px]">
                <Row label="Booking" value={item.bookingLabel} />
                <Row label="Payment method" value={item.paymentMethod} />
                <Row label="Date" value={formatRevenueDate(item.date)} />
                <Row
                  label="Amount"
                  value={formatRevenueCurrency(item.amount)}
                  strong
                />
              </div>

              <div className="mt-4">
                <BookingStatusBadge status={item.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--shell-muted)]">{label}</span>
      <span
        className={cn(
          "truncate text-right",
          strong
            ? "font-semibold text-[var(--shell-text)]"
            : "text-[var(--shell-text)]"
        )}
      >
        {value}
      </span>
    </div>
  );
}
