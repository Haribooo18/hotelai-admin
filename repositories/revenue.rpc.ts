import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  buildRevenueByRoomType,
  buildRevenueBySource,
  buildRevenueForecast,
  buildRevenueTrend,
  computeRevenueKpis,
  defaultRevenueRange,
  type RevenueBreakdownPoint,
  type RevenueDateRange,
  type RevenueForecastPoint,
  type RevenueKpis,
  type RevenueTrendPoint,
} from "@/components/dashboard/revenue/revenue-metrics";
import {
  derivePaymentStatus,
  type BookingPaymentStatus,
} from "@/components/dashboard/bookings/booking-ops-metrics";

import type { RepositoryContext } from "./context.types";

export type RevenueFallbackData = {
  bookings: Booking[];
  rooms: Room[];
  range: RevenueDateRange;
};

export type RevenueBreakdown = {
  byRoomType: RevenueBreakdownPoint[];
  bySource: RevenueBreakdownPoint[];
  byPaymentStatus: RevenueBreakdownPoint[];
};

type RpcRevenueMetricsRow = {
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  adr: number;
  revpar: number;
  occupancy: number;
  average_stay: number;
  cancellation_rate: number;
  arrivals: number;
  departures: number;
  active_bookings: number;
};

type RpcRevenueTrendRow = {
  date: string;
  revenue: number;
  adr: number;
  revpar: number;
  occupancy: number;
};

type RpcRevenueBreakdownRow = {
  category: string;
  label: string;
  value: number;
};

type RpcRevenueForecastRow = {
  date: string;
  projected: number;
};

const PAYMENT_STATUS_LABELS: Record<BookingPaymentStatus, string> = {
  paid: "Paid",
  deposit: "Deposit",
  pending: "Pending",
  void: "Void",
};

function formatTrendLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

function formatForecastLabel(date: string): string {
  return formatTrendLabel(date);
}

async function resolveFallbackData(
  fallbackData: RevenueFallbackData | Promise<RevenueFallbackData>
): Promise<RevenueFallbackData> {
  return Promise.resolve(fallbackData);
}

function fallbackMetrics(data: RevenueFallbackData): RevenueKpis {
  return computeRevenueKpis(data.bookings, data.rooms, data.range);
}

function fallbackTrend(data: RevenueFallbackData): RevenueTrendPoint[] {
  return buildRevenueTrend(data.bookings, data.rooms, data.range);
}

function fallbackBreakdown(data: RevenueFallbackData): RevenueBreakdown {
  const byRoomType = buildRevenueByRoomType(
    data.bookings,
    data.rooms,
    data.range
  );
  const bySource = buildRevenueBySource(data.bookings, data.range);
  const byPaymentStatus = buildRevenueByPaymentStatus(data.bookings, data.range);

  return { byRoomType, bySource, byPaymentStatus };
}

function buildRevenueByPaymentStatus(
  bookings: Booking[],
  range: RevenueDateRange
): RevenueBreakdownPoint[] {
  const totals = new Map<BookingPaymentStatus, number>();

  for (const booking of bookings) {
    if (booking.check_in < range.from || booking.check_in > range.to) continue;
    if (booking.status === "cancelled") continue;

    const status = derivePaymentStatus(booking);
    totals.set(status, (totals.get(status) ?? 0) + Number(booking.total_price));
  }

  return (["paid", "deposit", "pending", "void"] as BookingPaymentStatus[])
    .map((status) => ({
      label: PAYMENT_STATUS_LABELS[status],
      value: totals.get(status) ?? 0,
    }))
    .filter((item) => item.value > 0);
}

function fallbackForecast(data: RevenueFallbackData): RevenueForecastPoint[] {
  const trend = fallbackTrend(data);
  return buildRevenueForecast(trend);
}

function mapMetricsRow(row: RpcRevenueMetricsRow): RevenueKpis {
  return {
    revenueToday: Number(row.revenue_today),
    revenueWeek: Number(row.revenue_week),
    revenueMonth: Number(row.revenue_month),
    adr: Number(row.adr),
    revpar: Number(row.revpar),
    occupancy: Number(row.occupancy),
    averageStay: Number(row.average_stay),
    cancellationRate: Number(row.cancellation_rate),
  };
}

