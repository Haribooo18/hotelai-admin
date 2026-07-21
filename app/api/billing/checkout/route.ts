import { createCheckoutSession, parseCheckoutPlan } from "@/lib/billing/checkout";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { ProviderError, ValidationError } from "@/lib/ops/errors";
import { requireBillingTenant } from "@/lib/billing/access";

export const runtime = "nodejs";

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    throw new ProviderError(
      "NEXT_PUBLIC_SITE_URL is not configured."
    );
  }

  return siteUrl.replace(/\/+$/, "");
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

      const tenant = await requireBillingTenant();

      bindApiContext({ hotelId: tenant.hotelId, userId: tenant.userId });

      const siteUrl = getSiteUrl();

      const result = await createCheckoutSession({
        hotelId: tenant.hotelId,
        hotelName: tenant.hotelName,
        userEmail: tenant.userEmail || undefined,
        plan,
        successUrl: `${siteUrl}/settings?tab=billing&checkout=success`,
        cancelUrl: `${siteUrl}/settings?tab=billing&checkout=canceled`,
      });

      return Response.json(result);
    }
  );
}
