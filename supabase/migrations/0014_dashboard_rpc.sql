-- HotelAI — Phase 4: Dashboard KPI aggregation RPC
--
-- Moves expensive dashboard KPI calculations into PostgreSQL.
-- Additive only; existing tables unchanged.

begin;

-- -------------------------------------------------------------------------
-- Supporting index for departures_today aggregation
-- -------------------------------------------------------------------------
create index if not exists bookings_hotel_checkout_idx
  on public.bookings (hotel_id, check_out);

-- -------------------------------------------------------------------------
-- dashboard_metrics(p_hotel_id text)
-- -------------------------------------------------------------------------
drop function if exists public.dashboard_metrics(text);

create function public.dashboard_metrics(p_hotel_id text)
returns table (
  occupancy_percent numeric,
  rooms_available integer,
  rooms_occupied integer,
  revenue_today numeric,
  revenue_month numeric,
  arrivals_today integer,
  departures_today integer,
  active_guests integer,
  active_bookings integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today date := current_date;
  v_room_total integer;
  v_occupied integer;
  v_active_guests integer;
  v_revenue_today numeric;
  v_revenue_month numeric;
  v_arrivals integer;
  v_departures integer;
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  select count(*)::integer
  into v_room_total
  from public.rooms r
  where r.hotel_id = p_hotel_id;

  select
    count(*)::integer,
    coalesce(sum(b.adults + b.children), 0)::integer
  into v_occupied, v_active_guests
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.status <> 'cancelled'
    and b.check_in <= v_today
    and b.check_out > v_today;

  select coalesce(sum(b.total_price), 0)
  into v_revenue_today
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.check_in = v_today;

  select coalesce(sum(b.total_price), 0)
  into v_revenue_month
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and date_trunc('month', b.check_in) = date_trunc('month', v_today::timestamp);

  select count(*)::integer
  into v_arrivals
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.check_in = v_today;

  select count(*)::integer
  into v_departures
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.check_out = v_today;

  return query
  select
    case
      when v_room_total > 0 then (v_occupied::numeric / v_room_total::numeric) * 100
      else 0::numeric
    end,
    greatest(v_room_total - v_occupied, 0),
    v_occupied,
    v_revenue_today,
    v_revenue_month,
    v_arrivals,
    v_departures,
    v_active_guests,
    v_occupied;
end;
$$;

revoke all on function public.dashboard_metrics(text) from public, anon;
grant execute on function public.dashboard_metrics(text) to authenticated;

commit;
