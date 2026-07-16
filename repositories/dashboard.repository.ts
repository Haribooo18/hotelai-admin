import type { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";
import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import { BookingsRepository } from "./bookings.repository";
import { getDashboardMetrics } from "./dashboard.rpc";
import { GuestsRepository } from "./guests.repository";
import { LeadsRepository } from "./leads.repository";
import { RoomsRepository } from "./rooms.repository";
import type { RepositoryContext } from "./context.types";

export type DashboardData = {
  leads: Lead[];
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
};

export class DashboardRepository {
  private readonly bookings: BookingsRepository;
  private readonly rooms: RoomsRepository;
  private readonly guests: GuestsRepository;
  private readonly leads: LeadsRepository;

  constructor(private readonly ctx: RepositoryContext) {
    this.bookings = new BookingsRepository(ctx);
    this.rooms = new RoomsRepository(ctx);
    this.guests = new GuestsRepository(ctx);
    this.leads = new LeadsRepository(ctx);
  }

  async load(limit = 50): Promise<DashboardData> {
    const [leads, bookings, rooms, guests] = await Promise.all([
      this.leads.getAll(limit),
      this.bookings.getAll(),
      this.rooms.getAll(),
      this.guests.getAll(),
    ]);

    return { leads, bookings, rooms, guests };
  }

  async getMetrics(
    data: DashboardData | Promise<DashboardData>
  ): Promise<DashboardMetrics> {
    return getDashboardMetrics(this.ctx, data);
  }

  async getMetricsForCurrentHotel(): Promise<DashboardMetrics> {
    const dataPromise = this.load();
    return this.getMetrics(dataPromise);
  }
}