function mapTrendRows(rows: RpcRevenueTrendRow[]): RevenueTrendPoint[] {
  return rows.map((row) => ({
    date: row.date,
    label: formatTrendLabel(row.date),
    revenue: Number(row.revenue),
    occupancy: Number(row.occupancy),
    adr: Number(row.adr),
    revpar: Number(row.revpar),
  }));
}

function mapBreakdownRows(rows: RpcRevenueBreakdownRow[]): RevenueBreakdown {
  const byRoomType = rows
    .filter((row) => row.category === "room_type")
    .map((row) => ({ label: row.label, value: Number(row.value) }))
    .sort((a, b) => b.value - a.value);

  const bySource = rows
    .filter((row) => row.category === "booking_source")
    .map((row) => ({ label: row.label, value: Number(row.value) }))
    .filter((item) => item.value > 0);

  const byPaymentStatus = rows
    .filter((row) => row.category === "payment_status")
    .map((row) => ({ label: row.label, value: Number(row.value) }))
    .filter((item) => item.value > 0);

  return { byRoomType, bySource, byPaymentStatus };
}

function mapForecastRows(rows: RpcRevenueForecastRow[]): RevenueForecastPoint[] {
  return rows.map((row) => ({
    date: row.date,
    label: formatForecastLabel(row.date),
    projected: Number(row.projected),
  }));
}

export async function getRevenueMetrics(
  ctx: RepositoryContext,
  fallbackData: RevenueFallbackData | Promise<RevenueFallbackData>
): Promise<RevenueKpis> {
  const dataPromise = resolveFallbackData(fallbackData);
  const data = await dataPromise;

  const { data: rpcData, error } = await ctx.supabase.rpc("revenue_metrics", {
    p_hotel_id: ctx.hotelId,
    p_from: data.range.from,
    p_to: data.range.to,
  });

  if (error || rpcData == null) {
    return fallbackMetrics(data);
  }

  const row = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as
    | RpcRevenueMetricsRow
    | undefined;

  if (!row) {
    return fallbackMetrics(data);
  }

  return mapMetricsRow(row);
}

export async function getRevenueTrend(
  ctx: RepositoryContext,
  fallbackData: RevenueFallbackData | Promise<RevenueFallbackData>
): Promise<RevenueTrendPoint[]> {
  const dataPromise = resolveFallbackData(fallbackData);
  const data = await dataPromise;

  const { data: rpcData, error } = await ctx.supabase.rpc("revenue_trend", {
    p_hotel_id: ctx.hotelId,
    p_from: data.range.from,
    p_to: data.range.to,
  });

  if (error || rpcData == null) {
    return fallbackTrend(data);
  }

  const rows = (rpcData ?? []) as RpcRevenueTrendRow[];
  if (rows.length === 0) {
    return fallbackTrend(data);
  }

  return mapTrendRows(rows);
}

export async function getRevenueBreakdown(
  ctx: RepositoryContext,
  fallbackData: RevenueFallbackData | Promise<RevenueFallbackData>
): Promise<RevenueBreakdown> {
  const dataPromise = resolveFallbackData(fallbackData);
  const data = await dataPromise;

  const { data: rpcData, error } = await ctx.supabase.rpc("revenue_breakdown", {
    p_hotel_id: ctx.hotelId,
    p_from: data.range.from,
    p_to: data.range.to,
  });

  if (error || rpcData == null) {
    return fallbackBreakdown(data);
  }

  const rows = (rpcData ?? []) as RpcRevenueBreakdownRow[];
  if (rows.length === 0) {
    return fallbackBreakdown(data);
  }

  return mapBreakdownRows(rows);
}

export async function getRevenueForecast(
  ctx: RepositoryContext,
  fallbackData: RevenueFallbackData | Promise<RevenueFallbackData>
): Promise<RevenueForecastPoint[]> {
  const data = await resolveFallbackData(fallbackData);

  const { data: rpcData, error } = await ctx.supabase.rpc("revenue_forecast", {
    p_hotel_id: ctx.hotelId,
  });

  if (error || rpcData == null) {
    return fallbackForecast(data);
  }

  const rows = (rpcData ?? []) as RpcRevenueForecastRow[];
  if (rows.length === 0) {
    return fallbackForecast(data);
  }

  return mapForecastRows(rows);
}

export function createDefaultRevenueData(
  bookings: Booking[],
  rooms: Room[]
): RevenueFallbackData {
  return {
    bookings,
    rooms,
    range: defaultRevenueRange(),
  };
}
