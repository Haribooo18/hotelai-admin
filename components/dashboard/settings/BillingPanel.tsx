"use client";

import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import {
  BILLING_PLAN_IDS,
  BILLING_PLANS,
  formatPlanLabel,
  formatSubscriptionStatusLabel,
} from "@/lib/billing/plans";
import type { BillingPlan } from "@/types/subscription";
import type { HotelSubscription } from "@/types/subscription";
import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/display/Badge";
import { DataCard } from "@/components/ui/data/DataCard";

type Props = {
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
};

function formatRenewalDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BillingPanel({
  subscription,
  stripeConfigured,
}: Props) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [checkoutPlan, setCheckoutPlan] = useState<BillingPlan | null>(null);

  const hasActiveSubscription =
    subscription &&
    ["active", "trialing", "past_due"].includes(subscription.status);

  async function startCheckout(plan: BillingPlan) {
    setCheckoutPlan(plan);
    startTransition(async () => {
      try {
        const response = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? t("billing.checkoutError"));
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t("billing.checkoutError")
        );
        setCheckoutPlan(null);
      }
    });
  }

  async function openPortal() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/billing/portal", {
          method: "POST",
        });

        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? t("billing.portalError"));
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t("billing.portalError")
        );
      }
    });
  }

  if (!stripeConfigured) {
    return (
      <div
        className="rounded-[var(--ds-radius-sm)] border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-200"
        role="alert"
      >
        {t("billing.stripeNotConfigured")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard
          interactive
          title={t("billing.subscription")}
          subtitle={t("billing.subscriptionSubtitle")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--shell-muted)]">
                {t("billing.currentPlan")}
              </p>
              <p className="mt-1 text-xl font-semibold text-[var(--shell-text)]">
                {subscription
                  ? formatPlanLabel(subscription.plan)
                  : t("billing.notSelected")}
              </p>
            </div>
            <Badge variant="outline">
              {formatSubscriptionStatusLabel(subscription?.status ?? "none")}
            </Badge>
          </div>

          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-[var(--shell-muted)]">{t("billing.renewalDate")}</dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                {formatRenewalDate(subscription?.current_period_end ?? null)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--shell-muted)]">
                {t("billing.cancelAtPeriodEnd")}
              </dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                {subscription?.cancel_at_period_end ? t("common.yes") : t("common.no")}
              </dd>
            </div>
          </dl>

          {hasActiveSubscription ? (
            <Button className="mt-4" onClick={openPortal} disabled={pending}>
              {t("billing.manageSubscription")}
            </Button>
          ) : null}
        </DataCard>

        <DataCard title={t("billing.invoices")} subtitle={t("billing.invoicesSubtitle")}>
          <p className="text-[13px] text-[var(--shell-muted)]">
            {t("billing.invoicesHint")}
          </p>
        </DataCard>

        <DataCard title={t("billing.payments")} subtitle={t("billing.paymentsSubtitle")}>
          <p className="text-[13px] text-[var(--shell-muted)]">
            {hasActiveSubscription
              ? t("billing.paymentsActive")
              : t("billing.paymentsInactive")}
          </p>
        </DataCard>

        <DataCard title={t("billing.limits")} subtitle={t("billing.limitsSubtitle")}>
          <p className="text-[13px] text-[var(--shell-muted)]">
            {t("billing.limitsHint")}
          </p>
        </DataCard>
      </div>

      {!hasActiveSubscription ? (
        <DataCard title={t("billing.choosePlan")} subtitle={t("billing.choosePlanSubtitle")}>
          <div className="grid gap-3 sm:grid-cols-3">
            {BILLING_PLAN_IDS.map((planId) => (
              <div
                key={planId}
                className="rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)]/40 p-4"
              >
                <p className="font-medium text-[var(--shell-text)]">
                  {BILLING_PLANS[planId].name}
                </p>
                <p className="mt-1 text-sm text-[var(--shell-muted)]">
                  {BILLING_PLANS[planId].description}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  disabled={pending}
                  onClick={() => startCheckout(planId)}
                >
                  {pending && checkoutPlan === planId
                    ? t("billing.redirectingCheckout")
                    : t("billing.subscribe")}
                </Button>
              </div>
            ))}
          </div>
        </DataCard>
      ) : null}
    </div>
  );
}
