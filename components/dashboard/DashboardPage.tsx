"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { subscribeLeadsChanges } from "@/repositories/leads.repository.client";
import type { Lead } from "@/types/lead";

import {
  buildAiActivity,
  buildDashboardAlerts,
  buildOccupancyTrend,
  buildRevenueTrend,
  buildTimeline,
  computeDashboardMetrics,
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
  useDashboardSupplement,
} from "@/components/dashboard/home";
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
  hotelId: string;
};

export function DashboardPage({ initialLeads, hotelId }: Props) {
  const { t } = useI18n();
  const [leads, setLeads] = useState(initialLeads);

  const { bookings, rooms, guests, loading } = useDashboardSupplement(hotelId);

  useEffect(() => {
    return subscribeLeadsChanges(hotelId, setLeads);
  }, [hotelId]);

  const metrics = useMemo(
    () => computeDashboardMetrics(bookings, rooms, leads),
    [bookings, rooms, leads]
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
        loading={loading}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <DashboardRevenueTrend data={revenueTrend} loading={loading} />
          <DashboardOccupancyTrend data={occupancyTrend} loading={loading} />
          <DashboardTimeline items={timeline} loading={loading} />
        </div>

        <div className="space-y-4">
          <DashboardAiActivity items={aiActivity} loading={loading} />
          <DashboardLatestReservations
            bookings={latestBookings}
            loading={loading}
          />
          <DashboardAlerts alerts={alerts} loading={loading} />
          <div className="sticky top-[calc(var(--shell-header-height)+0.5rem)] z-10">
            <DashboardQuickActions />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardRecentGuests guests={recentGuests} loading={loading} />
        <DashboardRecentBookings
          bookings={upcomingBookings}
          loading={loading}
        />
        <DashboardRoomStatus
          rooms={rooms}
          bookings={bookings}
          loading={loading}
        />
      </div>
    </AdminPageStack>
  );
}
