"use client";

import { useEffect, useState } from "react";

import { createBookingsRepositoryClient } from "@/repositories/bookings.repository.client";
import { createRoomsRepositoryClient } from "@/repositories/rooms.repository.client";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

export function useGuestsSupplement(hotelId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) return;

    let cancelled = false;
    const bookingsRepo = createBookingsRepositoryClient(hotelId);
    const roomsRepo = createRoomsRepositoryClient(hotelId);

    async function load() {
      setLoading(true);

      const [bookingsData, roomsData] = await Promise.all([
        bookingsRepo.getAll(),
        roomsRepo.getAll(),
      ]);

      if (cancelled) return;

      setBookings(bookingsData);
      setRooms(roomsData);
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
