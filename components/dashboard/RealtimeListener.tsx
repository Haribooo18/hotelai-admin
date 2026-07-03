"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type Props = {
  hotelId: string;
};

export function RealtimeListener({ hotelId }: Props) {
  useEffect(() => {
    const channel = supabase
      .channel("hotel-leads")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "hotel_leads",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          const lead = payload.new as {
            guest_name?: string;
            room_type?: string;
          };

          toast.success("Новая заявка", {
            description: `${lead.guest_name ?? "Новый гость"} • ${
              lead.room_type ?? ""
            }`,
          });

          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hotelId]);

  return null;
}