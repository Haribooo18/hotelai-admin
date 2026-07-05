import { createServerRepositoryContext } from "@/repositories/context.server";

import type { RepositoryContext } from "@/repositories/context.types";

import { getTenantContext } from "./context";

/** Resolves tenant auth once, then builds a scoped repository context for server actions. */
export async function getRepositoryContext(): Promise<RepositoryContext> {
  const tenant = await getTenantContext();
  return createServerRepositoryContext(tenant);
}
