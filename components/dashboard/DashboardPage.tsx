"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/types/lead";

import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { LeadsTable } from "@/components/dashboard/LeadsTable";

import { LeadSearch } from "@/app/LeadSearch";
import { LeadFilters } from "@/app/LeadFilters";

type Props = {
  initialLeads: Lead[];
  hotelId: string;
};

export function DashboardPage({ initialLeads, hotelId }: Props) {
  const [leads, setLeads] = useState(initialLeads);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  useEffect(() => {
    const supabase = createClient();

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
            setLeads(data as Lead[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hotelId]);

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      confirmed: leads.filter((l) => l.status === "confirmed").length,
      cancelled: leads.filter((l) => l.status === "cancelled").length,
    }),
    [leads]
  );

  const visibleLeads = useMemo(() => {
    let items = leads;

    if (status !== "all") {
      items = items.filter((lead) => lead.status === status);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      items = items.filter((lead) =>
        [
          lead.guest_name,
          lead.phone,
          lead.email,
          lead.room_type,
          lead.comment,
          lead.check_in,
          lead.check_out,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return items;
  }, [leads, status, search]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Заявки на бронирование
        </h1>

        <p className="mt-2 text-zinc-500">
          Управление входящими заявками отеля
        </p>
      </div>

      <DashboardStats counts={counts} />

      <DashboardCharts />

      <LeadSearch
        value={search}
        onChange={setSearch}
      />

      <LeadFilters
        active={status}
        setActive={setStatus}
        counts={counts}
      />

      <LeadsTable leads={visibleLeads} />
    </>
  );
}