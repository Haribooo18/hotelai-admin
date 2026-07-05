import { createClient as createBrowserClient } from "@/lib/supabase/client";

export async function getClientUserEmail(): Promise<string | null> {
  const supabase = createBrowserClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}
