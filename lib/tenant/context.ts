import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const DEFAULT_HOTEL_ID = process.env.DEFAULT_HOTEL_ID ?? "hotel_aurora";
const DEFAULT_ROLE = "staff";

export type TenantRole = "owner" | "admin" | "staff" | (string & {});

export type TenantContext = {
  tenantId: string;
  hotelId: string;
  userId: string;
  userEmail: string;
  role: TenantRole;
  hotelName: string;
};

function readMetadataString(
  user: User,
  key: string
): string | undefined {
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;

  const fromApp = appMeta[key];
  const fromUser = userMeta[key];

  if (typeof fromApp === "string" && fromApp.length > 0) return fromApp;
  if (typeof fromUser === "string" && fromUser.length > 0) return fromUser;

  return undefined;
}

export function resolveHotelId(user: User): string {
  return readMetadataString(user, "hotel_id") ?? DEFAULT_HOTEL_ID;
}

function resolveTenantId(user: User, hotelId: string): string {
  return readMetadataString(user, "tenant_id") ?? hotelId;
}

function resolveHotelName(user: User): string {
  return readMetadataString(user, "hotel_name") ?? "Aurora Hotel";
}

function resolveRole(user: User): TenantRole {
  return (readMetadataString(user, "role") ?? DEFAULT_ROLE) as TenantRole;
}

export function buildTenantContext(user: User): TenantContext {
  const hotelId = resolveHotelId(user);

  return {
    tenantId: resolveTenantId(user, hotelId),
    hotelId,
    userId: user.id,
    userEmail: user.email ?? "admin@hotel.com",
    role: resolveRole(user),
    hotelName: resolveHotelName(user),
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

/** Single source of truth for tenant-scoped server access. Cached per request. */
export const getTenantContext = cache(async (): Promise<TenantContext> => {
  const user = requireAuthenticatedUser(await getAuthenticatedUser());
  return buildTenantContext(user);
});
