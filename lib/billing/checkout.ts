import type { BillingPlan } from "@/types/subscription";
import { createAdminClient } from "@/lib/supabase/admin";

import { getPriceIdForPlan, isBillingPlan } from "./plans";
import { getStripeClient } from "./stripe";

export type CreateCheckoutSessionInput = {
  hotelId: string;
  hotelName: string;
  userEmail?: string;
  plan: BillingPlan;
  successUrl: string;
  cancelUrl: string;
};

export type CreateCheckoutSessionResult = {
  url: string;
  sessionId: string;
};

export function parseCheckoutPlan(raw: unknown): BillingPlan | null {
  if (typeof raw !== "object" || raw === null) return null;
  const plan = (raw as { plan?: unknown }).plan;
  return typeof plan === "string" && isBillingPlan(plan) ? plan : null;
}

async function getOrCreateStripeCustomer(
  hotelId: string,
  hotelName: string,
  userEmail?: string
): Promise<string> {
  const supabase = createAdminClient();
  const stripe = getStripeClient();

  const { data: existing, error } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw error;
  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id as string;
  }

  const customer = await stripe.customers.create({
    name: hotelName,
    email: userEmail,
    metadata: { hotel_id: hotelId },
  });

  const now = new Date().toISOString();
  const { error: insertError } = await supabase.from("subscriptions").upsert(
    {
      hotel_id: hotelId,
      stripe_customer_id: customer.id,
      plan: "starter",
      status: "none",
      updated_at: now,
    },
    { onConflict: "hotel_id" }
  );

  if (insertError) throw insertError;

  return customer.id;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const priceId = getPriceIdForPlan(input.plan);
  if (!priceId) {
    throw new Error(`Цена для тарифа «${input.plan}» не настроена`);
  }

  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(
    input.hotelId,
    input.hotelName,
    input.userEmail
  );

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      hotel_id: input.hotelId,
      plan: input.plan,
    },
    subscription_data: {
      metadata: {
        hotel_id: input.hotelId,
        plan: input.plan,
      },
    },
  });

  if (!session.url) {
    throw new Error("Stripe Checkout не вернул URL");
  }

  return { url: session.url, sessionId: session.id };
}
