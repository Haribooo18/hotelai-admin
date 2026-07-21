import { beforeEach, describe, expect, it, vi } from "vitest";

const getAuthenticatedUserMock = vi.fn();
const getTenantContextMock = vi.fn();

vi.mock("@/lib/tenant/context", () => ({
  getAuthenticatedUser: () => getAuthenticatedUserMock(),
  getTenantContext: () => getTenantContextMock(),
  canManageBilling: (role: string) => role === "owner" || role === "manager",
}));

import { requireBillingTenant } from "@/lib/billing/access";

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
