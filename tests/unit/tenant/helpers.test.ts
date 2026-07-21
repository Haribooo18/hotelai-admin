import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import {
  buildTenantContext,
  canManageBilling,
  resolveHotelId,
  selectTenantMembership,
} from "@/lib/tenant/context";

function makeUser(appMetadata: Record<string, unknown> = {}): User {
  return {
    id: "user-1",
    email: "admin@hotel.com",
    app_metadata: appMetadata,
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
  } as User;
}

describe("resolveHotelId", () => {
  it("reads a normalized hotel selector from app_metadata", () => {
    expect(resolveHotelId(makeUser({ hotel_id: "  hotel_app  " }))).toBe(
      "hotel_app",
    );
  });

  it("does not trust user_metadata or a default hotel fallback", () => {
    const user = {
      ...makeUser(),
      user_metadata: { hotel_id: "hotel_user" },
    } as User;

    expect(resolveHotelId(user)).toBeNull();
  });

  it("ignores an empty app_metadata hotel selector", () => {
    expect(resolveHotelId(makeUser({ hotel_id: "   " }))).toBeNull();
  });
});

describe("selectTenantMembership", () => {
  const memberships = [
    { hotel_id: "hotel_one", role: "owner" },
    { hotel_id: "hotel_two", role: "staff" },
  ];

  it("verifies a metadata-selected hotel against memberships", () => {
    expect(selectTenantMembership(memberships, "hotel_two")).toEqual(
      memberships[1],
    );
  });

  it("rejects a selected hotel that is not in memberships", () => {
    expect(() =>
      selectTenantMembership(memberships, "hotel_other"),
    ).toThrow("not a member");
  });

  it("uses the sole membership when no hotel is selected", () => {
    expect(selectTenantMembership([memberships[0]], null)).toEqual(
      memberships[0],
    );
  });

  it("rejects users without memberships", () => {
    expect(() => selectTenantMembership([], null)).toThrow(
      "no hotel membership",
    );
  });

  it("requires an explicit selector for users with multiple memberships", () => {
    expect(() => selectTenantMembership(memberships, null)).toThrow(
      "multiple hotels",
    );
  });
});

describe("buildTenantContext", () => {
  it("uses membership data as the source of hotel and role", () => {
    expect(
      buildTenantContext(
        makeUser({
          hotel_id: "stale_hotel",
          role: "staff",
          hotel_name: "Stale Hotel",
        }),
        { hotel_id: "hotel_db", role: "manager" },
        "Database Hotel",
      ),
    ).toEqual({
      tenantId: "hotel_db",
      hotelId: "hotel_db",
      userId: "user-1",
      userEmail: "admin@hotel.com",
      role: "manager",
      hotelName: "Database Hotel",
    });
  });

  it("rejects roles outside the database role contract", () => {
    expect(() =>
      buildTenantContext(
        makeUser(),
        { hotel_id: "hotel_db", role: "admin" },
        "Database Hotel",
      ),
    ).toThrow("Unsupported membership role");
  });
});

describe("canManageBilling", () => {
  it.each(["owner", "manager"] as const)("allows %s", (role) => {
    expect(canManageBilling(role)).toBe(true);
  });

  it("does not allow staff", () => {
    expect(canManageBilling("staff")).toBe(false);
  });
});
