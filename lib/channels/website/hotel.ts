import { createAdminClient } from "@/lib/supabase/admin";

export type WebsiteHotelVerification =
  | { ok: true; hotelId: string }
  | { ok: false; hotelId: string };

export async function verifyWebsiteHotel(
  hotelId: string
): Promise<WebsiteHotelVerification> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("hotels")
    .select("id")
    .eq("id", hotelId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return { ok: false, hotelId };
  }

  return { ok: true, hotelId };
}
