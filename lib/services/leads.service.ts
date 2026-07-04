import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { Lead } from "@/types/lead";

export async function getLeads(limit = 50): Promise<Lead[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase.rpc("list_hotel_leads", {
    p_hotel_id: hotelId,
    p_limit: limit,
  });

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return (data ?? []) as Lead[];
}
