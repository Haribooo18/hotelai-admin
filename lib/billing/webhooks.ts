import type Stripe from "stripe";
import { revalidatePath } from "next/cache";

import type { BillingPlan, SubscriptionStatus } from "@/types/subscription";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  isBillingPlan,
  mapStripeSubscriptionStatus,
  resolvePlanFromPriceId,
} from "./plans";
import { getStripeClient, getStripeWebhookSecret } from "./stripe";

export type SubscriptionUpsertInput = {
  hotelId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  plan: BillingPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

function readSubscriptionPeriod(subscription: Stripe.Subscription): {
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
} {
  const period = subscription as Stripe.Subscription & {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };

  const currentPeriodStart = period.current_period_start
    ? new Date(period.current_period_start * 1000)
    : null;

  const currentPeriodEnd = period.current_period_end
    ? new Date(period.current_period_end * 1000)
    : subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null;

  return { currentPeriodStart, currentPeriodEnd };
}

function toIso(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

function resolveHotelIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  const hotelId = metadata?.hotel_id;
  return typeof hotelId === "string" && hotelId.length > 0 ? hotelId : null;
}

function resolvePlanFromSubscription(
  subscription: Stripe.Subscription
): BillingPlan {
  const metadataPlan = subscription.metadata?.plan;
  if (typeof metadataPlan === "string" && isBillingPlan(metadataPlan)) {
    return metadataPlan;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  if (priceId) {
    const resolved = resolvePlanFromPriceId(priceId);
    if (resolved) return resolved;
  }

  return "starter";
}

export function verifyStripeWebhookSignature(
  payload: string,
  signature: string | null
): Stripe.Event {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET не задан");
  }
  if (!signature) {
    throw new Error("Отсутствует заголовок Stripe-Signature");
  }

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function persistSubscriptionEvent(
  event: Stripe.Event,
  hotelId: string | null
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("subscription_events").insert({
    hotel_id: hotelId,
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event.data.object as unknown as Record<string, unknown>,
  });

  if (error && error.code !== "23505") {
    throw error;
  }
}

export async function upsertHotelSubscription(
  input: SubscriptionUpsertInput
): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      hotel_id: input.hotelId,
      stripe_customer_id: input.stripeCustomerId,
      stripe_subscription_id: input.stripeSubscriptionId,
      plan: input.plan,
      status: input.status,
      current_period_start: toIso(input.currentPeriodStart),
      current_period_end: toIso(input.currentPeriodEnd),
      cancel_at_period_end: input.cancelAtPeriodEnd,
      updated_at: now,
    },
    { onConflict: "hotel_id" }
  );

  if (error) throw error;
}

export function mapSubscriptionRecord(
  subscription: Stripe.Subscription,
  hotelId: string
): SubscriptionUpsertInput {
  const { currentPeriodStart, currentPeriodEnd } =
    readSubscriptionPeriod(subscription);

  return {
    hotelId,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripeSubscriptionId: subscription.id,
    plan: resolvePlanFromSubscription(subscription),
    status: mapStripeSubscriptionStatus(subscription.status),
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

async function resolveHotelIdForSubscription(
  subscription: Stripe.Subscription
): Promise<string | null> {
  const fromMetadata = resolveHotelIdFromMetadata(subscription.metadata);
  if (fromMetadata) return fromMetadata;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const stripe = getStripeClient();
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;

  return resolveHotelIdFromMetadata(customer.metadata);
}

export async function handleSubscriptionLifecycle(
  subscription: Stripe.Subscription
): Promise<string | null> {
  const hotelId = await resolveHotelIdForSubscription(subscription);
  if (!hotelId) return null;

  await upsertHotelSubscription(mapSubscriptionRecord(subscription, hotelId));
  return hotelId;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const hotelId = resolveHotelIdFromMetadata(session.metadata);
  if (!hotelId) return null;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!customerId) return hotelId;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (subscriptionId) {
    const stripe = getStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await upsertHotelSubscription(mapSubscriptionRecord(subscription, hotelId));
  } else {
    const plan =
      typeof session.metadata?.plan === "string" &&
      isBillingPlan(session.metadata.plan)
        ? session.metadata.plan
        : "starter";

    await upsertHotelSubscription({
      hotelId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: null,
      plan,
      status: "incomplete",
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });
  }

  return hotelId;
}

export async function handleStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  let hotelId: string | null = null;

  switch (event.type) {
    case "checkout.session.completed":
      hotelId = await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      hotelId = await handleSubscriptionLifecycle(
        event.data.object as Stripe.Subscription
      );
      break;
    default:
      break;
  }

  await persistSubscriptionEvent(event, hotelId);

  if (hotelId) {
    revalidatePath("/settings");
  }
}

export async function handleStripeWebhook(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  try {
    const event = verifyStripeWebhookSignature(payload, signature);
    await handleStripeWebhookEvent(event);
    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка вебхука Stripe";
    return Response.json({ error: message }, { status: 400 });
  }
}
