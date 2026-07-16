import { describe, expect, it, vi } from "vitest";

import {
  formatSubscriptionStatusLabel,
  mapStripeSubscriptionStatus,
  resolvePlanFromPriceId,
} from "@/lib/billing/plans";

describe("mapStripeSubscriptionStatus", () => {
  it("maps known Stripe statuses", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe("active");
    expect(mapStripeSubscriptionStatus("trialing")).toBe("trialing");
    expect(mapStripeSubscriptionStatus("past_due")).toBe("past_due");
  });

  it("falls back to none for unknown statuses", () => {
    expect(mapStripeSubscriptionStatus("unknown")).toBe("none");
    expect(mapStripeSubscriptionStatus(null)).toBe("none");
  });
});

describe("formatSubscriptionStatusLabel", () => {
  it("returns English labels", () => {
    expect(formatSubscriptionStatusLabel("active")).toBe("Active");
    expect(formatSubscriptionStatusLabel("none")).toBe("No subscription");
  });
});

describe("resolvePlanFromPriceId", () => {
  it("resolves configured price ids to plans", () => {
    vi.stubEnv("STRIPE_PRICE_STARTER", "price_starter");
    vi.stubEnv("STRIPE_PRICE_PRO", "price_pro");

    expect(resolvePlanFromPriceId("price_pro")).toBe("pro");
    expect(resolvePlanFromPriceId("missing")).toBeNull();
  });
});
