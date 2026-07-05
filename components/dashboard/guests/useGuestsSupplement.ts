"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

export function useGuestsSupplement(hotelId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) return;

    let cancelled = false;
    const supabase = createClient();

    async function load() {
      setLoading(true);

      const [bookingsResult, roomsResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("hotel_id", hotelId)
          .order("check_in", { ascending: false }),
        supabase.from("rooms").select("*").eq("hotel_id", hotelId),
      ]);

      if (cancelled) return;

      if (!bookingsResult.error && bookingsResult.data) {
        setBookings(bookingsResult.data as Booking[]);
      }

      if (!roomsResult.error && roomsResult.data) {
        setRooms(roomsResult.data as Room[]);
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
    rooms,
    loading: Boolean(hotelId) && loading,
  };
}
