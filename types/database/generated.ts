/**
 * Generated-style database row types for Supabase `public` schema.
 * Regenerate when migrations change (Phase 3 normalization).
 */

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "refunded"
  | "cancelled";

export type BookingSource =
  | "direct"
  | "website"
  | "phone"
  | "walk_in"
  | "ota"
  | "ai"
  | "other";

export type HousekeepingStatus = "clean" | "dirty" | "inspecting" | "out_of_order";

export type MaintenanceStatus = "operational" | "maintenance" | "blocked";

export type DbBookingRow = {
  id: string;
  hotel_id: string;
  room_id: string;
  guest_id: string | null;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_price: number;
  status: string;
  payment_status: PaymentStatus;
  booking_source: BookingSource;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
};

export type DbGuestRow = {
  id: string;
  hotel_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  notes: string | null;
  language: string;
  marketing_opt_in: boolean;
  vip: boolean;
  lifetime_revenue: number;
  total_stays: number;
  tags: string[];
  is_vip: boolean;
  is_favorite: boolean;
  avatar_url: string | null;
  total_bookings: number;
  total_spent: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRoomRow = {
  id: string;
  hotel_id: string;
  room_type: string;
  room_type_id: string | null;
  capacity: number;
  price: number;
  housekeeping_status: HousekeepingStatus;
  maintenance_status: MaintenanceStatus;
  floor: number | null;
};

export type DbKnowledgeArticleRow = {
  id: string;
  hotel_id: string;
  title: string;
  slug: string | null;
  content: string;
  category: string | null;
  language: string;
  priority: string;
  status: string;
  version: number;
  is_pinned: boolean;
  tags: string[];
  search_keywords: string[];
  ai_indexed: boolean;
  quality_score: number;
  usage_count: number;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbPaymentRow = {
  id: string;
  hotel_id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  provider_ref: string | null;
  captured_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRefundRow = {
  id: string;
  hotel_id: string;
  payment_id: string;
  amount: number;
  reason: string | null;
  status: string;
  processed_at: string | null;
  created_at: string;
};

export type DbInvoiceRow = {
  id: string;
  hotel_id: string;
  booking_id: string;
  payment_id: string | null;
  invoice_number: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRoomTypeRow = {
  id: string;
  hotel_id: string;
  name: string;
  created_at: string;
};
