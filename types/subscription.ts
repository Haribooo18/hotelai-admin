export type BillingPlan = "starter" | "pro" | "enterprise";

export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type HotelSubscription = {
  id: string;
  hotel_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan: BillingPlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type SubscriptionEvent = {
  id: string;
  hotel_id: string | null;
  stripe_event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
};
