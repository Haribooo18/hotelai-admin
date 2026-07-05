"use client";

import { useEffect, useState } from "react";

import { loadDashboardSupplement } from "@/repositories/dashboard.repository.client";
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
    let cancelled = false;

    async function load() {
      setLoading(true);

      const data = await loadDashboardSupplement(hotelId);

      if (cancelled) return;

      setBookings(data.bookings);
      setRooms(data.rooms);
      setGuests(data.guests);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return { bookings, rooms, guests, loading };
}
