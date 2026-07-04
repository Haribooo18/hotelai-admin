import { handleStripeWebhook } from "@/lib/billing/webhooks";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}
