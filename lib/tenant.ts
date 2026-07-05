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
  return {
    id: tenant.hotelId,
    name: tenant.hotelName,
  };
}

/** @deprecated Prefer `getTenantContext()` */
export async function getCurrentUserEmail(): Promise<string> {
  const tenant = await getTenantContext();
  return tenant.userEmail;
}
