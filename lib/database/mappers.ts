import type { Booking, BookingStatus } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";
import type {
  KnowledgeArticle,
  KnowledgeArticlePriority,
  KnowledgeArticleStatus,
} from "@/types/knowledge-article";

import type {
  DbBookingRow,
  DbGuestRow,
  DbKnowledgeArticleRow,
  DbRoomRow,
  PaymentStatus,
} from "@/types/database/generated";

export function paymentStatusFromBookingStatus(status: string): PaymentStatus {
  if (status === "cancelled") return "cancelled";
  if (status === "checked_in" || status === "checked_out") return "paid";
  return "pending";
}

export function toBooking(row: DbBookingRow): Booking {
  return {
    id: row.id,
    hotel_id: row.hotel_id,
    room_id: row.room_id,
    guest_name: row.guest_name,
    guest_email: row.guest_email,
    guest_phone: row.guest_phone,
    check_in: row.check_in,
    check_out: row.check_out,
    adults: row.adults,
    children: row.children,
    total_price: Number(row.total_price),
    status: row.status as BookingStatus,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function toGuest(row: DbGuestRow): Guest {
  return {
    id: row.id,
    hotel_id: row.hotel_id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    city: row.city,
    notes: row.notes,
    tags: row.tags ?? [],
    is_vip: row.vip ?? row.is_vip,
    is_favorite: row.is_favorite,
    avatar_url: row.avatar_url,
    total_bookings: row.total_stays ?? row.total_bookings,
    total_spent: Number(row.lifetime_revenue ?? row.total_spent),
    deleted_at: row.deleted_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function toRoom(row: DbRoomRow): Room {
  return {
    id: row.id,
    hotel_id: row.hotel_id,
    room_type: row.room_type,
    capacity: row.capacity,
    price: Number(row.price),
  };
}

export function toKnowledgeArticle(row: DbKnowledgeArticleRow): KnowledgeArticle {
  return {
    id: row.id,
    hotel_id: row.hotel_id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    category: row.category,
    language: row.language,
    priority: row.priority as KnowledgeArticlePriority,
    status: row.status as KnowledgeArticleStatus,
    version: row.version,
    is_pinned: row.is_pinned,
    tags: row.tags ?? [],
    search_keywords: row.search_keywords ?? [],
    created_by: row.created_by,
    updated_by: row.updated_by,
    deleted_at: row.deleted_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function computeKnowledgeQualityScore(input: {
  status: string;
  priority: string;
  tags: string[];
  search_keywords: string[];
  content: string;
  is_pinned: boolean;
}): number {
  const score =
    (input.status === "published" ? 25 : 0) +
    (input.priority === "high" ? 20 : input.priority === "normal" ? 10 : 5) +
    Math.min(20, (input.tags?.length ?? 0) * 4) +
    Math.min(15, (input.search_keywords?.length ?? 0) * 3) +
    Math.min(20, Math.floor((input.content?.length ?? 0) / 500)) +
    (input.is_pinned ? 5 : 0);

  return Math.min(100, Math.max(0, score));
}

export function guestLegacyWriteFields(row: {
  is_vip: boolean;
  total_bookings?: number;
  total_spent?: number;
}) {
  return {
    is_vip: row.is_vip,
    vip: row.is_vip,
    total_bookings: row.total_bookings ?? 0,
    total_stays: row.total_bookings ?? 0,
    total_spent: row.total_spent ?? 0,
    lifetime_revenue: row.total_spent ?? 0,
  };
}
