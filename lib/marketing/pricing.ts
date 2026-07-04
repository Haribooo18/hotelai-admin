import { BILLING_PLAN_IDS, BILLING_PLANS } from "@/lib/billing/plans";
import type { BillingPlan } from "@/types/subscription";

const MARKETING_FEATURES: Record<BillingPlan, string[]> = {
  starter: [
    "AI-ресепшн для одного отеля",
    "Website Chat и Telegram",
    "База знаний",
    "До 500 AI-ответов в месяц",
  ],
  pro: [
    "Всё из Starter",
    "Расширенная аналитика AI",
    "Приоритетная поддержка",
    "До 5 000 AI-ответов в месяц",
  ],
  enterprise: [
    "Всё из Pro",
    "Несколько объектов",
    "SLA и выделенный менеджер",
    "Безлимитные AI-ответы",
  ],
};

const MARKETING_PRICE_LABELS: Record<BillingPlan, string> = {
  starter: "€49",
  pro: "€149",
  enterprise: "По запросу",
};

export type MarketingPlan = {
  id: BillingPlan;
  name: string;
  description: string;
  priceLabel: string;
  features: string[];
  highlighted: boolean;
};

export function getMarketingPlans(): MarketingPlan[] {
  return BILLING_PLAN_IDS.map((id) => ({
    id,
    name: BILLING_PLANS[id].name,
    description: BILLING_PLANS[id].description,
    priceLabel: MARKETING_PRICE_LABELS[id],
    features: MARKETING_FEATURES[id],
    highlighted: id === "pro",
  }));
}
