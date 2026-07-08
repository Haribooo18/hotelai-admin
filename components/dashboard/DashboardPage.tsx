"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { subscribeLeadsChanges } from "@/lib/realtime/leads";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
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
  getRecentGuests,
  getUpcomingBookings,
  DashboardAiActivity,
  DashboardAlerts,
  DashboardExecutiveKpis,
  DashboardLatestReservations,
  DashboardQuickActions,
  DashboardRecentBookings,
  DashboardRecentGuests,
  DashboardRoomStatus,
  DashboardTimeline,
  DashboardToolbar,
} from "@/components/dashboard/home";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { DashboardPageLayout } from "@/components/dashboard/home/DashboardPageLayout";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { useI18n } from "@/lib/i18n";

const DashboardRevenueTrend = dynamic(
  () =>
    import("@/components/dashboard/home/DashboardRevenueTrend").then((mod) => ({
      default: mod.DashboardRevenueTrend,
    })),
  { loading: () => <SkeletonGroup className="h-52" lines={["h-full w-full"]} /> }
);

const DashboardOccupancyTrend = dynamic(
  () =>
    import("@/components/dashboard/home/DashboardOccupancyTrend").then((mod) => ({
      default: mod.DashboardOccupancyTrend,
    })),
  { loading: () => <SkeletonGroup className="h-52" lines={["h-full w-full"]} /> }
);

type Props = {
  initialLeads: Lead[];
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
  initialMetrics: DashboardMetrics;
  hotelId: string;
};

export function DashboardPage({
  initialLeads,
  bookings,
  rooms,
  guests,
  initialMetrics,
  hotelId,
}: Props) {
  const { t } = useI18n();
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

  const recentGuests = useMemo(
    () => getRecentGuests(guests),
    [guests]
  );

  const upcomingBookings = useMemo(
    () => getUpcomingBookings(bookings),
    [bookings]
  );

  const aiActivity = useMemo(() => buildAiActivity(leads), [leads]);

  const alerts = useMemo(
    () => buildDashboardAlerts(bookings, rooms, leads),
    [bookings, rooms, leads]
  );

  return (
    <DashboardPageLayout
      toolbar={
        <DashboardToolbar search={search} onSearchChange={setSearch} />
      }
      header={
        <PageHeader
          title={t("pages.dashboard.title")}
          subtitle={t("pages.dashboard.subtitle")}
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
      charts={
        <Stack gap="md" aria-label="Dashboard charts">
          <DashboardRevenueTrend data={revenueTrend} loading={false} />
          <DashboardOccupancyTrend data={occupancyTrend} loading={false} />
        </Stack>
      }
      tables={
        <DashboardTimeline
          items={timeline}
          loading={false}
          searchQuery={search}
        />
      }
      secondary={
        <>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <DashboardAiActivity
              items={aiActivity}
              loading={false}
              searchQuery={search}
            />
            <DashboardLatestReservations
              bookings={latestBookings}
              loading={false}
              searchQuery={search}
            />
            <DashboardAlerts
              alerts={alerts}
              loading={false}
              searchQuery={search}
            />
            <DashboardQuickActions />
          </div>

          <Section
            title={t("dashboard.operations")}
            subtitle={t("dashboard.operationsSubtitle")}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:gap-5">
              <DashboardRecentGuests
                guests={recentGuests}
                loading={false}
                searchQuery={search}
              />
              <DashboardRecentBookings
                bookings={upcomingBookings}
                loading={false}
                searchQuery={search}
              />
              <DashboardRoomStatus
                rooms={rooms}
                bookings={bookings}
                loading={false}
              />
            </div>
          </Section>
        </>
      }
    />
  );
}
