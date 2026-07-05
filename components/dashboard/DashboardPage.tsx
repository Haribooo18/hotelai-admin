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
} from "@/components/dashboard/home";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import {
  AdminPageStack,
  DashboardPageHeader,
  DashboardSkeleton,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

const DashboardRevenueTrend = dynamic(
  () =>
    import("@/components/dashboard/home/DashboardRevenueTrend").then((mod) => ({
      default: mod.DashboardRevenueTrend,
    })),
  { loading: () => <DashboardSkeleton className="h-52" /> }
);

const DashboardOccupancyTrend = dynamic(
  () =>
    import("@/components/dashboard/home/DashboardOccupancyTrend").then((mod) => ({
      default: mod.DashboardOccupancyTrend,
    })),
  { loading: () => <DashboardSkeleton className="h-52" /> }
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
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.dashboard.title")}
        subtitle={t("pages.dashboard.subtitle")}
      />

      <DashboardExecutiveKpis
        metrics={metrics}
        aiConversations={aiConversations}
        loading={false}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <DashboardRevenueTrend data={revenueTrend} loading={false} />
          <DashboardOccupancyTrend data={occupancyTrend} loading={false} />
          <DashboardTimeline items={timeline} loading={false} />
        </div>

        <div className="space-y-4">
          <DashboardAiActivity items={aiActivity} loading={false} />
          <DashboardLatestReservations
            bookings={latestBookings}
            loading={false}
          />
          <DashboardAlerts alerts={alerts} loading={false} />
          <div className="sticky top-[calc(var(--shell-header-height)+0.5rem)] z-10">
            <DashboardQuickActions />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardRecentGuests guests={recentGuests} loading={false} />
        <DashboardRecentBookings
          bookings={upcomingBookings}
          loading={false}
        />
        <DashboardRoomStatus
          rooms={rooms}
          bookings={bookings}
          loading={false}
        />
      </div>
    </AdminPageStack>
  );
}
