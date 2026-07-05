import { createClient as createBrowserClient } from "@/lib/supabase/client";

import {
  createRepositoryContext,
  type RepositoryContext,
} from "./context.types";

export function createClientRepositoryContext(hotelId: string): RepositoryContext {
  return createRepositoryContext(createBrowserClient(), {
    tenantId: hotelId,
    hotelId,
    userId: "",
    userEmail: "",
    role: "staff",
    hotelName: "",
  });
}
