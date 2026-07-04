import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const [
    { count: rooms },
    { count: bookings },
    { data: revenueRows },
    { count: occupied },
  ] = await Promise.all([
    supabase
      .from("rooms")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("bookings")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("bookings")
      .select("total_price"),

    supabase
      .from("bookings")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "checked_in"),
  ]);

  const revenue =
    revenueRows?.reduce(
      (sum, booking) =>
        sum + Number(booking.total_price),
      0
    ) ?? 0;

  const occupancy =
    rooms && rooms > 0
      ? Math.round(
          ((occupied ?? 0) / rooms) * 100
        )
      : 0;

  return {
    rooms: rooms ?? 0,
    bookings: bookings ?? 0,
    occupied: occupied ?? 0,
    occupancy,
    revenue,
  };
}