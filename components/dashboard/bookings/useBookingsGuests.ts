"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Guest } from "@/types/guest";

export function useBookingsGuests(hotelId: string | null) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(Boolean(hotelId));

  useEffect(() => {
    if (!hotelId) {
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("hotel_id", hotelId)
        .is("deleted_at", null);

      if (cancelled) return;

      if (!error && data) {
        setGuests(data as Guest[]);
      }

      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return { guests, loading: hotelId ? loading : false };
}
