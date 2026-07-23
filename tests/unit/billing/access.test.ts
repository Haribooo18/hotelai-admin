import { beforeEach, describe, expect, it, vi } from "vitest";

const getAuthenticatedUserMock = vi.fn();
const getTenantContextMock = vi.fn();

vi.mock("@/lib/tenant/context", () => ({
  getAuthenticatedUser: () => getAuthenticatedUserMock(),
  getTenantContext: () => getTenantContextMock(),
  canManageBilling: (role: string) => role === "owner" || role === "manager",
}));

import { hasProductAccess, requireBillingTenant } from "@/lib/billing/access";
import type { HotelSubscription, SubscriptionStatus } from "@/types/subscription";

describe("requireBillingTenant", () => {
  beforeEach(() => {
    getAuthenticatedUserMock.mockReset();
    getTenantContextMock.mockReset();
  });

  it("returns 401-compatible authentication error for anonymous API callers", async () => {
    getAuthenticatedUserMock.mockResolvedValue(null);

    await expect(requireBillingTenant()).rejects.toMatchObject({
      code: "AUTHENTICATION_ERROR",
      status: 401,
    });
    expect(getTenantContextMock).not.toHaveBeenCalled();
  });

  it("rejects staff billing access", async () => {
    getAuthenticatedUserMock.mockResolvedValue({ id: "user-1" });
    getTenantContextMock.mockResolvedValue({ role: "staff" });

    await expect(requireBillingTenant()).rejects.toMatchObject({
      code: "AUTHORIZATION_ERROR",
      status: 403,
    });
  });

  it("allows owners and managers", async () => {
    const tenant = { role: "manager", hotelId: "hotel-1" };
    getAuthenticatedUserMock.mockResolvedValue({ id: "user-1" });
    getTenantContextMock.mockResolvedValue(tenant);

    await expect(requireBillingTenant()).resolves.toBe(tenant);
  });
});

function subscriptionWithStatus(status: SubscriptionStatus): HotelSubscription {
  return {
    id: "sub-1",
    hotel_id: "hotel-1",
    stripe_customer_id: "cus_1",
    stripe_subscription_id: "sub_stripe_1",
    plan: "starter",
    status,
    current_period_start: "2026-07-01T00:00:00.000Z",
    current_period_end: "2026-08-01T00:00:00.000Z",
    cancel_at_period_end: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-07-01T00:00:00.000Z",
  };
}

describe("hasProductAccess", () => {
  it("denies access when there is no subscription row at all", () => {
    expect(hasProductAccess(null)).toBe(false);
  });

  it.each<SubscriptionStatus>(["active", "trialing", "past_due"])(
    "allows access for status %s",
    (status) => {
      expect(hasProductAccess(subscriptionWithStatus(status))).toBe(true);
    }
  );

  it.each<SubscriptionStatus>([
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
    "paused",
    "none",
  ])("denies access for status %s", (status) => {
    expect(hasProductAccess(subscriptionWithStatus(status))).toBe(false);
  });
});
