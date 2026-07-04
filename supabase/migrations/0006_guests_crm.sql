-- HotelAI — Sprint 4: Guest CRM schema extensions
--
-- Adds CRM columns to guests: tags, VIP/favorite flags, avatar, soft delete.
-- Safe/idempotent: additive columns with defaults, guarded index creation.
-- No booking linkage column is added; the app matches a guest's booking
-- history by email/name because bookings store inline guest fields.

begin;

-- =========================================================================
-- 1. CRM columns
-- =========================================================================
alter table public.guests
  add column if not exists tags text[] not null default '{}',
  add column if not exists is_vip boolean not null default false,
  add column if not exists is_favorite boolean not null default false,
  add column if not exists avatar_url text,
  add column if not exists deleted_at timestamptz;

-- =========================================================================
-- 2. Indexes for CRM access patterns
-- =========================================================================
-- Active (non-deleted) guests per hotel, newest first — the default list query.
create index if not exists guests_hotel_active_created_idx
  on public.guests (hotel_id, created_at desc)
  where deleted_at is null;

-- VIP / favorite quick filters (partial, only the flagged rows).
create index if not exists guests_hotel_vip_idx
  on public.guests (hotel_id)
  where is_vip and deleted_at is null;

create index if not exists guests_hotel_favorite_idx
  on public.guests (hotel_id)
  where is_favorite and deleted_at is null;

-- Tag membership filtering.
create index if not exists guests_tags_gin_idx
  on public.guests using gin (tags);

commit;

-- Notes:
--   * The existing unique constraint guests_hotel_email_unique still applies to
--     soft-deleted rows. If you need to re-add a guest with the same email after
--     a soft delete, hard-delete the tombstone or scope the unique index with
--     `where deleted_at is null` in a future migration.
