import type { Booking } from "@/types/booking";
import type { DbBookingRow } from "@/types/database/generated";
import {
  bookingNormalizedWriteFields,
  toBooking,
} from "@/lib/database/mappers";

import { PaymentsRepository } from "./payments.repository";
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

type GuestLink = {
  guest_id: string | null;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
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

const BOOKING_SELECT = "*";

export class BookingsRepository {
  private readonly payments: PaymentsRepository;

  constructor(private readonly ctx: RepositoryContext) {
    this.payments = new PaymentsRepository(ctx);
  }

  private async requireRoomInTenant(roomId: string): Promise<void> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("id")
      .eq("id", roomId)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);
    if (!data) {
      throw new Error("Номер не найден");
    }
  }

  private async getGuestById(guestId: string): Promise<GuestLink | null> {
    const { data, error } = await this.ctx.supabase
      .from("guests")
      .select("id, first_name, last_name, email, phone")
      .eq("id", guestId)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throwRepositoryError(error);
    if (!data?.id) return null;

    return {
      guest_id: data.id as string,
      guest_name: `${data.first_name as string} ${data.last_name as string}`.trim(),
      guest_email: (data.email as string | null) ?? null,
      guest_phone: (data.phone as string | null) ?? null,
    };
  }

  private async resolveGuestIdByLegacyMatch(
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

  private async resolveGuestLink(
    guestEmail: string | null,
    guestName: string,
    guestPhone: string | null,
    existingGuestId?: string | null
  ): Promise<GuestLink> {
    if (existingGuestId) {
      const linked = await this.getGuestById(existingGuestId);
      if (linked) {
        return {
          guest_id: linked.guest_id,
          guest_name: linked.guest_name || guestName,
          guest_email: linked.guest_email ?? guestEmail,
          guest_phone: linked.guest_phone ?? guestPhone,
        };
      }
    }

    const guestId = await this.resolveGuestIdByLegacyMatch(guestEmail, guestName);
    if (guestId) {
      const linked = await this.getGuestById(guestId);
      if (linked) {
        return {
          guest_id: linked.guest_id,
          guest_name: linked.guest_name || guestName,
          guest_email: linked.guest_email ?? guestEmail,
          guest_phone: linked.guest_phone ?? guestPhone,
        };
      }
    }

    return {
      guest_id: guestId,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
    };
  }

  private async mapBookings(rows: DbBookingRow[]): Promise<Booking[]> {
    const paymentTotals = await this.payments.getPaymentTotalsByBookingIds(
      rows.map((row) => row.id)
    );

    return rows.map((row) => {
      const paymentTotal = paymentTotals.get(row.id);
      return toBooking({
        ...row,
        total_price: paymentTotal ?? row.total_price,
      });
    });
  }

  private async getRawById(id: string): Promise<DbBookingRow | null> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select(BOOKING_SELECT)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as DbBookingRow | null) ?? null;
  }

  async getAll(): Promise<Booking[]> {
    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .select(BOOKING_SELECT)
      .eq("hotel_id", this.ctx.hotelId)
      .order("check_in", { ascending: false });

    if (error) throwRepositoryError(error);

    return this.mapBookings((data ?? []) as DbBookingRow[]);
  }

  async getById(id: string): Promise<Booking | null> {
    const row = await this.getRawById(id);
    if (!row) return null;

    const [booking] = await this.mapBookings([row]);
    return booking ?? null;
  }

  async create(row: BookingInsertRow): Promise<{ id: string; total_price: number }> {
    await this.requireRoomInTenant(row.room_id);

    const status = row.status ?? "confirmed";
    const guestLink = await this.resolveGuestLink(
      row.guest_email,
      row.guest_name,
      row.guest_phone
    );
    const normalized = bookingNormalizedWriteFields({
      status,
      booking_source: row.booking_source,
      special_requests: row.special_requests,
    });

    const { data, error } = await this.ctx.supabase
      .from("bookings")
      .insert({
        hotel_id: this.ctx.hotelId,
        room_id: row.room_id,
        guest_id: guestLink.guest_id,
        guest_name: guestLink.guest_name,
        guest_email: guestLink.guest_email,
        guest_phone: guestLink.guest_phone,
        check_in: row.check_in,
        check_out: row.check_out,
        adults: row.adults ?? 1,
        children: row.children ?? 0,
        total_price: row.total_price,
        status,
        ...normalized,
      })
      .select("id, total_price")
      .single();

    if (error) throwRepositoryError(error);

    const totalPrice = await this.payments.resolveBookingTotalPrice(
      data.id as string,
      data.total_price as number
    );

    return {
      id: data.id as string,
      total_price: totalPrice,
    };
  }

  async update(id: string, row: BookingUpdateRow): Promise<void> {
    await this.requireRoomInTenant(row.room_id);

    const existing = await this.getRawById(id);
    const guestLink = await this.resolveGuestLink(
      row.guest_email,
      row.guest_name,
      row.guest_phone,
      existing?.guest_id
    );
    const normalized = bookingNormalizedWriteFields({
      status: existing?.status ?? "confirmed",
      booking_source: existing?.booking_source,
      special_requests: existing?.special_requests,
      payment_status: existing?.payment_status ?? null,
    });

    const { error } = await this.ctx.supabase
      .from("bookings")
      .update({
        room_id: row.room_id,
        guest_id: guestLink.guest_id,
        guest_name: guestLink.guest_name,
        guest_email: guestLink.guest_email,
        guest_phone: guestLink.guest_phone,
        check_in: row.check_in,
        check_out: row.check_out,
        total_price: row.total_price,
        ...normalized,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async reschedule(id: string, row: BookingRescheduleRow): Promise<void> {
    await this.requireRoomInTenant(row.room_id);

    const existing = await this.getRawById(id);
    const normalized = bookingNormalizedWriteFields({
      status: existing?.status ?? "confirmed",
      booking_source: existing?.booking_source,
      special_requests: existing?.special_requests,
      payment_status: existing?.payment_status ?? null,
    });

    const { error } = await this.ctx.supabase
      .from("bookings")
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
