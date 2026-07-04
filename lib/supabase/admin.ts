import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for server-only channel webhooks.
 * Bypasses RLS — always scope queries by hotel_id explicitly.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY и NEXT_PUBLIC_SUPABASE_URL обязательны для канальных вебхуков"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
