"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { AIHealthStatus } from "@/types/ai-settings";

import {
  BILLING_PLAN_IDS,
  BILLING_PLANS,
  formatPlanLabel,
  formatSubscriptionStatusLabel,
} from "@/lib/billing/plans";
import type { BillingPlan } from "@/types/subscription";
import type { HotelSubscription } from "@/types/subscription";

import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/display/Badge";
import { Metric } from "@/components/ui/display/Metric";
import { DataCard } from "@/components/ui/data/DataCard";

type Props = {
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  health?: AIHealthStatus;
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
  health,
}: Props) {
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
          throw new Error(data.error ?? "Failed to open checkout");
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Subscription checkout error"
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
          throw new Error(data.error ?? "Failed to open portal");
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to open portal"
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
        Stripe is not configured. Set <code>STRIPE_SECRET_KEY</code> and price IDs
        in the environment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard interactive title="Subscription" subtitle="Current plan and renewal">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--shell-muted)]">Current plan</p>
              <p className="mt-1 text-xl font-semibold text-[var(--shell-text)]">
                {subscription ? formatPlanLabel(subscription.plan) : "Not selected"}
              </p>
            </div>
            <Badge variant="outline">
              {formatSubscriptionStatusLabel(subscription?.status ?? "none")}
            </Badge>
          </div>

          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-[var(--shell-muted)]">Renewal date</dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                {formatRenewalDate(subscription?.current_period_end ?? null)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--shell-muted)]">Cancel at period end</dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                {subscription?.cancel_at_period_end ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          {hasActiveSubscription ? (
            <Button className="mt-4" onClick={openPortal} disabled={pending}>
              Manage subscription
            </Button>
          ) : null}
        </DataCard>

        <DataCard interactive title="Usage" subtitle="AI consumption in the last 24 hours">
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-[var(--shell-muted)]">Requests</dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                <Metric value={health?.recent_requests ?? 0} />
              </dd>
            </div>
            <div>
              <dt className="text-[var(--shell-muted)]">Estimated cost</dt>
              <dd className="mt-1 text-[var(--shell-text)]">
                ${(health?.total_cost_usd_24h ?? 0).toFixed(4)}
              </dd>
            </div>
          </dl>
        </DataCard>

        <DataCard title="Invoices" subtitle="Billing documents">
          <p className="text-[13px] text-[var(--shell-muted)]">
            Invoice history is available in the Stripe customer portal after an active
            subscription is created.
          </p>
        </DataCard>

        <DataCard title="Payments" subtitle="Settlement status">
          <p className="text-[13px] text-[var(--shell-muted)]">
            {hasActiveSubscription
              ? "Payments are managed through Stripe."
              : "No active payment method until a plan is selected."}
          </p>
        </DataCard>

        <DataCard title="Limits" subtitle="Plan constraints">
          <p className="text-[13px] text-[var(--shell-muted)]">
            Usage limits depend on the selected Monavel plan and connected AI volume.
          </p>
        </DataCard>
      </div>

      {!hasActiveSubscription ? (
        <DataCard title="Choose a plan" subtitle="Available subscriptions">
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
                    ? "Redirecting to checkout..."
                    : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>
        </DataCard>
      ) : null}
    </div>
  );
}
