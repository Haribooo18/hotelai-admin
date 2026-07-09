"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { inspectorGridClass, workspaceSurfaceClass } from "@/lib/dashboard/design-system";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { useI18n } from "@/lib/i18n";

import { RevenueExecutiveKpis } from "./RevenueExecutiveKpis";
import { RevenueInsights } from "./RevenueInsights";
import { RevenueInspector } from "./RevenueInspector";
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
import {
  detectRevenuePreset,
  type RevenueRangePreset,
  type RevenueToolbarFilters,
} from "./revenue-ui";
import { RevenueToolbar } from "./RevenueToolbar";

const RevenueAnalytics = dynamic(
  () =>
    import("./RevenueAnalytics").then((mod) => ({
      default: mod.RevenueAnalytics,
    })),
  {
    loading: () => (
      <GlassSurface className={workspaceSurfaceClass}>
        <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
      </GlassSurface>
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

const DEFAULT_FILTERS: RevenueToolbarFilters = {
  search: "",
  status: "",
  roomId: "",
};

function isServerSnapshotActive(
  range: RevenueDateRange,
  serverRange: RevenueDateRange | undefined,
  filters: RevenueToolbarFilters
): boolean {
  if (!serverRange) return false;
  if (
    filters.search.trim() !== "" ||
    filters.status !== "" ||
    filters.roomId !== ""
  ) {
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
  const [preset, setPreset] = useState<RevenueRangePreset>(() =>
    detectRevenuePreset(serverRange ?? defaultRevenueRange())
  );
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<RevenueToolbarFilters>(DEFAULT_FILTERS);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (filters.status && booking.status !== filters.status) return false;
      if (filters.roomId && booking.room_id !== filters.roomId) return false;
      if (!matchesSearch(booking, rooms, filters.search)) return false;
      return true;
    });
  }, [bookings, filters, rooms]);

  const useServerSnapshot = isServerSnapshotActive(
    range,
    serverRange,
    filters
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
    <WorkspacePageLayout
      header={
        <PageHeader
          title={t("pages.revenue.title")}
          subtitle={t("pages.revenue.subtitle")}
        />
      }
      kpis={
        <RevenueExecutiveKpis
          kpis={kpis}
          trend={trend}
          forecast={forecast}
          loading={refreshing}
        />
      }
        toolbar={
          <RevenueToolbar
            range={range}
            preset={preset}
            compareEnabled={compareEnabled}
            exporting={exporting}
            refreshing={refreshing}
            canExport={transactions.length > 0}
            filters={filters}
            rooms={rooms}
            onRangeChange={setRange}
            onPresetChange={setPreset}
            onCompareChange={setCompareEnabled}
            onExport={handleExport}
            onRefresh={handleRefresh}
            onFiltersChange={setFilters}
          />
        }
        secondary={
          <RevenueOperations
            byRoomType={byRoomType}
            bySource={bySource}
            transactions={transactions}
            trend={trend}
            loading={refreshing}
          />
        }
      >
        <div className={inspectorGridClass}>
          <div className="space-y-4">
            <RevenueAnalytics
              trend={trend}
              compareTrend={compareTrend}
              bySource={bySource}
              byRoomType={byRoomType}
              forecast={forecast}
              compareEnabled={compareEnabled}
              loading={refreshing}
            />

            <RevenueInsights insights={insights} loading={refreshing} />
          </div>

          <div className="hidden xl:block">
            <RevenueInspector
              kpis={kpis}
              trend={trend}
              forecast={forecast}
              range={range}
              useServerSnapshot={useServerSnapshot}
              canExport={transactions.length > 0}
              exporting={exporting}
              loading={refreshing}
              onExport={handleExport}
            />
          </div>
        </div>
      </WorkspacePageLayout>
  );
}
