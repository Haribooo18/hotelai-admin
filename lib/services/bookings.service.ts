import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { Booking } from "@/types/booking";

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("hotel_id", hotelId)
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

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return (data as Booking | null) ?? null;
}
