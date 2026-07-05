import { createClient as createBrowserClient } from "@/lib/supabase/client";

import type { Lead } from "@/types/lead";

export function subscribeLeadsChanges(
  hotelId: string,
  onLeadsUpdated: (leads: Lead[]) => void
): () => void {
  const supabase = createBrowserClient();

  const channel = supabase
    .channel(`hotel-leads-${hotelId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leads",
        filter: `hotel_id=eq.${hotelId}`,
      },
      async () => {
        const { data, error } = await supabase.rpc("list_hotel_leads", {
          p_hotel_id: hotelId,
          p_limit: 50,
        });

        if (!error && data) {
          onLeadsUpdated(data as Lead[]);
        }
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
