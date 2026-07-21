import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export type TenantRole = "owner" | "manager" | "staff";

export type TenantContext = {
  tenantId: string;
  hotelId: string;
  userId: string;
  userEmail: string;
  role: TenantRole;
  hotelName: string;
};

type MembershipRow = {
  hotel_id: string;
  role: string;
};

const BILLING_ROLES: readonly TenantRole[] = ["owner", "manager"];
const VALID_TENANT_ROLES: readonly TenantRole[] = [
  "owner",
  "manager",
  "staff",
];

export function canManageBilling(role: TenantRole): boolean {
  return BILLING_ROLES.includes(role);
}

function readAppMetadataString(user: User, key: string): string | undefined {
  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;
  const value = appMetadata[key];

  if (typeof value !== "string") return undefined;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Returns the hotel selected in trusted app metadata.
 *
 * This value is only a selector. `getTenantContext()` always verifies it
 * against the authenticated user's rows in `memberships` before using it.
 */
export function resolveHotelId(user: User): string | null {
  return readAppMetadataString(user, "hotel_id") ?? null;
}

function parseTenantRole(role: string): TenantRole {
  if (VALID_TENANT_ROLES.includes(role as TenantRole)) {
    return role as TenantRole;
  }

  throw new Error(`Unsupported membership role: ${role}`);
}

export function selectTenantMembership(
  memberships: readonly MembershipRow[],
  preferredHotelId: string | null,
): MembershipRow {
  if (preferredHotelId) {
    const selected = memberships.find(
      (membership) => membership.hotel_id === preferredHotelId,
    );

    if (!selected) {
      throw new Error(
        "The authenticated user is not a member of the selected hotel.",
      );
    }

    return selected;
  }

  if (memberships.length === 0) {
    throw new Error("The authenticated user has no hotel membership.");
  }

  if (memberships.length > 1) {
    throw new Error(
      "The authenticated user belongs to multiple hotels, but no hotel is selected in app_metadata.hotel_id.",
    );
  }

  return memberships[0];
}

export function buildTenantContext(
  user: User,
  membership: MembershipRow,
  hotelName: string,
): TenantContext {
  const hotelId = membership.hotel_id;

  return {
    tenantId: hotelId,
    hotelId,
    userId: user.id,
    userEmail: user.email ?? "",
    role: parseTenantRole(membership.role),
    hotelName,
  };
}

/**
 * Returns the authenticated user, or `null` when anonymous.
 * Cached per request so repeated calls do not re-hit Supabase.
 */
export const getAuthenticatedUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

function requireAuthenticatedUser(user: User | null): User {
  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Single source of truth for authenticated dashboard tenant access.
 *
 * JWT app metadata may select a hotel, but authorization and role always come
 * from `memberships`. This prevents stale or misconfigured metadata from
 * granting service-layer access to another tenant.
 */
export const getTenantContext = cache(async (): Promise<TenantContext> => {
  const user = requireAuthenticatedUser(await getAuthenticatedUser());
  const supabase = await createClient();

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("hotel_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (membershipsError) {
    throw membershipsError;
  }

  const membership = selectTenantMembership(
    (memberships ?? []) as MembershipRow[],
    resolveHotelId(user),
  );

  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .select("name")
    .eq("id", membership.hotel_id)
    .maybeSingle();

  if (hotelError) {
    throw hotelError;
  }

  if (!hotel) {
    throw new Error("The selected hotel does not exist or is not accessible.");
  }

  return buildTenantContext(user, membership, hotel.name);
});
