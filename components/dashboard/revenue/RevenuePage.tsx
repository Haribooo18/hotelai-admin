"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { RevenueCharts } from "./RevenueCharts";
import { RevenueInsights } from "./RevenueInsights";
import { RevenueKpiGrid } from "./RevenueKpiGrid";
import {
  buildMonthlyComparison,
  buildRevenueByChannel,
  buildRevenueByRoomType,
  buildRevenueInsights,
  buildRevenueTransactions,
  buildRevenueTrend,
  computeRevenueKpis,
  defaultRevenueRange,
  exportBookingsCsv,
  type RevenueDateRange,
} from "./revenue-metrics";
import { RevenueToolbar } from "./RevenueToolbar";
import { RevenueTransactions } from "./RevenueTransactions";
import { RevenueWidgets } from "./RevenueWidgets";

type Props = {
  bookings: Booking[];
  rooms: Room[];
};

export function RevenuePage({ bookings, rooms }: Props) {
  const [range, setRange] = useState<RevenueDateRange>(() => defaultRevenueRange());
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [exporting, setExporting] = useState(false);

  const kpis = useMemo(
    () => computeRevenueKpis(bookings, rooms, range),
    [bookings, rooms, range]
  );

  const trend = useMemo(
    () => buildRevenueTrend(bookings, rooms, range),
    [bookings, rooms, range]
  );

  const byChannel = useMemo(
    () => buildRevenueByChannel(bookings, range),
    [bookings, range]
  );

  const byRoomType = useMemo(
    () => buildRevenueByRoomType(bookings, rooms, range),
    [bookings, rooms, range]
  );

  const monthlyComparison = useMemo(
    () => buildMonthlyComparison(bookings),
    [bookings]
  );

  const transactions = useMemo(
    () => buildRevenueTransactions(bookings, rooms, range),
    [bookings, rooms, range]
  );

  const insights = useMemo(
    () => buildRevenueInsights(bookings, rooms, range),
    [bookings, rooms, range]
  );

  function handleExport() {
    setExporting(true);
    exportBookingsCsv(transactions);
    setExporting(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-[var(--shell-text)]">
            Revenue
          </h1>
          <p className="mt-2 text-[15px] text-[var(--shell-muted)]">
            Hotel financial analytics
          </p>
        </div>

        <RevenueToolbar
          range={range}
          compareEnabled={compareEnabled}
          exporting={exporting}
          canExport={transactions.length > 0}
          onRangeChange={setRange}
          onCompareChange={setCompareEnabled}
          onExport={handleExport}
        />
      </div>

      <RevenueKpiGrid kpis={kpis} />

      <RevenueCharts
        trend={trend}
        occupancyTrend={trend}
        adrTrend={trend}
        byChannel={byChannel}
        byRoomType={byRoomType}
        monthlyComparison={monthlyComparison}
        compareEnabled={compareEnabled}
      />

      <RevenueWidgets transactions={transactions} />

      <RevenueInsights insights={insights} />

      <RevenueTransactions transactions={transactions} />
    </div>
  );
}
