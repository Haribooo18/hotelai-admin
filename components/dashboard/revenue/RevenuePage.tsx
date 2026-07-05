"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  AdminPageStack,
  DashboardPageHeader,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { RevenueExecutiveKpis } from "./RevenueExecutiveKpis";
import { RevenueOperations } from "./RevenueOperations";
import {
  buildPreviousPeriodRange,
  buildRevenueByRoomType,
  buildRevenueBySource,
  buildRevenueForecast,
  buildRevenueInsights,
  buildRevenueTransactions,
  buildRevenueTrend,
  computeRevenueKpis,
  defaultRevenueRange,
  exportBookingsCsv,
  type RevenueBreakdownPoint,
  type RevenueDateRange,
  type RevenueForecastPoint,
  type RevenueKpis,
  type RevenueTrendPoint,
} from "./revenue-metrics";
import { RevenueToolbar } from "./RevenueToolbar";

const RevenueAnalytics = dynamic(
  () =>
    import("./RevenueAnalytics").then((mod) => ({
      default: mod.RevenueAnalytics,
    })),
  {
    loading: () => (
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardSkeletonBlock className="h-64" />
        <DashboardSkeletonBlock className="h-64" />
        <DashboardSkeletonBlock className="h-64" />
        <DashboardSkeletonBlock className="h-64" />
      </div>
    ),
  }
);

type Props = {
  bookings: Booking[];
  rooms: Room[];
  serverRange?: RevenueDateRange;
  serverKpis?: RevenueKpis;
  serverTrend?: RevenueTrendPoint[];
  serverBySource?: RevenueBreakdownPoint[];
  serverByRoomType?: RevenueBreakdownPoint[];
  serverForecast?: RevenueForecastPoint[];
};

function isServerSnapshotActive(
  range: RevenueDateRange,
  serverRange: RevenueDateRange | undefined,
  search: string,
  statusFilter: string,
  roomFilter: string
): boolean {
  if (!serverRange) return false;
  if (search.trim() !== "" || statusFilter !== "" || roomFilter !== "") {
    return false;
  }

  return range.from === serverRange.from && range.to === serverRange.to;
}

function matchesSearch(
  booking: Booking,
  rooms: Room[],
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const room = rooms.find((item) => item.id === booking.room_id);
  return (
    booking.guest_name.toLowerCase().includes(q) ||
    (room?.room_type.toLowerCase().includes(q) ?? false)
  );
}

export function RevenuePage({
  bookings,
  rooms,
  serverRange,
  serverKpis,
  serverTrend,
  serverBySource,
  serverByRoomType,
  serverForecast,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  const [range, setRange] = useState<RevenueDateRange>(
    () => serverRange ?? defaultRevenueRange()
  );
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter && booking.status !== statusFilter) return false;
      if (roomFilter && booking.room_id !== roomFilter) return false;
      if (!matchesSearch(booking, rooms, search)) return false;
      return true;
    });
  }, [bookings, statusFilter, roomFilter, search, rooms]);

  const useServerSnapshot = isServerSnapshotActive(
    range,
    serverRange,
    search,
    statusFilter,
    roomFilter
  );

  const kpis = useMemo(() => {
    if (useServerSnapshot && serverKpis) return serverKpis;
    return computeRevenueKpis(filteredBookings, rooms, range);
  }, [useServerSnapshot, serverKpis, filteredBookings, rooms, range]);

  const trend = useMemo(() => {
    if (useServerSnapshot && serverTrend) return serverTrend;
    return buildRevenueTrend(filteredBookings, rooms, range);
  }, [useServerSnapshot, serverTrend, filteredBookings, rooms, range]);

  const compareTrend = useMemo(() => {
    if (!compareEnabled) return [];
    const previousRange = buildPreviousPeriodRange(range);
    return buildRevenueTrend(filteredBookings, rooms, previousRange);
  }, [compareEnabled, filteredBookings, rooms, range]);

  const bySource = useMemo(() => {
    if (useServerSnapshot && serverBySource) return serverBySource;
    return buildRevenueBySource(filteredBookings, range);
  }, [useServerSnapshot, serverBySource, filteredBookings, range]);

  const byRoomType = useMemo(() => {
    if (useServerSnapshot && serverByRoomType) return serverByRoomType;
    return buildRevenueByRoomType(filteredBookings, rooms, range);
  }, [useServerSnapshot, serverByRoomType, filteredBookings, rooms, range]);

  const forecast = useMemo(() => {
    if (useServerSnapshot && serverForecast) return serverForecast;
    return buildRevenueForecast(trend);
  }, [useServerSnapshot, serverForecast, trend]);

  const transactions = useMemo(
    () => buildRevenueTransactions(filteredBookings, rooms, range),
    [filteredBookings, rooms, range]
  );

  const insights = useMemo(
    () => buildRevenueInsights(filteredBookings, rooms, range),
    [filteredBookings, rooms, range]
  );

  function handleExport() {
    setExporting(true);
    exportBookingsCsv(transactions);
    setExporting(false);
  }

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.revenue.title")}
        subtitle={t("pages.revenue.subtitle")}
      />

      <RevenueExecutiveKpis kpis={kpis} loading={refreshing} />

      <RevenueToolbar
        range={range}
        compareEnabled={compareEnabled}
        exporting={exporting}
        refreshing={refreshing}
        canExport={transactions.length > 0}
        search={search}
        statusFilter={statusFilter}
        roomFilter={roomFilter}
        rooms={rooms}
        onRangeChange={setRange}
        onCompareChange={setCompareEnabled}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onRoomFilterChange={setRoomFilter}
      />

      <RevenueAnalytics
        trend={trend}
        compareTrend={compareTrend}
        bySource={bySource}
        byRoomType={byRoomType}
        forecast={forecast}
        compareEnabled={compareEnabled}
        loading={refreshing}
      />

      <RevenueOperations transactions={transactions} insights={insights} />
    </AdminPageStack>
  );
}
