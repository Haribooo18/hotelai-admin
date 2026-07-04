"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { LeadStatus } from "@/types/lead";

type UpdateLeadStatusInput = {
  leadId: string;
  status: LeadStatus;
};

export async function updateLeadStatus(input: UpdateLeadStatusInput) {
  const supabase = await createClient();

  // Ensures an authenticated tenant context before mutating.
  await getCurrentHotelId();

  const { error } = await supabase.rpc("update_lead_status", {
    p_lead_id: input.leadId,
    p_status: input.status,
  });

  if (error) throw error;

  revalidatePath("/");
}
