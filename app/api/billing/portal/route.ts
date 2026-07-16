import { createPortalSession } from "@/lib/billing/portal";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { ProviderError } from "@/lib/ops/errors";
import { getCurrentHotelId } from "@/lib/tenant";

export const runtime = "nodejs";

function resolveOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return origin;

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.billing",
      operation: "portal",
      endpoint: "/api/billing/portal",
    },
    async () => {
      if (!isStripeConfigured()) {
        throw new ProviderError(
          "Stripe не настроен. Задайте STRIPE_SECRET_KEY."
        );
      }

      const hotelId = await getCurrentHotelId();
      bindApiContext({ hotelId });
      const origin = resolveOrigin(request);

      const result = await createPortalSession({
        hotelId,
        returnUrl: `${origin}/settings?tab=billing`,
      });

      return Response.json(result);
    }
  );
}
