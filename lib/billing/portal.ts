import { createClient } from "@/lib/supabase/server";

import { getStripeClient } from "./stripe";

export type CreatePortalSessionInput = {
  hotelId: string;
  returnUrl: string;
};

export type CreatePortalSessionResult = {
  url: string;
};

async function getStripeCustomerId(hotelId: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.stripe_customer_id) {
    throw new Error("Подписка не найдена. Сначала оформите тариф.");
  }

  return data.stripe_customer_id as string;
}

export async function createPortalSession(
  input: CreatePortalSessionInput
): Promise<CreatePortalSessionResult> {
  const stripe = getStripeClient();
  const customerId = await getStripeCustomerId(input.hotelId);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: input.returnUrl,
  });

  return { url: session.url };
}
