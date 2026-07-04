-- HotelAI — Sprint 2: Constraints, indexes, cascade rules, integrity triggers
--
-- Goal: make the data layer production-ready without breaking existing data.
--
-- Safety model:
--   * Everything is idempotent (guarded by IF NOT EXISTS / catalog checks).
--   * FK and CHECK constraints are added as NOT VALID so creation never fails on
--     legacy rows, then validated in a guarded block that only WARNS (does not
--     abort) if legacy data violates them. Clean the data and re-run VALIDATE.
--   * Index/constraint creations that can fail on dirty data are wrapped so the
--     migration always completes and surfaces a warning instead.

begin;

-- =========================================================================
-- 1. Foreign keys (relational + tenant integrity)
-- =========================================================================
-- Cascade rules:
--   *_hotel_id  -> hotels(id)  ON DELETE CASCADE  (removing a hotel removes its data)
--   room_id     -> rooms(id)   ON DELETE RESTRICT (keep reservation history safe)

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'rooms_hotel_id_fkey') then
    alter table public.rooms
      add constraint rooms_hotel_id_fkey foreign key (hotel_id)
      references public.hotels (id) on update cascade on delete cascade not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'bookings_hotel_id_fkey') then
    alter table public.bookings
      add constraint bookings_hotel_id_fkey foreign key (hotel_id)
      references public.hotels (id) on update cascade on delete cascade not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'bookings_room_id_fkey') then
    alter table public.bookings
      add constraint bookings_room_id_fkey foreign key (room_id)
      references public.rooms (id) on update cascade on delete restrict not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'guests_hotel_id_fkey') then
    alter table public.guests
      add constraint guests_hotel_id_fkey foreign key (hotel_id)
      references public.hotels (id) on update cascade on delete cascade not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'leads_hotel_id_fkey') then
    alter table public.leads
      add constraint leads_hotel_id_fkey foreign key (hotel_id)
      references public.hotels (id) on update cascade on delete cascade not valid;
  end if;
end $$;

-- =========================================================================
-- 2. Check constraints (domain integrity)
-- =========================================================================

do $$
begin
  -- rooms
  if not exists (select 1 from pg_constraint where conname = 'rooms_capacity_check') then
    alter table public.rooms add constraint rooms_capacity_check
      check (capacity > 0) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'rooms_price_check') then
    alter table public.rooms add constraint rooms_price_check
      check (price >= 0) not valid;
  end if;

  -- bookings
  if not exists (select 1 from pg_constraint where conname = 'bookings_dates_check') then
    alter table public.bookings add constraint bookings_dates_check
      check (check_out > check_in) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'bookings_total_price_check') then
    alter table public.bookings add constraint bookings_total_price_check
      check (total_price >= 0) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'bookings_occupancy_check') then
    alter table public.bookings add constraint bookings_occupancy_check
      check (adults >= 0 and children >= 0) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'bookings_status_check') then
    alter table public.bookings add constraint bookings_status_check
      check (status in ('confirmed', 'checked_in', 'checked_out', 'cancelled')) not valid;
  end if;

  -- guests
  if not exists (select 1 from pg_constraint where conname = 'guests_totals_check') then
    alter table public.guests add constraint guests_totals_check
      check (total_bookings >= 0 and total_spent >= 0) not valid;
  end if;

  -- leads (status/guests are nullable)
  if not exists (select 1 from pg_constraint where conname = 'leads_status_check') then
    alter table public.leads add constraint leads_status_check
      check (status is null or status in ('new', 'contacted', 'confirmed', 'cancelled')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_guests_check') then
    alter table public.leads add constraint leads_guests_check
      check (guests is null or guests >= 0) not valid;
  end if;
end $$;

-- =========================================================================
-- 3. Validate the constraints added above (warn instead of abort)
-- =========================================================================

do $$
declare
  c record;
begin
  for c in
    select conname, conrelid::regclass::text as tbl
    from pg_constraint
    where not convalidated
      and conname in (
        'rooms_hotel_id_fkey', 'bookings_hotel_id_fkey', 'bookings_room_id_fkey',
        'guests_hotel_id_fkey', 'leads_hotel_id_fkey',
        'rooms_capacity_check', 'rooms_price_check',
        'bookings_dates_check', 'bookings_total_price_check',
        'bookings_occupancy_check', 'bookings_status_check',
        'guests_totals_check', 'leads_status_check', 'leads_guests_check'
      )
  loop
    begin
      execute format('alter table %s validate constraint %I', c.tbl, c.conname);
    exception when others then
      raise warning 'Could not validate % on % (%). Clean data, then: alter table % validate constraint %;',
        c.conname, c.tbl, sqlerrm, c.tbl, c.conname;
    end;
  end loop;
end $$;

-- =========================================================================
-- 4. Unique constraints
-- =========================================================================
-- One guest per email per hotel (case-insensitive), ignoring NULL emails.

do $$
begin
  create unique index if not exists guests_hotel_email_unique
    on public.guests (hotel_id, lower(email))
    where email is not null;
exception when others then
  raise warning 'guests_hotel_email_unique not created (%). Resolve duplicate guest emails and re-run.', sqlerrm;
end $$;

-- =========================================================================
-- 5. Performance indexes (match real query patterns)
-- =========================================================================
-- rooms:    .eq(hotel_id).order(room_type)
create index if not exists rooms_hotel_type_idx
  on public.rooms (hotel_id, room_type);

-- bookings: .eq(hotel_id).order(check_in desc)
create index if not exists bookings_hotel_checkin_idx
  on public.bookings (hotel_id, check_in desc);

-- bookings: dashboard occupied count .eq(hotel_id).eq(status)
create index if not exists bookings_hotel_status_idx
  on public.bookings (hotel_id, status);

-- bookings: availability scan by room + date range (also indexes room_id FK)
create index if not exists bookings_room_dates_idx
  on public.bookings (room_id, check_in, check_out);

-- guests:   .eq(hotel_id).order(created_at desc)
create index if not exists guests_hotel_created_idx
  on public.guests (hotel_id, created_at desc);

-- leads:    list_hotel_leads -> where hotel_id order by created_at desc
create index if not exists leads_hotel_created_idx
  on public.leads (hotel_id, created_at desc);

-- leads:    status filtering (dashboard counts / future filters)
create index if not exists leads_hotel_status_idx
  on public.leads (hotel_id, status);

-- =========================================================================
-- 6. Overlap prevention (enforce ensureRoomAvailable at the database)
-- =========================================================================
-- No two non-cancelled bookings may occupy the same room on overlapping dates.
-- Uses a half-open range [check_in, check_out) so same-day turnover is allowed.

create extension if not exists btree_gist;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'bookings_no_overlap') then
    alter table public.bookings
      add constraint bookings_no_overlap
      exclude using gist (
        room_id with =,
        daterange(check_in, check_out, '[)') with &&
      ) where (status <> 'cancelled');
  end if;
exception when others then
  raise warning 'bookings_no_overlap not added (%). Resolve overlapping bookings and re-run.', sqlerrm;
end $$;

-- =========================================================================
-- 7. Auto-maintain updated_at (mutations do not set it)
-- =========================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists set_guests_updated_at on public.guests;
create trigger set_guests_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

commit;
