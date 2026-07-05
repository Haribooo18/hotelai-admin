import type { Booking } from "@/types/booking";
import type { DbBookingRow } from "@/types/database/generated";
import {
  paymentStatusFromBookingStatus,
  toBooking,
} from "@/lib/database/mappers";

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
  adults?: number;
  children?: number;
  booking_source?: string;
  special_requests?: string | null;
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

  private async resolveGuestId(
    guestEmail: string | null,
    guestName: string
  ): Promise<string | null> {
    if (guestEmail && guestEmail.trim() !== "") {
      const { data, error } = await this.ctx.supabase
        .from("guests")
        .select("id")
        .eq("hotel_id", this.ctx.hotelId)
        .is("deleted_at", null)
        .ilike("email", guestEmail.trim())
        .maybeSingle();

      if (error) throwRepositoryError(error);
      if (data?.id) return data.id as string;
    }

    const { data, error } = await this.ctx.supabase
      .from("guests")
      .select("id")
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .ilike("first_name", guestName.split(" ")[0] ?? guestName)
      .limit(1)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data?.id as string | undefined) ?? null;
  }

  async getAll(): Promise<Booking[]> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .order("check_in", { ascending: false });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbBookingRow[]).map(toBooking);
  }

  async getById(id: string): Promise<Booking | null> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return data ? toBooking(data as DbBookingRow) : null;
  }

  async create(row: BookingInsertRow): Promise<{ id: string; total_price: number }> {
    const status = row.status ?? "confirmed";
    const guestId = await this.resolveGuestId(row.guest_email, row.guest_name);

    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .insert({
        hotel_id: this.ctx.hotelId,
        room_id: row.room_id,
        guest_id: guestId,
        guest_name: row.guest_name,
        guest_email: row.guest_email,
        guest_phone: row.guest_phone,
        check_in: row.check_in,
        check_out: row.check_out,
        adults: row.adults ?? 1,
        children: row.children ?? 0,
        total_price: row.total_price,
        status,
        payment_status: paymentStatusFromBookingStatus(status),
        booking_source: row.booking_source ?? "direct",
        special_requests: row.special_requests ?? null,
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
    const guestId = await this.resolveGuestId(row.guest_email, row.guest_name);

    const { error } = await this.ctx.supabase
      .from("bookings")
      .update({
        ...row,
        guest_id: guestId,
      })
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
