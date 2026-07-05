"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

export type DashboardSupplement = {
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
  loading: boolean;
};

export function useDashboardSupplement(hotelId: string): DashboardSupplement {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      setLoading(true);

      const [bookingsResult, roomsResult, guestsResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("hotel_id", hotelId)
          .order("check_in", { ascending: false }),
        supabase.from("rooms").select("*").eq("hotel_id", hotelId),
        supabase
          .from("guests")
          .select("*")
          .eq("hotel_id", hotelId)
          .is("deleted_at", null),
      ]);

      if (!bookingsResult.error && bookingsResult.data) {
        setBookings(bookingsResult.data as Booking[]);
      }

      if (!roomsResult.error && roomsResult.data) {
        setRooms(roomsResult.data as Room[]);
      }

      if (!guestsResult.error && guestsResult.data) {
        setGuests(guestsResult.data as Guest[]);
      }

      setLoading(false);
    }

    void load();
  }, [hotelId]);

  return { bookings, rooms, guests, loading };
}
