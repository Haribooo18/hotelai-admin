import type { Booking } from "@/types/booking";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

type BookingConflictRow = {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
};

type BookingInsertRow = {
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  status?: string;
};

type BookingUpdateRow = {
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
};

type BookingRescheduleRow = {
  room_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
};

export class BookingsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async getAll(): Promise<Booking[]> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .order("check_in", { ascending: false });

    if (error) throwRepositoryError(error);

    return (data ?? []) as Booking[];
  }

  async getById(id: string): Promise<Booking | null> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as Booking | null) ?? null;
  }

  async create(row: BookingInsertRow): Promise<{ id: string; total_price: number }> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .insert({
        hotel_id: this.ctx.hotelId,
        ...row,
        status: row.status ?? "confirmed",
      })
      .select("id, total_price")
      .single();

    if (error) throwRepositoryError(error);

    return {
      id: data.id as string,
      total_price: data.total_price as number,
    };
  }

  async update(id: string, row: BookingUpdateRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("bookings")
      .update(row)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async reschedule(id: string, row: BookingRescheduleRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("bookings")
      .update(row)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getRoomPrice(roomId: string): Promise<number> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("price")
      .eq("id", roomId)
      .eq("hotel_id", this.ctx.hotelId)
      .single();

    if (error) throwRepositoryError(error);

    return Number(data.price);
  }

  async findAvailabilityConflicts(
    roomId: string,
    bookingId?: string
  ): Promise<BookingConflictRow[]> {
    let query = this.ctx.supabase
      .from("bookings")
      .select("id, guest_name, check_in, check_out")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("room_id", roomId)
      .neq("status", "cancelled");

    if (bookingId) {
      query = query.neq("id", bookingId);
    }

    const { data, error } = await query;

    if (error) throwRepositoryError(error);

    return (data ?? []) as BookingConflictRow[];
  }
}
