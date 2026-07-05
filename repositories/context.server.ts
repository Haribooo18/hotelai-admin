import { createClient as createServerClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { RepositoryContext } from "./context.types";

export async function createServerRepositoryContext(): Promise<RepositoryContext> {
  const [supabase, hotelId] = await Promise.all([
    createServerClient(),
    getCurrentHotelId(),
  ]);

  return { supabase, hotelId };
}
