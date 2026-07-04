import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

export async function getDashboardStats() {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const [
    { count: rooms },
    { count: bookings },
    { data: revenueRows },
    { count: occupied },
  ] = await Promise.all([
    supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", hotelId),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", hotelId),

    supabase
      .from("bookings")
      .select("total_price")
      .eq("hotel_id", hotelId),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("status", "checked_in"),
  ]);

  const revenue =
    revenueRows?.reduce(
      (sum, booking) => sum + Number(booking.total_price),
      0
    ) ?? 0;

  const occupancy =
    rooms && rooms > 0 ? Math.round(((occupied ?? 0) / rooms) * 100) : 0;

  return {
    rooms: rooms ?? 0,
    bookings: bookings ?? 0,
    occupied: occupied ?? 0,
    occupancy,
    revenue,
  };
}
