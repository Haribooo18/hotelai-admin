import type { BillingPlan, SubscriptionStatus } from "@/types/subscription";

export const BILLING_PLANS = {
  starter: {
    id: "starter" as const,
    name: "Starter",
    description: "Базовый тариф для небольших отелей",
    priceEnv: "STRIPE_PRICE_STARTER",
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    description: "Расширенные возможности AI-ресепшна",
    priceEnv: "STRIPE_PRICE_PRO",
  },
  enterprise: {
    id: "enterprise" as const,
    name: "Enterprise",
    description: "Полный набор функций и приоритетная поддержка",
    priceEnv: "STRIPE_PRICE_ENTERPRISE",
  },
} as const;

export const BILLING_PLAN_IDS = Object.keys(BILLING_PLANS) as BillingPlan[];

export function isBillingPlan(value: string): value is BillingPlan {
  return BILLING_PLAN_IDS.includes(value as BillingPlan);
}

export function getPriceIdForPlan(plan: BillingPlan): string | null {
  const envKey = BILLING_PLANS[plan].priceEnv;
  return process.env[envKey]?.trim() || null;
}

export function resolvePlanFromPriceId(priceId: string): BillingPlan | null {
  for (const plan of BILLING_PLAN_IDS) {
    if (getPriceIdForPlan(plan) === priceId) {
      return plan;
    }
  }
  return null;
}

export function mapStripeSubscriptionStatus(
  status: string | null | undefined
): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "canceled":
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return status;
    default:
      return "none";
  }
}

export function formatPlanLabel(plan: BillingPlan): string {
  return BILLING_PLANS[plan].name;
}

export function formatSubscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "Активна";
    case "trialing":
      return "Пробный период";
    case "past_due":
      return "Просрочена оплата";
    case "canceled":
      return "Отменена";
    case "unpaid":
      return "Не оплачена";
    case "incomplete":
      return "Ожидает оплаты";
    case "incomplete_expired":
      return "Истекла";
    case "paused":
      return "Приостановлена";
    default:
      return "Нет подписки";
  }
}
