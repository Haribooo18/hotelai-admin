import { BILLING_PLAN_IDS, BILLING_PLANS } from "@/lib/billing/plans";
import type { BillingPlan } from "@/types/subscription";

const MARKETING_FEATURES: Record<BillingPlan, string[]> = {
  starter: [
    "AI reception for one hotel",
    "Website Chat and Telegram",
    "Knowledge base",
    "Up to 500 AI responses per month",
  ],
  pro: [
    "Everything in Starter",
    "Advanced AI analytics",
    "Priority support",
    "Up to 5,000 AI responses per month",
  ],
  enterprise: [
    "Everything in Pro",
    "Multiple properties",
    "SLA and dedicated manager",
    "Unlimited AI responses",
  ],
};

const MARKETING_PRICE_LABELS: Record<BillingPlan, string> = {
  starter: "€49",
  pro: "€149",
  enterprise: "Contact us",
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
