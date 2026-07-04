import { supabase } from "@/lib/supabase";

import type { Guest } from "@/types/guest";

export async function getGuests(): Promise<Guest[]> {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data satisfies Guest[];
}