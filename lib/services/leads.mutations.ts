"use server";

import { revalidatePath } from "next/cache";

import { getCurrentHotelId } from "@/lib/tenant";
import { createLeadsRepository } from "@/repositories/leads.repository.server";

import type { LeadStatus } from "@/types/lead";

type UpdateLeadStatusInput = {
  leadId: string;
  status: LeadStatus;
};

export async function updateLeadStatus(input: UpdateLeadStatusInput) {
  await getCurrentHotelId();

  const repo = await createLeadsRepository();
  await repo.updateStatus(input.leadId, input.status);

  revalidatePath("/");
}
