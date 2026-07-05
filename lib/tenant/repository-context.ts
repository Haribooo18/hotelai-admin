import { createServerRepositoryContext } from "@/repositories/context.server";

import type { RepositoryContext } from "@/repositories/context.types";

import { getTenantContext } from "./context";
import { patchRequestContext } from "@/lib/ops/request-context";

/** Resolves tenant auth once, then builds a scoped repository context for server actions. */
export async function getRepositoryContext(): Promise<RepositoryContext> {
  const tenant = await getTenantContext();
  patchRequestContext({
    hotelId: tenant.hotelId,
    userId: tenant.userId,
  });
  return createServerRepositoryContext(tenant);
}
