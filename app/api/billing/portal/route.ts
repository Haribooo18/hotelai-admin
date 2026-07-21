import { createPortalSession } from "@/lib/billing/portal";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { ProviderError } from "@/lib/ops/errors";
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
      operation: "portal",
      endpoint: "/api/billing/portal",
    },
    async () => {
      if (!isStripeConfigured()) {
        throw new ProviderError(
          "Stripe не настроен. Задайте STRIPE_SECRET_KEY."
        );
      }

      const tenant = await requireBillingTenant();

      const hotelId = tenant.hotelId;
      bindApiContext({ hotelId, userId: tenant.userId });
      const siteUrl = getSiteUrl();

      const result = await createPortalSession({
        hotelId,
        returnUrl: `${siteUrl}/settings?tab=billing`,
      });

      return Response.json(result);
    }
  );
}
