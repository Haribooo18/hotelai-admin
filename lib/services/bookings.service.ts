import { supabase } from "@/lib/supabase";
import type { Booking } from "@/types/booking";

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("check_in", { ascending: false });

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return (data ?? []) as Booking[];
}