import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";

function formatError(error: {
  code?: string;
  message: string;
  details?: string | null;
}) {
  return new Error(
    `${error.code ?? "error"}: ${error.message}${
      error.details ? ` (${error.details})` : ""
    }`
  );
}

export async function getGuests(): Promise<Guest[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw formatError(error);

  return (data ?? []) as Guest[];
}

export async function getGuest(id: string): Promise<Guest | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw formatError(error);

  return (data as Guest | null) ?? null;
}

/**
 * A guest's booking history. Bookings store inline guest fields (no guest_id),
 * so we match on email when available, otherwise on the full name.
 */
export async function getGuestBookings(guest: Guest): Promise<Booking[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  let query = supabase
    .from("bookings")
    .select("*")
    .eq("hotel_id", hotelId);

  if (guest.email && guest.email.trim() !== "") {
    query = query.ilike("guest_email", guest.email.trim());
  } else {
    query = query.ilike(
      "guest_name",
      `${guest.first_name} ${guest.last_name}`.trim()
    );
  }

  const { data, error } = await query.order("check_in", { ascending: false });

  if (error) throw formatError(error);

  return (data ?? []) as Booking[];
}
