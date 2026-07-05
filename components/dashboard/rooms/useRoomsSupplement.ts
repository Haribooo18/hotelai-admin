"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/types/booking";

export function useRoomsSupplement(hotelId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) return;

    let cancelled = false;
    const supabase = createClient();

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("check_in", { ascending: false });

      if (cancelled) return;

      if (!error && data) {
        setBookings(data as Booking[]);
      }

      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return {
    bookings,
    loading: Boolean(hotelId) && loading,
  };
}
