import { beforeEach, describe, expect, it, vi } from "vitest";

const constructEventMock = vi.fn();
const subscriptionsRetrieveMock = vi.fn();
const customersRetrieveMock = vi.fn();

vi.mock("@/lib/billing/stripe", () => ({
  getStripeClient: vi.fn(() => ({
    webhooks: {
      constructEvent: (...args: unknown[]) => constructEventMock(...args),
    },
    subscriptions: {
      retrieve: (...args: unknown[]) => subscriptionsRetrieveMock(...args),
    },
    customers: {
      retrieve: (...args: unknown[]) => customersRetrieveMock(...args),
    },
  })),
  getStripeWebhookSecret: vi.fn(() => "whsec_test"),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const insertMock = vi.fn();
const upsertMock = vi.fn();

function chain(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  builder.then = (resolve: (v: { data: unknown; error: unknown }) => void) =>
    resolve(result);
  return builder;
}

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: (table: string) => ({
      insert: (data: unknown) => {
        insertMock({ table, data });
        return chain({ data: null, error: null });
      },
      upsert: (data: unknown, options: unknown) => {
        upsertMock({ table, data, options });
        return chain({ data: null, error: null });
      },
    }),
  })),
}));

import { revalidatePath } from "next/cache";

import {
  handleStripeWebhookEvent,
  mapSubscriptionRecord,
  verifyStripeWebhookSignature,
} from "@/lib/billing/webhooks";

describe("verifyStripeWebhookSignature", () => {
  beforeEach(() => {
    constructEventMock.mockReset();
  });

  it("delegates to Stripe constructEvent", () => {
    const event = { id: "evt_1", type: "customer.subscription.updated" };
    constructEventMock.mockReturnValue(event);

    const result = verifyStripeWebhookSignature('{"id":"evt_1"}', "sig_test");

    expect(result).toBe(event);
    expect(constructEventMock).toHaveBeenCalledWith(
      '{"id":"evt_1"}',
      "sig_test",
      "whsec_test"
    );
  });

  it("requires the Stripe-Signature header", () => {
    expect(() => verifyStripeWebhookSignature("{}", null)).toThrow(
      "Stripe-Signature"
    );
  });
});

describe("mapSubscriptionRecord", () => {
  it("maps stripe subscription fields to tenant upsert input", () => {
    const mapped = mapSubscriptionRecord(
      {
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        metadata: { hotel_id: "hotel_test", plan: "pro" },
        current_period_start: 1_700_000_000,
        current_period_end: 1_700_086_400,
        cancel_at_period_end: false,
        items: {
          data: [{ price: { id: "price_pro" } }],
        },
      } as never,
      "hotel_test"
    );

    expect(mapped).toEqual({
      hotelId: "hotel_test",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      plan: "pro",
      status: "active",
      currentPeriodStart: new Date(1_700_000_000 * 1000),
      currentPeriodEnd: new Date(1_700_086_400 * 1000),
      cancelAtPeriodEnd: false,
    });
  });
});

describe("handleStripeWebhookEvent", () => {
  beforeEach(() => {
    insertMock.mockReset();
    upsertMock.mockReset();
    subscriptionsRetrieveMock.mockReset();
    vi.mocked(revalidatePath).mockReset();
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro");
  });

  it("upserts subscription and persists event on subscription update", async () => {
    await handleStripeWebhookEvent({
      id: "evt_sub_update",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_123",
          customer: "cus_123",
          status: "active",
          metadata: { hotel_id: "hotel_test", plan: "pro" },
          current_period_start: 1_700_000_000,
          current_period_end: 1_700_086_400,
          cancel_at_period_end: false,
          items: { data: [{ price: { id: "price_pro" } }] },
        },
      },
    } as never);

    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "subscriptions",
        data: expect.objectContaining({
          hotel_id: "hotel_test",
          stripe_subscription_id: "sub_123",
          plan: "pro",
          status: "active",
        }),
      })
    );
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "subscription_events",
        data: expect.objectContaining({
          hotel_id: "hotel_test",
          stripe_event_id: "evt_sub_update",
          event_type: "customer.subscription.updated",
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/settings");
  });

  it("handles checkout.session.completed with subscription retrieval", async () => {
    subscriptionsRetrieveMock.mockResolvedValue({
      id: "sub_checkout",
      customer: "cus_123",
      status: "trialing",
      metadata: { hotel_id: "hotel_test", plan: "starter" },
      current_period_start: 1_700_000_000,
      current_period_end: 1_700_086_400,
      cancel_at_period_end: false,
      items: { data: [{ price: { id: "price_starter" } }] },
    });
    vi.stubEnv("STRIPE_PRICE_STARTER", "price_starter");

    await handleStripeWebhookEvent({
      id: "evt_checkout",
      type: "checkout.session.completed",
      data: {
        object: {
          customer: "cus_123",
          subscription: "sub_checkout",
          metadata: { hotel_id: "hotel_test", plan: "starter" },
        },
      },
    } as never);

    expect(subscriptionsRetrieveMock).toHaveBeenCalledWith("sub_checkout");
    expect(upsertMock).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/settings");
  });
});
