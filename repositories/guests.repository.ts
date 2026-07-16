import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { DbBookingRow, DbGuestRow } from "@/types/database/generated";
import { guestLegacyWriteFields, toBooking, toGuest } from "@/lib/database/mappers";

import { PaymentsRepository } from "./payments.repository";
import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

type GuestInsertRow = {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  notes: string | null;
  avatar_url: string | null;
  tags: string[];
  is_vip: boolean;
  is_favorite: boolean;
};

type GuestUpdateRow = GuestInsertRow;

type GuestMergeUpdateRow = {
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  notes: string | null;
  tags: string[];
  is_vip: boolean;
  is_favorite: boolean;
  total_bookings: number;
  total_spent: number;
};

export class GuestsRepository {
  private readonly payments: PaymentsRepository;

  constructor(private readonly ctx: RepositoryContext) {
    this.payments = new PaymentsRepository(ctx);
  }

  private async mapBookings(rows: DbBookingRow[]): Promise<Booking[]> {
    const paymentTotals = await this.payments.getPaymentTotalsByBookingIds(
      rows.map((row) => row.id)
    );

    return rows.map((row) =>
      toBooking({
        ...row,
        total_price: paymentTotals.get(row.id) ?? row.total_price,
      })
    );
  }

  async getAll(): Promise<Guest[]> {
    const { data, error } = await this.ctx.supabase
      .from("guests")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbGuestRow[]).map(toGuest);
  }

  async getById(id: string): Promise<Guest | null> {
    const { data, error } = await this.ctx.supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return data ? toGuest(data as DbGuestRow) : null;
  }

  async getByIds(ids: string[]): Promise<Guest[]> {
    const { data, error } = await this.ctx.supabase
      .from("guests")
      .select("*")
      .in("id", ids)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null);

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbGuestRow[]).map(toGuest);
  }

  async create(row: GuestInsertRow): Promise<void> {
    const normalized = guestLegacyWriteFields({
      is_vip: row.is_vip,
      total_bookings: 0,
      total_spent: 0,
    });

    const { error } = await this.ctx.supabase.from("guests").insert({
      hotel_id: this.ctx.hotelId,
      ...row,
      ...normalized,
    });

    if (error) throwRepositoryError(error);
  }

  async update(id: string, row: GuestUpdateRow): Promise<void> {
    const normalized = guestLegacyWriteFields({
      is_vip: row.is_vip,
    });

    const { error } = await this.ctx.supabase
      .from("guests")
      .update({
        ...row,
        ...normalized,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("guests")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async setFavorite(id: string, value: boolean): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("guests")
      .update({ is_favorite: value })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async setVip(id: string, value: boolean): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("guests")
      .update({ is_vip: value, vip: value })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async updateMergedGuest(id: string, row: GuestMergeUpdateRow): Promise<void> {
    const normalized = guestLegacyWriteFields(row);

    const { error } = await this.ctx.supabase
      .from("guests")
      .update({
        ...row,
        ...normalized,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getBookingsForGuest(guest: Guest): Promise<Booking[]> {
    const { data: byGuestId, error: byGuestIdError } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("guest_id", guest.id)
      .order("check_in", { ascending: false });

    if (byGuestIdError) throwRepositoryError(byGuestIdError);

    if ((byGuestId ?? []).length > 0) {
      return this.mapBookings((byGuestId ?? []) as DbBookingRow[]);
    }

    let query = this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId);

    if (guest.email && guest.email.trim() !== "") {
      query = query.ilike("guest_email", guest.email.trim());
    } else {
      query = query.ilike(
        "guest_name",
        `${guest.first_name} ${guest.last_name}`.trim()
      );
    }

    const { data, error } = await query.order("check_in", { ascending: false });

    if (error) throwRepositoryError(error);

    return this.mapBookings((data ?? []) as DbBookingRow[]);
  }
}
