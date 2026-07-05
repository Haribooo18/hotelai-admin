import type {
  DbInvoiceRow,
  DbPaymentRow,
  DbRefundRow,
} from "@/types/database/generated";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

export type PaymentRecord = DbPaymentRow;
export type RefundRecord = DbRefundRow;
export type InvoiceRecord = DbInvoiceRow;

export class PaymentsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

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
