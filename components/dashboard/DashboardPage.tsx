"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { subscribeLeadsChanges } from "@/lib/realtime/leads";
import { todayIso } from "@/lib/dashboard/date";
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
  type DashboardToolbarFilter,
} from "@/components/dashboard/home";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
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
  const [activeFilter, setActiveFilter] =
    useState<DashboardToolbarFilter>("all");

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

  const showGuestOperations =
    activeFilter === "all" || activeFilter === "guests";
  const showReservationOperations =
    activeFilter === "all" || activeFilter === "reservations";
  const showRoomOperations =
    activeFilter === "all" || activeFilter === "operations";

  return (
    <Stack gap="md" className="ds-page-enter">
      <PageHeader
        title={t("pages.dashboard.title")}
        subtitle={t("pages.dashboard.subtitle")}
      />

      <DashboardExecutiveKpis
        metrics={metrics}
        aiConversations={aiConversations}
        loading={false}
        revenueTrend={revenueTrend}
        occupancyTrend={occupancyTrend}
      />

      <DashboardToolbar
        search={search}
        onSearchChange={setSearch}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        dateValue={todayIso()}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] 2xl:gap-5">
        <Stack gap="md" aria-label="Main workspace">
          <DashboardRevenueTrend data={revenueTrend} loading={false} />
          <DashboardOccupancyTrend data={occupancyTrend} loading={false} />
          <DashboardTimeline
            items={timeline}
            loading={false}
            searchQuery={search}
          />
        </Stack>

        <aside
          className="space-y-4 xl:sticky xl:top-[calc(var(--shell-header-height)+0.5rem)] xl:self-start"
          aria-label="Insights"
        >
          <Stack gap="md">
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
          </Stack>
        </aside>
      </div>

      <Section
        title="Operations"
        subtitle="Guests, reservations, and room status at a glance"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:gap-5">
          {showGuestOperations ? (
            <DashboardRecentGuests
              guests={recentGuests}
              loading={false}
              searchQuery={search}
            />
          ) : null}
          {showReservationOperations ? (
            <DashboardRecentBookings
              bookings={upcomingBookings}
              loading={false}
              searchQuery={search}
            />
          ) : null}
          {showRoomOperations ? (
            <DashboardRoomStatus
              rooms={rooms}
              bookings={bookings}
              loading={false}
            />
          ) : null}
        </div>
      </Section>
    </Stack>
  );
}
