"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { subscribeLeadsChanges } from "@/lib/realtime/leads";
import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import {
  buildAiActivity,
  buildDashboardAlerts,
  buildOccupancyTrend,
  buildRevenueTrend,
  buildTimeline,
  getAiConversationCount,
  getLatestBookings,
  DashboardActivityFeed,
  DashboardAiInsights,
  DashboardExecutiveKpis,
  DashboardHero,
  DashboardTodayOperations,
  DashboardToolbar,
} from "@/components/dashboard/home";
import {
  buildDashboardAiInsights,
  buildDashboardHeroInsight,
  buildHeroExecutiveStatus,
  buildTodayOperations,
} from "@/components/dashboard/home/dashboard-insights";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import { DashboardPageLayout } from "@/components/dashboard/home/DashboardPageLayout";
import { WorkspaceAiRecommendations } from "@/components/dashboard/shared/WorkspaceAiRecommendations";
import { buildDashboardRecommendations } from "@/components/dashboard/shared/ai-recommendation-builders";
import { WorkspaceChartSkeleton } from "@/components/dashboard/shared/skeleton";

const DashboardRevenueTrend = dynamic(
  () =>
    import("@/components/dashboard/home/DashboardRevenueTrend").then((mod) => ({
      default: mod.DashboardRevenueTrend,
    })),
  { loading: () => <WorkspaceChartSkeleton className="h-72" /> }
);

type Props = {
  initialLeads: Lead[];
  bookings: Booking[];
  rooms: Room[];
  initialMetrics: DashboardMetrics;
  hotelId: string;
  hotelName: string;
};

export function DashboardPage({
  initialLeads,
  bookings,
  rooms,
  initialMetrics,
  hotelId,
  hotelName,
}: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");

  useEffect(() => {
    return subscribeLeadsChanges(hotelId, setLeads);
  }, [hotelId]);

  const metrics = useMemo(
    () => ({
      ...initialMetrics,
      openRequests: leads.filter((lead) => lead.status === "new").length,
    }),
    [initialMetrics, leads]
  );

  const aiConversations = useMemo(
    () => getAiConversationCount(leads),
    [leads]
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

  const aiActivity = useMemo(() => buildAiActivity(leads), [leads]);

  const alerts = useMemo(
    () => buildDashboardAlerts(bookings, rooms, leads),
    [bookings, rooms, leads]
  );

  const heroInsight = useMemo(
    () => buildDashboardHeroInsight(metrics, occupancyTrend),
    [metrics, occupancyTrend]
  );

  const heroStatus = useMemo(
    () => buildHeroExecutiveStatus(metrics, alerts, leads, bookings),
    [metrics, alerts, leads, bookings]
  );

  const aiInsights = useMemo(
    () => buildDashboardAiInsights(metrics, alerts, leads, rooms, bookings),
    [metrics, alerts, leads, rooms, bookings]
  );

  const todayOperations = useMemo(
    () => buildTodayOperations(metrics, leads, rooms, bookings),
    [metrics, leads, rooms, bookings]
  );

  const aiRecommendations = useMemo(
    () => buildDashboardRecommendations(metrics, alerts, leads, rooms, bookings),
    [metrics, alerts, leads, rooms, bookings]
  );

  return (
    <DashboardPageLayout
      toolbar={
        <DashboardToolbar search={search} onSearchChange={setSearch} />
      }
      hero={
        <DashboardHero
          hotelName={hotelName}
          insight={heroInsight}
          status={heroStatus}
        />
      }
      kpis={
        <DashboardExecutiveKpis
          metrics={metrics}
          aiConversations={aiConversations}
          loading={false}
          revenueTrend={revenueTrend}
          occupancyTrend={occupancyTrend}
        />
      }
      recommendations={
        <WorkspaceAiRecommendations recommendations={aiRecommendations} />
      }
      aiInsights={<DashboardAiInsights insight={aiInsights} />}
      todayOps={<DashboardTodayOperations items={todayOperations} />}
      revenue={
        <DashboardRevenueTrend data={revenueTrend} loading={false} />
      }
      activity={
        <DashboardActivityFeed
          timeline={timeline}
          aiActivity={aiActivity}
          latestBookings={latestBookings}
          loading={false}
          searchQuery={search}
        />
      }
    />
  );
}
