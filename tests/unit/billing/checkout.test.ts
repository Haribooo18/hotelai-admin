import { beforeEach, describe, expect, it, vi } from "vitest";

const checkoutSessionsCreateMock = vi.fn();
const customersCreateMock = vi.fn();

vi.mock("@/lib/billing/stripe", () => ({
  getStripeClient: vi.fn(() => ({
    checkout: {
      sessions: {
        create: (...args: unknown[]) => checkoutSessionsCreateMock(...args),
      },
    },
    customers: {
      create: (...args: unknown[]) => customersCreateMock(...args),
    },
  })),
}));

type QueryResult = { data: unknown; error: unknown };

const queryResults: Record<string, QueryResult> = {};
const upsertMock = vi.fn();

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

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: (table: string) => ({
      select: () =>
        chain(queryResults[key(table, "select")] ?? { data: null, error: null }),
      upsert: (data: unknown, options: unknown) => {
        upsertMock({ table, data, options });
        return chain({ data: null, error: null });
      },
    }),
  })),
}));

import {
  createCheckoutSession,
  parseCheckoutPlan,
} from "@/lib/billing/checkout";

describe("parseCheckoutPlan", () => {
  it("accepts valid billing plans", () => {
    expect(parseCheckoutPlan({ plan: "pro" })).toBe("pro");
  });

  it("rejects invalid plans", () => {
    expect(parseCheckoutPlan({ plan: "gold" })).toBeNull();
    expect(parseCheckoutPlan(null)).toBeNull();
  });
});

describe("createCheckoutSession", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    checkoutSessionsCreateMock.mockReset();
    customersCreateMock.mockReset();
    upsertMock.mockReset();
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro_test");
  });

  it("reuses an existing stripe customer and creates checkout", async () => {
    queryResults[key("subscriptions", "select")] = {
      data: { stripe_customer_id: "cus_existing" },
      error: null,
    };

    checkoutSessionsCreateMock.mockResolvedValue({
      id: "cs_test",
      url: "https://checkout.stripe.com/test",
    });

    const result = await createCheckoutSession({
      hotelId: "hotel_test",
      hotelName: "Test Hotel",
      plan: "pro",
      successUrl: "https://app.test/settings?checkout=success",
      cancelUrl: "https://app.test/settings?checkout=canceled",
    });

    expect(result).toEqual({
      url: "https://checkout.stripe.com/test",
      sessionId: "cs_test",
    });
    expect(customersCreateMock).not.toHaveBeenCalled();
    expect(checkoutSessionsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer: "cus_existing",
        metadata: { hotel_id: "hotel_test", plan: "pro" },
      })
    );
  });

  it("creates a stripe customer when none exists", async () => {
    queryResults[key("subscriptions", "select")] = {
      data: null,
      error: null,
    };

    customersCreateMock.mockResolvedValue({ id: "cus_new" });
    checkoutSessionsCreateMock.mockResolvedValue({
      id: "cs_new",
      url: "https://checkout.stripe.com/new",
    });

    await createCheckoutSession({
      hotelId: "hotel_test",
      hotelName: "Test Hotel",
      userEmail: "owner@test.com",
      plan: "pro",
      successUrl: "https://app.test/success",
      cancelUrl: "https://app.test/cancel",
    });

    expect(customersCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { hotel_id: "hotel_test" },
        email: "owner@test.com",
      })
    );
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "subscriptions",
        data: expect.objectContaining({
          hotel_id: "hotel_test",
          stripe_customer_id: "cus_new",
        }),
      })
    );
  });
});
