import type {
  DbInvoiceRow,
  DbPaymentRow,
  DbRefundRow,
} from "@/types/database/generated";
import type { Booking } from "@/types/booking";

import { todayIso } from "@/lib/dashboard/date";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

export type PaymentRecord = DbPaymentRow;
export type RefundRecord = DbRefundRow;
export type InvoiceRecord = DbInvoiceRow;

const REVENUE_PAYMENT_STATUSES = ["captured", "authorized", "paid"] as const;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function sumBookingRevenue(bookings: Booking[], predicate: (booking: Booking) => boolean): number {
  return bookings
    .filter(predicate)
    .reduce((sum, booking) => sum + Number(booking.total_price), 0);
}

export class PaymentsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async hasPaymentRecords(): Promise<boolean> {
    const { count, error } = await this.ctx.supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", this.ctx.hotelId)
      .limit(1);

    if (error) {
      return false;
    }

    return (count ?? 0) > 0;
  }

  async getPaymentTotalsByBookingIds(
    bookingIds: string[]
  ): Promise<Map<string, number>> {
    const totals = new Map<string, number>();

    if (bookingIds.length === 0) {
      return totals;
    }

    const { data, error } = await this.ctx.supabase
      .from("payments")
      .select("booking_id, amount, status")
      .eq("hotel_id", this.ctx.hotelId)
      .in("booking_id", bookingIds)
      .in("status", [...REVENUE_PAYMENT_STATUSES]);

    if (error) {
      return totals;
    }

    for (const row of data ?? []) {
      const bookingId = row.booking_id as string;
      const amount = Number(row.amount);
      totals.set(bookingId, (totals.get(bookingId) ?? 0) + amount);
    }

    return totals;
  }

  async resolveBookingTotalPrice(
    bookingId: string,
    fallbackTotal: number
  ): Promise<number> {
    const totals = await this.getPaymentTotalsByBookingIds([bookingId]);
    const paymentTotal = totals.get(bookingId);

    if (paymentTotal == null) {
      return fallbackTotal;
    }

    return paymentTotal;
  }

  async resolveRevenueToday(bookings: Booking[]): Promise<number> {
    const today = todayIso();

    if (!(await this.hasPaymentRecords())) {
      return sumBookingRevenue(bookings, (booking) => booking.check_in === today);
    }

    const { data, error } = await this.ctx.supabase
      .from("payments")
      .select("amount, bookings!inner(check_in)")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("bookings.check_in", today)
      .in("status", [...REVENUE_PAYMENT_STATUSES]);

    if (error || !data) {
      return sumBookingRevenue(bookings, (booking) => booking.check_in === today);
    }

    return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  }

  async resolveRevenueMonth(bookings: Booking[]): Promise<number> {
    const currentMonth = monthKey(new Date());

    if (!(await this.hasPaymentRecords())) {
      return sumBookingRevenue(bookings, (booking) =>
        booking.check_in.startsWith(currentMonth)
      );
    }

    const [year, month] = currentMonth.split("-").map(Number);
    const nextMonthStart =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, "0")}-01`;

    const { data, error } = await this.ctx.supabase
      .from("payments")
      .select("amount, bookings!inner(check_in)")
      .eq("hotel_id", this.ctx.hotelId)
      .gte("bookings.check_in", `${currentMonth}-01`)
      .lt("bookings.check_in", nextMonthStart)
      .in("status", [...REVENUE_PAYMENT_STATUSES]);

    if (error || !data) {
      return sumBookingRevenue(bookings, (booking) =>
        booking.check_in.startsWith(currentMonth)
      );
    }

    return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  }

  async getPaymentsForBooking(bookingId: string): Promise<PaymentRecord[]> {
    const { data, error } = await this.ctx.supabase
      .from("payments")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return (data ?? []) as PaymentRecord[];
  }

  async getInvoicesForBooking(bookingId: string): Promise<InvoiceRecord[]> {
    const { data, error } = await this.ctx.supabase
      .from("invoices")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return (data ?? []) as InvoiceRecord[];
  }

  async getRefundsForPayment(paymentId: string): Promise<RefundRecord[]> {
    const { data, error } = await this.ctx.supabase
      .from("refunds")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("payment_id", paymentId)
      .order("created_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return (data ?? []) as RefundRecord[];
  }
}
