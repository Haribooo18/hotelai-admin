import { createPortalSession } from "@/lib/billing/portal";
import { isStripeConfigured } from "@/lib/billing/stripe";
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
  if (!isStripeConfigured()) {
    return Response.json(
      { error: "Stripe не настроен. Задайте STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  try {
    const hotelId = await getCurrentHotelId();
    const origin = resolveOrigin(request);

    const result = await createPortalSession({
      hotelId,
      returnUrl: `${origin}/settings?tab=billing`,
    });

    return Response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ошибка создания Billing Portal";
    return Response.json({ error: message }, { status: 500 });
  }
}
