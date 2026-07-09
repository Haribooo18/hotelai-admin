"use client";

import { LineChart, Wallet } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import {
  computeForecastConfidence,
  RevenueOpsListItem,
} from "./revenue-ui";
import {
  formatRevenueCurrency,
  formatRevenueDate,
  type RevenueBreakdownPoint,
  type RevenueTransaction,
  type RevenueTrendPoint,
} from "./revenue-metrics";

type Props = {
  byRoomType: RevenueBreakdownPoint[];
  bySource: RevenueBreakdownPoint[];
  transactions: RevenueTransaction[];
  trend: RevenueTrendPoint[];
  loading?: boolean;
};

function BreakdownList({
  items,
  emptyTitle,
  emptyDescription,
}: {
  items: RevenueBreakdownPoint[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return (
      <WorkspaceEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<LineChart size={16} />}
      />
    );
  }

  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-2" role="list">
      {items.slice(0, 5).map((item) => {
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

        return (
          <div key={item.label} role="listitem">
            <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate text-[var(--shell-text)]">{item.label}</span>
              <span className="shrink-0 font-medium text-[var(--shell-text)]">
                {formatRevenueCurrency(item.value)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shell-surface-raised)]">
              <div
                className="h-full rounded-full bg-[var(--shell-accent)] transition-[width] duration-[var(--ds-duration)] ease-[var(--ds-ease)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentList({
  items,
  emptyTitle,
  emptyDescription,
}: {
  items: RevenueTransaction[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return (
      <WorkspaceEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Wallet size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {items.map((item) => (
        <RevenueOpsListItem
          key={item.id}
          role="listitem"
          aria-label={item.guestName}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                {item.guestName}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                {formatRevenueDate(item.date)}
              </p>
            </div>
            <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
              {formatRevenueCurrency(item.amount)}
            </p>
          </div>
        </RevenueOpsListItem>
      ))}
    </div>
  );
}

export function RevenueOperations({
  byRoomType,
  bySource,
  transactions,
  trend,
  loading = false,
}: Props) {
  const { t } = useI18n();
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

  const confidence = computeForecastConfidence(trend);

  if (loading) {
    return (
      <Section
        title={t("revenue.analyticsTitle")}
        subtitle={t("revenue.analyticsSubtitle")}
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} title={t("revenue.loading")}>
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t("revenue.analyticsTitle")}
      subtitle={t("revenue.analyticsSubtitle")}
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title={t("revenue.topRoomTypes")}
          subtitle={t("revenue.topRoomTypesSubtitle")}
        >
          <BreakdownList
            items={byRoomType}
            emptyTitle={t("revenue.noRoomTypeRevenue")}
            emptyDescription={t("revenue.noRoomTypeRevenueDesc")}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("revenue.topSources")}
          subtitle={t("revenue.topSourcesSubtitle")}
        >
          <BreakdownList
            items={bySource}
            emptyTitle={t("revenue.noSourceRevenue")}
            emptyDescription={t("revenue.noSourceRevenueDesc")}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("revenue.distributionTitle")}
          subtitle={t("revenue.distributionSubtitle")}
        >
          <BreakdownList
            items={bySource}
            emptyTitle={t("revenue.noDistribution")}
            emptyDescription={t("revenue.noDistributionDesc")}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("revenue.recentPayments")}
          subtitle={t("revenue.recentPaymentsSubtitle")}
        >
          <PaymentList
            items={recentPayments}
            emptyTitle={t("revenue.noPayments")}
            emptyDescription={t("revenue.noPaymentsDesc")}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("revenue.outstandingTitle")}
          subtitle={t("revenue.outstandingSubtitle")}
        >
          <PaymentList
            items={outstanding}
            emptyTitle={t("revenue.noBalances")}
            emptyDescription={t("revenue.noBalancesDesc")}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("revenue.forecastTitle")}
          subtitle={t("revenue.forecastSubtitle")}
        >
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={confidence} formatter={formatPercent} />
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">
                {t("revenue.modelConfidence")}
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--shell-surface-raised)]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-[var(--ds-duration)] ease-[var(--ds-ease)]"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <p className="text-[12px] text-[var(--shell-muted)]">
              {t("revenue.forecastVolatilityHint")}
            </p>
          </div>
        </DataCard>
      </div>
    </Section>
  );
}
