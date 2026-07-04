import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Fallback tenant used only until every user has a hotel assigned via Supabase
 * `app_metadata.hotel_id`. Configurable so no single hotel is hardcoded in code.
 */
const DEFAULT_HOTEL_ID = process.env.DEFAULT_HOTEL_ID ?? "hotel_aurora";

export type CurrentHotel = {
  id: string;
  name: string;
};

function readHotelId(user: User): string | undefined {
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;

  const fromApp = appMeta.hotel_id;
  const fromUser = userMeta.hotel_id;

  if (typeof fromApp === "string" && fromApp.length > 0) return fromApp;
  if (typeof fromUser === "string" && fromUser.length > 0) return fromUser;

  return undefined;
}

function readHotelName(user: User): string | undefined {
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;

  const fromApp = appMeta.hotel_name;
  const fromUser = userMeta.hotel_name;

  if (typeof fromApp === "string" && fromApp.length > 0) return fromApp;
  if (typeof fromUser === "string" && fromUser.length > 0) return fromUser;

  return undefined;
}

/**
 * Returns the authenticated user, or `null` when anonymous.
 * Cached per request so repeated calls do not re-hit Supabase.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

/**
 * Guarantees an authenticated user or redirects to the login page.
 * Use this in every server read/write that touches tenant data.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Resolves hotel id from Supabase user metadata.
 * Priority: app_metadata.hotel_id → user_metadata.hotel_id → DEFAULT_HOTEL_ID.
 *
 * DEFAULT_HOTEL_ID is a temporary fallback until every user has an assigned hotel (TD-09).
 */
export function resolveHotelId(user: User): string {
  return readHotelId(user) ?? DEFAULT_HOTEL_ID;
}

/**
 * Single source of truth for the active hotel id.
 * Services must call this instead of hardcoding a hotel identifier.
 */
export async function getCurrentHotelId(): Promise<string> {
  const user = await requireUser();
  return resolveHotelId(user);
}

/**
 * Active hotel context (id + display name) for UI and services.
 */
export async function getCurrentHotel(): Promise<CurrentHotel> {
  const user = await requireUser();

  return {
    id: resolveHotelId(user),
    name: readHotelName(user) ?? "Aurora Hotel",
  };
}
