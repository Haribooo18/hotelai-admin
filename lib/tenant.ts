import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import {
  getAuthenticatedUser,
  getTenantContext,
} from "./tenant/context";

export type { TenantContext, TenantRole } from "./tenant/context";
export {
  buildTenantContext,
  getAuthenticatedUser,
  getTenantContext,
  resolveHotelId,
} from "./tenant/context";
export { getRepositoryContext } from "./tenant/repository-context";

export type CurrentHotel = {
  id: string;
  name: string;
  timezone?: string;
  language?: string;
};

/** @deprecated Prefer `getAuthenticatedUser()` or `getTenantContext()` */
export const getCurrentUser = getAuthenticatedUser;

/** @deprecated Prefer `getTenantContext()` */
export async function requireUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/** @deprecated Prefer `getTenantContext()` */
export async function getCurrentHotelId(): Promise<string> {
  const tenant = await getTenantContext();
  return tenant.hotelId;
}

/** @deprecated Prefer `getTenantContext()` */
export async function getCurrentHotel(): Promise<CurrentHotel> {
  const tenant = await getTenantContext();
  const supabase = await import("@/lib/supabase/server").then((module) =>
    module.createClient(),
  );
  const { data } = await supabase
    .from("hotels")
    .select("name, timezone, language")
    .eq("id", tenant.hotelId)
    .maybeSingle();

  return {
    id: tenant.hotelId,
    name: (data?.name as string | undefined) ?? tenant.hotelName,
    timezone: (data?.timezone as string | undefined) ?? "UTC",
    language: (data?.language as string | undefined) ?? "ru",
  };
}

/** @deprecated Prefer `getTenantContext()` */
export async function getCurrentUserEmail(): Promise<string> {
  const tenant = await getTenantContext();
  return tenant.userEmail;
}
