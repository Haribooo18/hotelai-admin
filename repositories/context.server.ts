import { createClient as createServerClient } from "@/lib/supabase/server";
import { instrumentSupabaseClient } from "@/lib/ops/supabase-instrumentation";

import type { TenantContext } from "@/lib/tenant/context";

import {
  createRepositoryContext,
  type RepositoryContext,
} from "./context.types";

export async function createServerRepositoryContext(
  tenant: TenantContext
): Promise<RepositoryContext> {
  const supabase = instrumentSupabaseClient(await createServerClient());
  return createRepositoryContext(supabase, tenant);
}
