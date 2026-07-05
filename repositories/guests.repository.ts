import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { DbBookingRow, DbGuestRow } from "@/types/database/generated";
import { guestLegacyWriteFields, toBooking, toGuest } from "@/lib/database/mappers";

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
  constructor(private readonly ctx: RepositoryContext) {}

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
    const legacy = guestLegacyWriteFields({
      is_vip: row.is_vip,
      total_bookings: 0,
      total_spent: 0,
    });

    const { error } = await this.ctx.supabase.from("guests").insert({
      hotel_id: this.ctx.hotelId,
      ...row,
      ...legacy,
      language: "ru",
      marketing_opt_in: false,
    });

    if (error) throwRepositoryError(error);
  }

  async update(id: string, row: GuestUpdateRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("guests")
      .update({
        ...row,
        vip: row.is_vip,
        is_vip: row.is_vip,
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
    const legacy = guestLegacyWriteFields(row);

    const { error } = await this.ctx.supabase
      .from("guests")
      .update({
        ...row,
        ...legacy,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getBookingsForGuest(guest: Guest): Promise<Booking[]> {
    const filters: string[] = [`guest_id.eq.${guest.id}`];

    if (guest.email && guest.email.trim() !== "") {
      filters.push(`guest_email.ilike.${guest.email.trim()}`);
    } else {
      filters.push(
        `guest_name.ilike.${`${guest.first_name} ${guest.last_name}`.trim()}`
      );
    }

    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .or(filters.join(","))
      .order("check_in", { ascending: false });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbBookingRow[]).map(toBooking);
  }
}
