import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import type { BillingPlan, HotelSubscription, SubscriptionStatus } from "@/types/subscription";

function formatError(error: {
  code?: string;
  message: string;
  details?: string | null;
}) {
  return new Error(
    `${error.code ?? "error"}: ${error.message}${
      error.details ? ` (${error.details})` : ""
    }`
  );
}

export async function getHotelSubscription(): Promise<HotelSubscription | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw formatError(error);
  if (!data) return null;

  return {
    id: data.id,
    hotel_id: data.hotel_id,
    stripe_customer_id: data.stripe_customer_id,
    stripe_subscription_id: data.stripe_subscription_id,
    plan: data.plan as BillingPlan,
    status: data.status as SubscriptionStatus,
    current_period_start: data.current_period_start,
    current_period_end: data.current_period_end,
    cancel_at_period_end: data.cancel_at_period_end,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
