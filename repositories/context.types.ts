import type { SupabaseClient } from "@supabase/supabase-js";

export type RepositoryContext = {
  supabase: SupabaseClient;
  hotelId: string;
};

export type SupabaseErrorShape = {
  code?: string;
  message: string;
  details?: string | null;
};

export function throwRepositoryError(error: SupabaseErrorShape): never {
  throw new Error(
    `${error.code ?? "error"}: ${error.message}${
      error.details ? ` (${error.details})` : ""
    }`
  );
}
