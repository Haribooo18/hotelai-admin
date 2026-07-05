import {
  CreditCard,
  FileText,
  RefreshCcw,
  Wallet,
} from "lucide-react";

import {
  DashboardEmptyState,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import {
  formatRevenueCurrency,
  formatRevenueDate,
  type RevenueTransaction,
} from "./revenue-metrics";

type Props = {
  transactions: RevenueTransaction[];
};

export function RevenueWidgets({ transactions }: Props) {
  const latestPayments = transactions
    .filter((item) => item.status !== "cancelled")
    .slice(0, 5);

  const upcoming = transactions
    .filter((item) => item.status === "confirmed" && item.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 5);

  const refunds = transactions.filter((item) => item.status === "cancelled").slice(0, 5);

  const outstanding = transactions
    .filter((item) => item.status === "confirmed")
    .slice(0, 5);

  return (
    <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
      <WidgetCard
        title="Recent payments"
        icon={<Wallet size={18} />}
        items={latestPayments}
        emptyTitle="No payments yet"
        emptyDescription="Payments appear after confirmed bookings."
      />

      <WidgetCard
        title="Upcoming invoices"
        icon={<FileText size={18} />}
        items={upcoming}
        emptyTitle="No invoices"
        emptyDescription="Future check-ins will appear as expected payments."
      />

      <WidgetCard
        title="Refunds"
        icon={<RefreshCcw size={18} />}
        items={refunds}
        emptyTitle="No refunds"
        emptyDescription="Cancelled bookings will be shown here."
      />

      <WidgetCard
        title="Outstanding balances"
        icon={<CreditCard size={18} />}
        items={outstanding}
        emptyTitle="No balances"
        emptyDescription="Bookings awaiting payment will appear in this widget."
      />
    </div>
  );
}

function WidgetCard({
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
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
          {title}
        </h3>
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--ds-radius-sm)] bg-emerald-500/10 text-emerald-500">
          {icon}
        </div>
      </div>

      {items.length === 0 ? (
        <DashboardEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-nav-hover-bg)]/60 p-3 transition-all duration-[var(--ds-duration-slow)] ease-out hover:bg-[var(--shell-nav-hover-bg)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {item.guestName}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
                    {formatRevenueDate(item.date)}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-semibold text-[var(--shell-text)]">
                  {formatRevenueCurrency(item.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSurface>
  );
}
