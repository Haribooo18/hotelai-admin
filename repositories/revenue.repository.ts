import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  defaultRevenueRange,
  type RevenueBreakdownPoint,
  type RevenueDateRange,
  type RevenueForecastPoint,
  type RevenueKpis,
  type RevenueTrendPoint,
} from "@/components/dashboard/revenue/revenue-metrics";

import { BookingsRepository } from "./bookings.repository";
import { RoomsRepository } from "./rooms.repository";
import {
  getRevenueBreakdown,
  getRevenueForecast,
  getRevenueMetrics,
  getRevenueTrend,
  type RevenueBreakdown,
  type RevenueFallbackData,
} from "./revenue.rpc";
import type { RepositoryContext } from "./context.types";

export type RevenueData = {
  bookings: Booking[];
  rooms: Room[];
  range: RevenueDateRange;
};

export type { RevenueBreakdown };

export class RevenueRepository {
  private readonly bookings: BookingsRepository;
  private readonly rooms: RoomsRepository;

  constructor(private readonly ctx: RepositoryContext) {
    this.bookings = new BookingsRepository(ctx);
    this.rooms = new RoomsRepository(ctx);
  }

  async load(range: RevenueDateRange = defaultRevenueRange()): Promise<RevenueData> {
    const [bookings, rooms] = await Promise.all([
      this.bookings.getAll(),
      this.rooms.getAll(),
    ]);

    return { bookings, rooms, range };
  }

  private toFallbackPayload(
    data: RevenueData | Promise<RevenueData>
  ): RevenueFallbackData | Promise<RevenueFallbackData> {
    return Promise.resolve(data);
  }

  async getMetrics(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueKpis> {
    return getRevenueMetrics(this.ctx, this.toFallbackPayload(data));
  }

  async getTrend(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueTrendPoint[]> {
    return getRevenueTrend(this.ctx, this.toFallbackPayload(data));
  }

  async getBreakdown(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueBreakdown> {
    return getRevenueBreakdown(this.ctx, this.toFallbackPayload(data));
  }

  async getForecast(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueForecastPoint[]> {
    return getRevenueForecast(this.ctx, this.toFallbackPayload(data));
  }

  async getByRoomType(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueBreakdownPoint[]> {
    const breakdown = await this.getBreakdown(data);
    return breakdown.byRoomType;
  }

  async getBySource(
    data: RevenueData | Promise<RevenueData>
  ): Promise<RevenueBreakdownPoint[]> {
    const breakdown = await this.getBreakdown(data);
    return breakdown.bySource;
  }
}
