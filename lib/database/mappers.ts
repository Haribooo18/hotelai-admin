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
  HousekeepingStatus,
  MaintenanceStatus,
  PaymentStatus,
} from "@/types/database/generated";

export type DbRoomRowWithType = DbRoomRow & {
  room_types?: { name: string } | { name: string }[] | null;
};

export function paymentStatusFromBookingStatus(status: string): PaymentStatus {
  if (status === "cancelled") return "cancelled";
  if (status === "checked_in" || status === "checked_out") return "paid";
  return "pending";
}

export function resolvePaymentStatus(row: DbBookingRow): PaymentStatus {
  if (row.payment_status) {
    return row.payment_status;
  }

  return paymentStatusFromBookingStatus(row.status);
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
  const isVip =
    row.vip !== null && row.vip !== undefined ? row.vip : row.is_vip;
  const totalBookings =
    row.total_stays !== null && row.total_stays !== undefined
      ? row.total_stays
      : row.total_bookings;
  const totalSpent =
    row.lifetime_revenue !== null && row.lifetime_revenue !== undefined
      ? Number(row.lifetime_revenue)
      : Number(row.total_spent);

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
    is_vip: isVip,
    is_favorite: row.is_favorite,
    avatar_url: row.avatar_url,
    total_bookings: totalBookings,
    total_spent: totalSpent,
    deleted_at: row.deleted_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function resolveRoomTypeName(row: {
  room_type: string;
  room_type_id?: string | null;
  room_types?: { name: string } | { name: string }[] | null;
}): string {
  const joinedType = Array.isArray(row.room_types)
    ? row.room_types[0]?.name
    : row.room_types?.name;

  return row.room_type_id && joinedType ? joinedType : row.room_type;
}

export function toRoom(row: DbRoomRowWithType): Room {
  return {
    id: row.id,
    hotel_id: row.hotel_id,
    room_type: resolveRoomTypeName(row),
    capacity: row.capacity,
    price: Number(row.price),
  };
}

export function resolveHousekeepingStatus(
  row: Pick<DbRoomRow, "housekeeping_status">
): HousekeepingStatus {
  return row.housekeeping_status ?? "clean";
}

export function resolveMaintenanceStatus(
  row: Pick<DbRoomRow, "maintenance_status">
): MaintenanceStatus {
  return row.maintenance_status ?? "operational";
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

type KnowledgeMetricsInput = {
  status: string;
  priority: string;
  tags: string[];
  search_keywords: string[];
  content: string;
  is_pinned: boolean;
};

export function resolveKnowledgeMetrics(
  row: KnowledgeMetricsInput,
  existing?: Pick<
    DbKnowledgeArticleRow,
    "quality_score" | "ai_indexed" | "usage_count"
  > | null,
  options?: { forceAiIndexed?: boolean }
): {
  quality_score: number;
  ai_indexed: boolean;
  usage_count: number;
} {
  const computed = computeKnowledgeQualityScore(row);

  let aiIndexed =
    existing?.ai_indexed ??
    (row.status === "published");

  if (options?.forceAiIndexed === true) {
    aiIndexed = true;
  } else if (options?.forceAiIndexed === false) {
    aiIndexed = false;
  }

  return {
    quality_score: existing?.quality_score ?? computed,
    ai_indexed: aiIndexed,
    usage_count: existing?.usage_count ?? 0,
  };
}

export function guestLegacyWriteFields(row: {
  is_vip: boolean;
  total_bookings?: number;
  total_spent?: number;
  language?: string;
  marketing_opt_in?: boolean;
}) {
  const totalBookings = row.total_bookings ?? 0;
  const totalSpent = row.total_spent ?? 0;

  return {
    is_vip: row.is_vip,
    vip: row.is_vip,
    total_bookings: totalBookings,
    total_stays: totalBookings,
    total_spent: totalSpent,
    lifetime_revenue: totalSpent,
    language: row.language ?? "ru",
    marketing_opt_in: row.marketing_opt_in ?? false,
  };
}

export function bookingNormalizedWriteFields(input: {
  status: string;
  booking_source?: string;
  special_requests?: string | null;
  payment_status?: PaymentStatus | null;
}) {
  return {
    payment_status:
      input.payment_status ?? paymentStatusFromBookingStatus(input.status),
    booking_source: input.booking_source ?? "direct",
    special_requests: input.special_requests ?? null,
  };
}
