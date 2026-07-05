import { createLeadsRepository } from "@/repositories/leads.repository.server";

import type { Lead } from "@/types/lead";

export async function getLeads(limit = 50): Promise<Lead[]> {
  const repo = await createLeadsRepository();
  return repo.getAll(limit);
}
