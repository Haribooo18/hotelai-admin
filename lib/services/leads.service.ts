import { createLeadsRepository } from "@/repositories/leads.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { Lead } from "@/types/lead";

export async function getLeads(limit = 50): Promise<Lead[]> {
  const ctx = await getRepositoryContext();
  return createLeadsRepository(ctx).getAll(limit);
}
