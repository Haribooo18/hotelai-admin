"use client";

import { useEffect, useState } from "react";

import { createGuestsRepositoryClient } from "@/repositories/guests.repository.client";
import type { Guest } from "@/types/guest";

export function useBookingsGuests(hotelId: string | null) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) {
      return;
    }

    let cancelled = false;
    const repo = createGuestsRepositoryClient(hotelId);

    async function load() {
      setLoading(true);

      const data = await repo.getAll();

      if (cancelled) return;

      setGuests(data);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return { guests, loading: hotelId ? loading : false };
}
