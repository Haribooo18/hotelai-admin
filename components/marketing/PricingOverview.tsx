import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getMarketingPlans } from "@/lib/marketing/pricing";
import { cn } from "@/lib/utils";

export function PricingOverview() {
  const plans = getMarketingPlans();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Тарифы</h1>
      <p className="mt-4 text-lg text-zinc-400">
        Выберите план и оформите подписку в панели администратора.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-emerald-600 bg-emerald-950/20"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
            <p className="mt-4 text-4xl font-bold">{plan.priceLabel}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link
              href="/settings?tab=billing"
              className={cn(
                buttonVariants({
                  variant: plan.highlighted ? "default" : "outline",
                }),
                "mt-8 w-full"
              )}
            >
              Начать пробный период
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
