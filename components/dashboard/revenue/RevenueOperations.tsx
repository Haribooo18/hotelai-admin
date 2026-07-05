"use client";

import { useRouter } from "next/navigation";
import {
  CreditCard,
  FileText,
  Lightbulb,
  MoreHorizontal,
  RefreshCcw,
  Wallet,
} from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import { BookingSourceBadge } from "@/components/dashboard/bookings/BookingSourceBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DashboardEmptyState,
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import {
  formatRevenueCurrency,
  formatRevenueDate,
  type RevenueInsight,
  type RevenueTransaction,
} from "./revenue-metrics";

type Props = {
  transactions: RevenueTransaction[];
  insights: RevenueInsight[];
};

export function RevenueOperations({ transactions, insights }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const recentPayments = transactions
    .filter(
      (item) =>
        item.status !== "cancelled" &&
        (item.paymentStatus === "paid" || item.status === "checked_out")
    )
    .slice(0, 5);

  const outstanding = transactions
    .filter(
      (item) =>
        item.paymentStatus === "pending" || item.paymentStatus === "deposit"
    )
    .slice(0, 5);

  const refunds = transactions
    .filter((item) => item.status === "cancelled")
    .slice(0, 5);

  const invoices = transactions
    .filter((item) => item.status === "confirmed" && item.date >= today)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <DashboardPanelHeader
        title="Operations"
        subtitle="Payments, balances, and ledger activity"
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <OpsWidget
          title="Recent payments"
          icon={<Wallet size={16} />}
          items={recentPayments}
          emptyTitle="No payments yet"
          emptyDescription="Settled bookings appear here."
        />
        <OpsWidget
          title="Outstanding balances"
          icon={<CreditCard size={16} />}
          items={outstanding}
          emptyTitle="No balances"
          emptyDescription="Pending or partial payments appear here."
        />
        <OpsWidget
          title="Refunds"
          icon={<RefreshCcw size={16} />}
          items={refunds}
          emptyTitle="No refunds"
          emptyDescription="Cancelled bookings are tracked here."
        />
        <OpsWidget
          title="Invoices"
          icon={<FileText size={16} />}
          items={invoices}
          emptyTitle="No invoices"
          emptyDescription="Upcoming check-ins appear as expected revenue."
        />
      </div>

      <DashboardGlassPanel className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
            <Lightbulb size={16} />
          </div>
          <DashboardPanelHeader
            title="Financial insights"
            subtitle="Automated observations from booking data"
            className="mb-0"
          />
        </div>

        {insights.length === 0 ? (
          <DashboardEmptyState
            title="Insights unavailable"
            description="Insights generate once enough booking data is available."
          />
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2.5 text-[13px] text-[var(--shell-text)] transition-[background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]"
              >
                {insight.text}
              </li>
            ))}
          </ul>
        )}
      </DashboardGlassPanel>

      <div className="space-y-3">
        <DashboardPanelHeader
          title="Transactions"
          subtitle="Premium ledger cards"
        />

        {transactions.length === 0 ? (
          <DashboardGlassPanel className="p-6">
            <DashboardEmptyState
              title="No transactions"
              description="Transactions appear after bookings in the selected period."
            />
          </DashboardGlassPanel>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {transactions.map((item) => (
              <TransactionCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OpsWidget({
  title,
  icon,
  items,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  icon: React.ReactNode;
  items: RevenueTransaction[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <DashboardGlassPanel className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-[var(--shell-text)]">
          {title}
        </p>
        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
          {icon}
        </div>
      </div>

      {items.length === 0 ? (
        <DashboardEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2 transition-[background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
                  {item.guestName}
                </p>
                <p className="text-[11px] text-[var(--shell-muted)]">
                  {formatRevenueDate(item.date)}
                </p>
              </div>
              <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
                {formatRevenueCurrency(item.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardGlassPanel>
  );
}

function TransactionCard({ item }: { item: RevenueTransaction }) {
  const router = useRouter();

  return (
    <article className="group rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 p-4 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl transition-[transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--shell-text)]">
            {item.guestName}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-[var(--shell-muted)]">
            {item.roomLabel}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${item.guestName}`}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] opacity-0 transition-[opacity,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:opacity-100 hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
            )}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/bookings")}>
              Open bookings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 grid gap-1.5 text-[12px]">
        <Row label="Stay" value={item.bookingLabel} />
        <Row label="Source" value={item.paymentMethod} />
        <Row label="Date" value={formatRevenueDate(item.date)} />
        <Row
          label="Amount"
          value={formatRevenueCurrency(item.amount)}
          strong
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <BookingStatusBadge status={item.status} />
        <PaymentStatusBadge status={item.paymentStatus} />
        <BookingSourceBadge source={item.source} />
      </div>
    </article>
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
    <div className="flex items-center justify-between gap-2">
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
