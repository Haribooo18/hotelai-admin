import { handleStripeWebhook } from "@/lib/billing/webhooks";
import { runApiRoute } from "@/lib/ops/api-route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.billing",
      operation: "webhook",
      endpoint: "/api/billing/webhook",
    },
    () => handleStripeWebhook(request)
  );
}
