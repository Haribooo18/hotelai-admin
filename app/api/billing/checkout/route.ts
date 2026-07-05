import { createCheckoutSession, parseCheckoutPlan } from "@/lib/billing/checkout";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { ProviderError, ValidationError } from "@/lib/ops/errors";
import { getCurrentHotel, getCurrentUser } from "@/lib/tenant";

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
      operation: "checkout",
      endpoint: "/api/billing/checkout",
    },
    async () => {
      if (!isStripeConfigured()) {
        throw new ProviderError(
          "Stripe не настроен. Задайте STRIPE_SECRET_KEY."
        );
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        throw new ValidationError("Некорректный JSON");
      }

      const plan = parseCheckoutPlan(body);
      if (!plan) {
        throw new ValidationError("Укажите тариф: starter, pro или enterprise");
      }

      const [hotel, user] = await Promise.all([getCurrentHotel(), getCurrentUser()]);
      bindApiContext({ hotelId: hotel.id, userId: user?.id });

      const origin = resolveOrigin(request);

      const result = await createCheckoutSession({
        hotelId: hotel.id,
        hotelName: hotel.name,
        userEmail: user?.email ?? undefined,
        plan,
        successUrl: `${origin}/settings?tab=billing&checkout=success`,
        cancelUrl: `${origin}/settings?tab=billing&checkout=canceled`,
      });

      return Response.json(result);
    }
  );
}
