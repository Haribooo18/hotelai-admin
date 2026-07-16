-- HotelAI — Phase 3: Production schema normalization (additive only)
--
-- Adds normalized columns and revenue tables. Old columns remain in place.
-- Backfill runs in 0013_schema_normalization_backfill.sql.

begin;

-- =========================================================================
-- 1. room_types (reference for rooms.room_type_id)
-- =========================================================================
create table if not exists public.room_types (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    text not null references public.hotels (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  constraint room_types_hotel_name_unique unique (hotel_id, name)
);

create index if not exists room_types_hotel_id_idx
  on public.room_types (hotel_id, name);

-- =========================================================================
-- 2. bookings — normalized guest link + payment/source metadata
-- =========================================================================
alter table public.bookings
  add column if not exists guest_id uuid,
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'authorized', 'paid', 'refunded', 'cancelled')),
  add column if not exists booking_source text not null default 'direct'
    check (booking_source in ('direct', 'website', 'phone', 'walk_in', 'ota', 'ai', 'other')),
  add column if not exists special_requests text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_guest_id_fkey
      foreign key (guest_id) references public.guests (id)
      on update cascade on delete set null not valid;
  end if;
end $$;

create index if not exists bookings_guest_id_idx
  on public.bookings (hotel_id, guest_id)
  where guest_id is not null;

create index if not exists bookings_payment_status_idx
  on public.bookings (hotel_id, payment_status);

-- =========================================================================
-- 3. guests — CRM normalization columns (legacy counters kept)
-- =========================================================================
alter table public.guests
  add column if not exists language text not null default 'ru',
  add column if not exists marketing_opt_in boolean not null default false,
  add column if not exists vip boolean not null default false,
  add column if not exists lifetime_revenue numeric not null default 0
    check (lifetime_revenue >= 0),
  add column if not exists total_stays integer not null default 0
    check (total_stays >= 0);

-- =========================================================================
-- 4. rooms — operations normalization columns
-- =========================================================================
alter table public.rooms
  add column if not exists housekeeping_status text not null default 'clean'
    check (housekeeping_status in ('clean', 'dirty', 'inspecting', 'out_of_order')),
  add column if not exists maintenance_status text not null default 'operational'
    check (maintenance_status in ('operational', 'maintenance', 'blocked')),
  add column if not exists floor integer
    check (floor is null or floor >= 0),
  add column if not exists room_type_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rooms_room_type_id_fkey'
  ) then
    alter table public.rooms
      add constraint rooms_room_type_id_fkey
      foreign key (room_type_id) references public.room_types (id)
      on update cascade on delete set null not valid;
  end if;
end $$;

create index if not exists rooms_hotel_housekeeping_idx
  on public.rooms (hotel_id, housekeeping_status);

create index if not exists rooms_room_type_id_idx
  on public.rooms (hotel_id, room_type_id)
  where room_type_id is not null;

-- =========================================================================
-- 5. knowledge_articles — AI indexing metrics
-- =========================================================================
alter table public.knowledge_articles
  add column if not exists ai_indexed boolean not null default false,
  add column if not exists quality_score numeric not null default 0
    check (quality_score >= 0 and quality_score <= 100),
  add column if not exists usage_count integer not null default 0
    check (usage_count >= 0);

create index if not exists knowledge_articles_hotel_ai_idx
  on public.knowledge_articles (hotel_id, ai_indexed)
  where deleted_at is null;

-- =========================================================================
-- 6. Revenue tables (normalized payment records)
-- =========================================================================
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  hotel_id        text not null references public.hotels (id) on delete cascade,
  booking_id      uuid not null references public.bookings (id) on delete restrict,
  amount          numeric not null check (amount >= 0),
  currency        text not null default 'USD',
  status          text not null default 'pending'
                    check (status in ('pending', 'authorized', 'captured', 'failed', 'refunded')),
  provider        text not null default 'manual',
  provider_ref    text,
  captured_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.refunds (
  id              uuid primary key default gen_random_uuid(),
  hotel_id        text not null references public.hotels (id) on delete cascade,
  payment_id      uuid not null references public.payments (id) on delete restrict,
  amount          numeric not null check (amount >= 0),
  reason          text,
  status          text not null default 'pending'
                    check (status in ('pending', 'completed', 'failed')),
  processed_at    timestamptz,
  created_at      timestamptz not null default now()
);

create table if not exists public.invoices (
  id              uuid primary key default gen_random_uuid(),
  hotel_id        text not null references public.hotels (id) on delete cascade,
  booking_id      uuid not null references public.bookings (id) on delete restrict,
  payment_id      uuid references public.payments (id) on delete set null,
  invoice_number  text not null,
  subtotal        numeric not null check (subtotal >= 0),
  tax             numeric not null default 0 check (tax >= 0),
  total           numeric not null check (total >= 0),
  status          text not null default 'draft'
                    check (status in ('draft', 'issued', 'paid', 'void')),
  issued_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint invoices_hotel_number_unique unique (hotel_id, invoice_number)
);

create index if not exists payments_hotel_booking_idx
  on public.payments (hotel_id, booking_id);

create index if not exists refunds_hotel_payment_idx
  on public.refunds (hotel_id, payment_id);

create index if not exists invoices_hotel_booking_idx
  on public.invoices (hotel_id, booking_id);

-- =========================================================================
-- 7. RLS for new tables
-- =========================================================================
alter table public.room_types enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;
alter table public.invoices enable row level security;

drop policy if exists room_types_tenant_all on public.room_types;
create policy room_types_tenant_all on public.room_types
  for all to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

drop policy if exists payments_tenant_all on public.payments;
create policy payments_tenant_all on public.payments
  for all to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

drop policy if exists refunds_tenant_all on public.refunds;
create policy refunds_tenant_all on public.refunds
  for all to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

drop policy if exists invoices_tenant_all on public.invoices;
create policy invoices_tenant_all on public.invoices
  for all to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

-- Validate deferred FKs when safe (no-op if already valid)
alter table public.bookings validate constraint bookings_guest_id_fkey;
alter table public.rooms validate constraint rooms_room_type_id_fkey;

-- Keep payment_status aligned when booking.status changes (e.g. AI cancel tool)
create or replace function public.sync_booking_payment_status()
returns trigger
language plpgsql
as $$
begin
  new.payment_status := case
    when new.status = 'cancelled' then 'cancelled'
    when new.status in ('checked_in', 'checked_out') then 'paid'
    else coalesce(new.payment_status, 'pending')
  end;
  return new;
end;
$$;

drop trigger if exists bookings_sync_payment_status on public.bookings;
create trigger bookings_sync_payment_status
  before insert or update of status on public.bookings
  for each row
  execute function public.sync_booking_payment_status();

commit;
