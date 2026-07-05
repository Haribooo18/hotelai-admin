import { computeDashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import { PaymentsRepository } from "./payments.repository";
import type { RepositoryContext } from "./context.types";

export type RpcDashboardMetricsRow = {
  occupancy_percent: number;
  rooms_available: number;
  rooms_occupied: number;
  revenue_today: number;
  revenue_month: number;
  arrivals_today: number;
  departures_today: number;
  active_guests: number;
  active_bookings: number;
};

function mapRpcRow(row: RpcDashboardMetricsRow, leads: Lead[]): DashboardMetrics {
  const arrivalsToday = Number(row.arrivals_today);
  const departuresToday = Number(row.departures_today);

  return {
    occupancyPercent: Number(row.occupancy_percent),
    revenueToday: Number(row.revenue_today),
    revenueMonth: Number(row.revenue_month),
    arrivalsToday,
    departuresToday,
    activeGuests: Number(row.active_guests),
    checkInsToday: arrivalsToday,
    checkOutsToday: departuresToday,
    openRequests: leads.filter((lead) => lead.status === "new").length,
    averageRating: null,
  };
}

type DashboardFallbackData = {
  bookings: Booking[];
  rooms: Room[];
  leads: Lead[];
};

async function resolveFallbackData(
  fallbackData: DashboardFallbackData | Promise<DashboardFallbackData>
): Promise<DashboardFallbackData> {
  return Promise.resolve(fallbackData);
}

async function computeFallbackMetrics(
  ctx: RepositoryContext,
  data: DashboardFallbackData
): Promise<DashboardMetrics> {
  const base = computeDashboardMetrics(data.bookings, data.rooms, data.leads);
  const paymentsRepo = new PaymentsRepository(ctx);
  const [revenueToday, revenueMonth] = await Promise.all([
    paymentsRepo.resolveRevenueToday(data.bookings),
    paymentsRepo.resolveRevenueMonth(data.bookings),
  ]);

  return {
    ...base,
    revenueToday,
    revenueMonth,
  };
}

export async function getDashboardMetrics(
  ctx: RepositoryContext,
  fallbackData: DashboardFallbackData | Promise<DashboardFallbackData>
): Promise<DashboardMetrics> {
  const dataPromise = resolveFallbackData(fallbackData);
  const rpcPromise = ctx.supabase.rpc("dashboard_metrics", {
    p_hotel_id: ctx.hotelId,
  });

  const [data, rpcResult] = await Promise.all([dataPromise, rpcPromise]);

  if (rpcResult.error || rpcResult.data == null) {
    return computeFallbackMetrics(ctx, data);
  }

  const row = (Array.isArray(rpcResult.data) ? rpcResult.data[0] : rpcResult.data) as
    | RpcDashboardMetricsRow
    | undefined;

  if (!row) {
    return computeFallbackMetrics(ctx, data);
  }

  return mapRpcRow(row, data.leads);
}
