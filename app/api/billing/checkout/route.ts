import { createCheckoutSession, parseCheckoutPlan } from "@/lib/billing/checkout";
import { isStripeConfigured } from "@/lib/billing/stripe";
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
  if (!isStripeConfigured()) {
    return Response.json(
      { error: "Stripe не настроен. Задайте STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const plan = parseCheckoutPlan(body);
  if (!plan) {
    return Response.json({ error: "Укажите тариф: starter, pro или enterprise" }, {
      status: 400,
    });
  }

  try {
    const [hotel, user] = await Promise.all([getCurrentHotel(), getCurrentUser()]);
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка создания Checkout";
    return Response.json({ error: message }, { status: 500 });
  }
}
