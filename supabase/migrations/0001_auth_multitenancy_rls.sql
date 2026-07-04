-- HotelAI — Sprint 1: Auth + Multi-tenancy + Row Level Security
--
-- This migration establishes the tenant model and secures every business table
-- with Row Level Security (RLS). It is safe to run once on an existing project.
--
-- Model:
--   auth.users (Supabase Auth) --< memberships >-- hotels
--   Every business row carries `hotel_id` and is only visible to members of that
--   hotel. Access is decided by `public.is_hotel_member(hotel_id)`.

-- =========================================================================
-- 1. Tenant tables
-- =========================================================================

create table if not exists public.hotels (
  id          text primary key,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.memberships (
  user_id     uuid not null references auth.users (id) on delete cascade,
  hotel_id    text not null references public.hotels (id) on delete cascade,
  role        text not null default 'staff'
                check (role in ('owner', 'manager', 'staff')),
  created_at  timestamptz not null default now(),
  primary key (user_id, hotel_id)
);

create index if not exists memberships_user_id_idx on public.memberships (user_id);
create index if not exists memberships_hotel_id_idx on public.memberships (hotel_id);

-- =========================================================================
-- 2. Tenant helper (single source of truth for policies)
-- =========================================================================
-- SECURITY DEFINER so the membership lookup itself is not blocked by RLS.
-- STABLE so the planner can cache it within a statement.

create or replace function public.is_hotel_member(hid text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and m.hotel_id = hid
  );
$$;

revoke all on function public.is_hotel_member(text) from public;
grant execute on function public.is_hotel_member(text) to authenticated;

-- =========================================================================
-- 3. Enable RLS on every tenant-owned table
-- =========================================================================

alter table public.hotels       enable row level security;
alter table public.memberships  enable row level security;
alter table public.rooms        enable row level security;
alter table public.bookings     enable row level security;
alter table public.guests       enable row level security;
alter table public.leads        enable row level security;

-- =========================================================================
-- 4. Policies
-- =========================================================================

-- hotels: a user can see hotels they belong to.
drop policy if exists hotels_member_select on public.hotels;
create policy hotels_member_select on public.hotels
  for select
  using (public.is_hotel_member(id));

-- memberships: a user can see only their own membership rows.
drop policy if exists memberships_self_select on public.memberships;
create policy memberships_self_select on public.memberships
  for select
  using (user_id = auth.uid());

-- Business tables: full access scoped to the caller's hotel membership.
drop policy if exists rooms_tenant_all on public.rooms;
create policy rooms_tenant_all on public.rooms
  for all
  using (public.is_hotel_member(hotel_id))
  with check (public.is_hotel_member(hotel_id));

drop policy if exists bookings_tenant_all on public.bookings;
create policy bookings_tenant_all on public.bookings
  for all
  using (public.is_hotel_member(hotel_id))
  with check (public.is_hotel_member(hotel_id));

drop policy if exists guests_tenant_all on public.guests;
create policy guests_tenant_all on public.guests
  for all
  using (public.is_hotel_member(hotel_id))
  with check (public.is_hotel_member(hotel_id));

drop policy if exists leads_tenant_all on public.leads;
create policy leads_tenant_all on public.leads
  for all
  using (public.is_hotel_member(hotel_id))
  with check (public.is_hotel_member(hotel_id));

-- =========================================================================
-- 5. RPC hardening notes (leads pipeline)
-- =========================================================================
-- `list_hotel_leads` and `update_lead_status` are SECURITY DEFINER functions and
-- therefore BYPASS the policies above. They MUST verify membership explicitly.
-- Add this guard as the first statement inside each function body:
--
--   if not public.is_hotel_member(p_hotel_id) then
--     raise exception 'not a member of hotel %', p_hotel_id using errcode = '42501';
--   end if;
--
-- For `update_lead_status` (which receives p_lead_id, not p_hotel_id), resolve the
-- lead's hotel first and check membership against it before updating.

-- =========================================================================
-- 6. Seed the initial tenant (backfill for the pre-auth single-hotel data)
-- =========================================================================
-- Existing rows already use hotel_id = 'hotel_aurora'. Register that hotel so
-- current data stays reachable once memberships are assigned.

insert into public.hotels (id, name)
values ('hotel_aurora', 'Aurora Hotel')
on conflict (id) do nothing;

-- After creating users in Supabase Auth, grant them access, e.g.:
--   insert into public.memberships (user_id, hotel_id, role)
--   values ('<auth-user-uuid>', 'hotel_aurora', 'owner');
--
-- Optionally mirror the hotel into the user's JWT for faster lookups:
--   update auth.users
--   set raw_app_meta_data = raw_app_meta_data || '{"hotel_id":"hotel_aurora"}'::jsonb
--   where id = '<auth-user-uuid>';
