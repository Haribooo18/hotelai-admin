import { createClient as createServerClient } from "@/lib/supabase/server";

import type { TenantContext } from "@/lib/tenant/context";

import {
  createRepositoryContext,
  type RepositoryContext,
} from "./context.types";

export async function createServerRepositoryContext(
  tenant: TenantContext
): Promise<RepositoryContext> {
  const supabase = await createServerClient();
  return createRepositoryContext(supabase, tenant);
}
