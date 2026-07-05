"use client";

import { useEffect, useState } from "react";

import { createBookingsRepositoryClient } from "@/repositories/bookings.repository.client";
import type { Booking } from "@/types/booking";

export function useRoomsSupplement(hotelId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) return;

    let cancelled = false;
    const repo = createBookingsRepositoryClient(hotelId);

    async function load() {
      setLoading(true);

      const data = await repo.getAll();

      if (cancelled) return;

      setBookings(data);
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
