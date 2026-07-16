"use server";

import { revalidatePath } from "next/cache";

import { createLeadsRepository } from "@/repositories/leads.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { LeadStatus } from "@/types/lead";

type UpdateLeadStatusInput = {
  leadId: string;
  status: LeadStatus;
};

export async function updateLeadStatus(input: UpdateLeadStatusInput) {
  const ctx = await getRepositoryContext();
  await createLeadsRepository(ctx).updateStatus(input.leadId, input.status);

  revalidatePath("/");
}
