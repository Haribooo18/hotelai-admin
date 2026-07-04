"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  BILLING_PLAN_IDS,
  BILLING_PLANS,
  formatPlanLabel,
  formatSubscriptionStatusLabel,
} from "@/lib/billing/plans";
import type { BillingPlan } from "@/types/subscription";
import type { HotelSubscription } from "@/types/subscription";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
};

function formatRenewalDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BillingPanel({ subscription, stripeConfigured }: Props) {
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
          throw new Error(data.error ?? "Не удалось открыть оплату");
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка оформления подписки"
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
          throw new Error(data.error ?? "Не удалось открыть портал");
        }

        window.location.href = data.url;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка открытия портала"
        );
      }
    });
  }

  if (!stripeConfigured) {
    return (
      <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-200">
        Stripe не настроен. Задайте <code>STRIPE_SECRET_KEY</code> и price IDs в
        окружении.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Текущий тариф</p>
            <p className="mt-1 text-xl font-semibold">
              {subscription ? formatPlanLabel(subscription.plan) : "Не выбран"}
            </p>
          </div>
          <Badge variant="secondary">
            {formatSubscriptionStatusLabel(subscription?.status ?? "none")}
          </Badge>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Дата продления</dt>
            <dd className="mt-1 text-zinc-200">
              {formatRenewalDate(subscription?.current_period_end ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Отмена в конце периода</dt>
            <dd className="mt-1 text-zinc-200">
              {subscription?.cancel_at_period_end ? "Да" : "Нет"}
            </dd>
          </div>
        </dl>

        {hasActiveSubscription && (
          <Button
            className="mt-4"
            onClick={openPortal}
            disabled={pending}
          >
            Управление подпиской
          </Button>
        )}
      </div>

      {!hasActiveSubscription && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-300">Выберите тариф</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {BILLING_PLAN_IDS.map((planId) => (
              <div
                key={planId}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <p className="font-medium">{BILLING_PLANS[planId].name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {BILLING_PLANS[planId].description}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  disabled={pending}
                  onClick={() => startCheckout(planId)}
                >
                  {pending && checkoutPlan === planId
                    ? "Переход к оплате..."
                    : "Оформить"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
