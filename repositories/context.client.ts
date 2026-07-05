import { createClient as createBrowserClient } from "@/lib/supabase/client";

import type { RepositoryContext } from "./context.types";

export function createClientRepositoryContext(hotelId: string): RepositoryContext {
  return {
    supabase: createBrowserClient(),
    hotelId,
  };
}
