"use client";

import Link from "next/link";
import { CreditCard, Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/core/Button";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { formatSubscriptionStatusLabel } from "@/lib/billing/plans";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { HotelSubscription } from "@/types/subscription";

type Props = {
  subscription: HotelSubscription | null;
  canManage: boolean;
};

/**
 * Deliberately does not duplicate the checkout/portal fetch logic that
 * already lives in BillingPanel.tsx — it links to the real settings billing
 * tab (which already knows how to render a "choose a plan" state for a
 * hotel with no subscription at all, vs. a "manage subscription" state for
 * one that lapsed) rather than reimplementing that branching here.
 */
export function BillingBlockedScreen({ subscription, canManage }: Props) {
  const { t } = useI18n();

  const statusLabel = subscription
    ? formatSubscriptionStatusLabel(subscription.status)
    : null;

  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center p-6">
      <GlassSurface className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
          <Lock size={22} />
        </div>

        <h1 className="ds-heading text-lg">{t("billing.accessBlockedTitle")}</h1>

        <p className="ds-body text-[var(--shell-muted)]">
          {canManage
            ? t("billing.accessBlockedBody")
            : t("billing.accessBlockedBodyStaff")}
        </p>

        {statusLabel ? (
          <p className="ds-caption text-[var(--shell-muted)]">
            {t("billing.currentPlan")}: {statusLabel}
          </p>
        ) : null}

        {canManage ? (
          <Link
            href="/settings?tab=billing"
            className={cn(buttonVariants({ variant: "default" }), "mt-2")}
          >
            <CreditCard size={16} />
            {t("billing.accessBlockedCta")}
          </Link>
        ) : null}
      </GlassSurface>
    </div>
  );
}
