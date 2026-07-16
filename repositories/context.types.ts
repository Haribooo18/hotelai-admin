import type { SupabaseClient } from "@supabase/supabase-js";

import { RepositoryError } from "@/lib/ops/errors";

import type { TenantContext } from "@/lib/tenant/context";

export type RepositoryContext = {
  supabase: SupabaseClient;
  tenant: TenantContext;
  tenantId: string;
  hotelId: string;
  userId: string;
  userEmail: string;
  role: TenantContext["role"];
};

export type SupabaseErrorShape = {
  code?: string;
  message: string;
  details?: string | null;
};

export function throwRepositoryError(error: SupabaseErrorShape): never {
  const code = error.code ?? "error";
  const message = `${code}: ${error.message}${
    error.details ? ` (${error.details})` : ""
  }`;

  throw new RepositoryError(message, {
    supabaseCode: code,
    details: error.details ?? undefined,
  });
}

export function createRepositoryContext(
  supabase: SupabaseClient,
  tenant: TenantContext
): RepositoryContext {
  return {
    supabase,
    tenant,
    tenantId: tenant.tenantId,
    hotelId: tenant.hotelId,
    userId: tenant.userId,
    userEmail: tenant.userEmail,
    role: tenant.role,
  };
}
