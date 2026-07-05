"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/types/lead";

import {
  buildOccupancyTrend,
  buildRevenueTrend,
  buildTimeline,
  computeDashboardMetrics,
  DashboardHero,
  DashboardKpiGrid,
  DashboardLatestReservations,
  DashboardLeadsPanel,
  DashboardOccupancyTrend,
  DashboardQuickActions,
  DashboardRevenueTrend,
  DashboardTimeline,
  getLatestBookings,
  useDashboardSupplement,
} from "@/components/dashboard/home";
import { AdminPageStack, DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

type Props = {
  initialLeads: Lead[];
  hotelId: string;
};

export function DashboardPage({ initialLeads, hotelId }: Props) {
  const { t } = useI18n();
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { bookings, rooms, loading } = useDashboardSupplement(hotelId);

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
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      confirmed: leads.filter((lead) => lead.status === "confirmed").length,
      cancelled: leads.filter((lead) => lead.status === "cancelled").length,
    }),
    [leads]
  );

  const visibleLeads = useMemo(() => {
    let items = leads;

    if (status !== "all") {
      items = items.filter((lead) => lead.status === status);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

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
          .includes(query)
      );
    }

    return items;
  }, [leads, status, search]);

  const metrics = useMemo(
    () => computeDashboardMetrics(bookings, rooms, leads),
    [bookings, rooms, leads]
  );

  const revenueTrend = useMemo(
    () => buildRevenueTrend(bookings),
    [bookings]
  );

  const occupancyTrend = useMemo(
    () => buildOccupancyTrend(bookings, rooms.length),
    [bookings, rooms.length]
  );

  const timeline = useMemo(
    () => buildTimeline(bookings, leads),
    [bookings, leads]
  );

  const latestBookings = useMemo(
    () => getLatestBookings(bookings),
    [bookings]
  );

  return (
    <AdminPageStack>
      <DashboardPageHeader
        title={t("pages.dashboard.title")}
        subtitle={t("pages.dashboard.subtitle")}
      />

      <DashboardHero metrics={metrics} loading={loading} />

      <DashboardKpiGrid metrics={metrics} loading={loading} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <DashboardTimeline items={timeline} loading={loading} />
        <DashboardQuickActions />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardRevenueTrend data={revenueTrend} loading={loading} />
        <DashboardOccupancyTrend data={occupancyTrend} loading={loading} />
        <DashboardLatestReservations
          bookings={latestBookings}
          loading={loading}
        />
      </div>

      <DashboardLeadsPanel
        leads={visibleLeads}
        search={search}
        status={status}
        counts={counts}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    </AdminPageStack>
  );
}
