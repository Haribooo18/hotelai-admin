import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  AI_CHANNELS,
  FAQ_ITEMS,
  HOW_IT_WORKS,
  LANDING_FEATURES,
} from "@/lib/marketing/content";
import { getMarketingPlans } from "@/lib/marketing/pricing";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-900/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold">Возможности</h2>
        <p className="mt-2 text-zinc-400">
          Всё необходимое для современного гостевого сервиса
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {LANDING_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold">Как это работает</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <span className="text-3xl font-bold text-emerald-500">{item.step}</span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AIChannelsSection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-900/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold">AI-каналы</h2>
        <p className="mt-2 text-zinc-400">Telegram, Website Chat и база знаний</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AI_CHANNELS.map((channel) => (
            <div
              key={channel.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h3 className="text-lg font-semibold">{channel.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{channel.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const plans = getMarketingPlans();

  return (
    <section className="py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold">Тарифы</h2>
        <p className="mt-2 text-zinc-400">Starter, Pro и Enterprise</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-emerald-600 bg-emerald-950/20"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold">{plan.priceLabel}</p>
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
                  "mt-6 w-full"
                )}
              >
                Начать пробный период
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-900/30 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <dl className="mt-10 space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-zinc-800 p-5">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 text-sm text-zinc-400">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
