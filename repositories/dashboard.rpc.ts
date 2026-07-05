import { computeDashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

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

export async function getDashboardMetrics(
  ctx: RepositoryContext,
  bookings: Booking[],
  rooms: Room[],
  leads: Lead[]
): Promise<DashboardMetrics> {
  const { data, error } = await ctx.supabase.rpc("dashboard_metrics", {
    p_hotel_id: ctx.hotelId,
  });

  if (error || data == null) {
    return computeDashboardMetrics(bookings, rooms, leads);
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | RpcDashboardMetricsRow
    | undefined;

  if (!row) {
    return computeDashboardMetrics(bookings, rooms, leads);
  }

  return mapRpcRow(row, leads);
}
