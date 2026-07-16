import { beforeEach, describe, expect, it, vi } from "vitest";

const portalSessionsCreateMock = vi.fn();

vi.mock("@/lib/billing/stripe", () => ({
  getStripeClient: vi.fn(() => ({
    billingPortal: {
      sessions: {
        create: (...args: unknown[]) => portalSessionsCreateMock(...args),
      },
    },
  })),
}));

type QueryResult = { data: unknown; error: unknown };

const queryResults: Record<string, QueryResult> = {};

function key(table: string, action: string) {
  return `${table}:${action}`;
}

function chain(result: QueryResult) {
  const builder: Record<string, unknown> = {};
  const terminal = async () => result;
  builder.eq = () => builder;
  builder.maybeSingle = terminal;
  builder.then = (resolve: (v: QueryResult) => void) => resolve(result);
  return builder;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => ({
      select: () =>
        chain(queryResults[key(table, "select")] ?? { data: null, error: null }),
    }),
  })),
}));

import { createPortalSession } from "@/lib/billing/portal";

describe("createPortalSession", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    portalSessionsCreateMock.mockReset();
  });

  it("creates a billing portal session for the hotel customer", async () => {
    queryResults[key("subscriptions", "select")] = {
      data: { stripe_customer_id: "cus_123" },
      error: null,
    };

    portalSessionsCreateMock.mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    });

    const result = await createPortalSession({
      hotelId: "hotel_test",
      returnUrl: "https://app.test/settings?tab=billing",
    });

    expect(result).toEqual({
      url: "https://billing.stripe.com/session/test",
    });
    expect(portalSessionsCreateMock).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "https://app.test/settings?tab=billing",
    });
  });

  it("throws when the hotel has no subscription customer", async () => {
    queryResults[key("subscriptions", "select")] = {
      data: null,
      error: null,
    };

    await expect(
      createPortalSession({
        hotelId: "hotel_test",
        returnUrl: "https://app.test/settings",
      })
    ).rejects.toThrow("Подписка не найдена");
  });
});
