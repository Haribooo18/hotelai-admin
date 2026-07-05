-- HotelAI — Phase 6: Revenue & analytics RPCs (additive only)

begin;

create or replace function public.revenue_booking_nights(
  p_check_in date,
  p_check_out date
)
returns integer
language sql
immutable
as $$
  select greatest(1, (p_check_out - p_check_in)::integer);
$$;

create or replace function public.revenue_derive_source(
  p_guest_email text,
  p_guest_phone text
)
returns text
language sql
immutable
as $$
  select case
    when coalesce(p_guest_email, '') <> '' then 'online'
    when coalesce(p_guest_phone, '') <> '' then 'phone'
    else 'direct'
  end;
$$;

create or replace function public.revenue_derive_payment_status(
  p_status text
)
returns text
language sql
immutable
as $$
  select case
    when p_status = 'checked_out' then 'paid'
    when p_status = 'checked_in' then 'deposit'
    when p_status = 'cancelled' then 'void'
    else 'pending'
  end;
$$;

drop function if exists public.revenue_metrics(text, date, date);

create function public.revenue_metrics(
  p_hotel_id text,
  p_from date,
  p_to date
)
returns table (
  revenue_today numeric,
  revenue_week numeric,
  revenue_month numeric,
  adr numeric,
  revpar numeric,
  occupancy numeric,
  average_stay integer,
  cancellation_rate integer,
  arrivals integer,
  departures integer,
  active_bookings integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today date := current_date;
  v_week_start date := v_today - 6;
  v_month_prefix text := to_char(v_today, 'YYYY-MM');
  v_room_count integer;
  v_day_count integer;
  v_revenue_today numeric;
  v_revenue_week numeric;
  v_revenue_month numeric;
  v_range_revenue numeric;
  v_range_nights numeric;
  v_range_bookings integer;
  v_range_total integer;
  v_range_cancelled integer;
  v_occupied_today integer;
  v_arrivals integer;
  v_departures integer;
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  select count(*)::integer into v_room_count
  from public.rooms r
  where r.hotel_id = p_hotel_id;

  v_day_count := greatest(
    1,
    (p_to - p_from)::integer + 1
  );

  select coalesce(sum(b.total_price), 0)
  into v_revenue_today
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.check_in = v_today
    and b.status <> 'cancelled';

  select coalesce(sum(b.total_price), 0)
  into v_revenue_week
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.status <> 'cancelled'
    and b.check_in between v_week_start and v_today;

  select coalesce(sum(b.total_price), 0)
  into v_revenue_month
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.status <> 'cancelled'
    and to_char(b.check_in, 'YYYY-MM') = v_month_prefix;

  select
    coalesce(sum(b.total_price), 0),
    coalesce(sum(public.revenue_booking_nights(b.check_in, b.check_out)), 0),
    count(*)::integer
  into v_range_revenue, v_range_nights, v_range_bookings
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.status <> 'cancelled'
    and b.check_in between p_from and p_to;

  select
    count(*)::integer,
    count(*) filter (where b.status = 'cancelled')::integer
  into v_range_total, v_range_cancelled
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.check_in between p_from and p_to;

  select count(*)::integer
  into v_occupied_today
  from public.bookings b
  where b.hotel_id = p_hotel_id
    and b.status <> 'cancelled'
    and b.check_in <= v_today
    and b.check_out > v_today;

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
    v_revenue_today,
    v_revenue_week,
    v_revenue_month,
    case when v_range_nights > 0 then v_range_revenue / v_range_nights else 0 end,
    case
      when v_room_count > 0 then v_range_revenue / (v_room_count::numeric * v_day_count::numeric)
      else 0
    end,
    case
      when v_room_count > 0 then round((v_occupied_today::numeric / v_room_count::numeric) * 100)
      else 0
    end,
    case
      when v_range_bookings > 0 then round(v_range_nights / v_range_bookings::numeric)::integer
      else 0
    end,
    case
      when v_range_total > 0 then round((v_range_cancelled::numeric / v_range_total::numeric) * 100)::integer
      else 0
    end,
    v_arrivals,
    v_departures,
    v_occupied_today;
end;
$$;

drop function if exists public.revenue_trend(text, date, date);

create function public.revenue_trend(
  p_hotel_id text,
  p_from date,
  p_to date
)
returns table (
  date date,
  revenue numeric,
  adr numeric,
  revpar numeric,
  occupancy numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_room_count integer;
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  select count(*)::integer into v_room_count
  from public.rooms r
  where r.hotel_id = p_hotel_id;

  return query
  with days as (
    select generate_series(p_from, p_to, interval '1 day')::date as day
  ),
  day_revenue as (
    select
      d.day,
      coalesce(sum(b.total_price) filter (
        where b.status <> 'cancelled'
      ), 0) as revenue,
      coalesce(sum(public.revenue_booking_nights(b.check_in, b.check_out)) filter (
        where b.status <> 'cancelled'
      ), 0) as nights
    from days d
    left join public.bookings b
      on b.hotel_id = p_hotel_id
     and b.check_in = d.day
    group by d.day
  ),
  day_occupied as (
    select
      d.day,
      count(b.id)::integer as occupied
    from days d
    left join public.bookings b
      on b.hotel_id = p_hotel_id
     and b.status <> 'cancelled'
     and b.check_in <= d.day
     and b.check_out > d.day
    group by d.day
  )
  select
    dr.day,
    dr.revenue,
    case when dr.nights > 0 then dr.revenue / dr.nights else 0 end,
    case when v_room_count > 0 then dr.revenue / v_room_count::numeric else 0 end,
    case
      when v_room_count > 0 then round((do.occupied::numeric / v_room_count::numeric) * 100)
      else 0
    end
  from day_revenue dr
  join day_occupied do on do.day = dr.day
  order by dr.day;
end;
$$;

drop function if exists public.revenue_breakdown(text, date, date);

create function public.revenue_breakdown(
  p_hotel_id text,
  p_from date,
  p_to date
)
returns table (
  category text,
  label text,
  value numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  return query
  with in_range as (
    select b.*
    from public.bookings b
    where b.hotel_id = p_hotel_id
      and b.check_in between p_from and p_to
      and b.status <> 'cancelled'
  )
  select 'room_type'::text, coalesce(r.room_type, 'Unassigned'), sum(ir.total_price)
  from in_range ir
  left join public.rooms r on r.id = ir.room_id
  group by coalesce(r.room_type, 'Unassigned')

  union all

  select
    'booking_source'::text,
    case public.revenue_derive_source(ir.guest_email, ir.guest_phone)
      when 'online' then 'Online'
      when 'phone' then 'Phone'
      else 'Direct'
    end,
    sum(ir.total_price)
  from in_range ir
  group by public.revenue_derive_source(ir.guest_email, ir.guest_phone)

  union all

  select
    'payment_status'::text,
    case public.revenue_derive_payment_status(ir.status)
      when 'paid' then 'Paid'
      when 'deposit' then 'Deposit'
      when 'void' then 'Void'
      else 'Pending'
    end,
    sum(ir.total_price)
  from in_range ir
  group by public.revenue_derive_payment_status(ir.status);
end;
$$;

drop function if exists public.revenue_forecast(text);

create function public.revenue_forecast(p_hotel_id text)
returns table (
  date date,
  projected numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_to date := current_date;
  v_from date := v_to - 29;
  v_average numeric;
  v_last_date date;
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  select coalesce(avg(t.revenue), 0), max(t.date)
  into v_average, v_last_date
  from (
    select rt.date, rt.revenue
    from public.revenue_trend(p_hotel_id, v_from, v_to) rt
    order by rt.date desc
    limit 7
  ) t;

  if v_last_date is null then
    v_last_date := v_to;
  end if;

  return query
  select
    (v_last_date + gs.i)::date,
    round(v_average)
  from generate_series(1, 7) as gs(i);
end;
$$;

revoke all on function public.revenue_booking_nights(date, date) from public, anon;
revoke all on function public.revenue_derive_source(text, text) from public, anon;
revoke all on function public.revenue_derive_payment_status(text) from public, anon;
revoke all on function public.revenue_metrics(text, date, date) from public, anon;
revoke all on function public.revenue_trend(text, date, date) from public, anon;
revoke all on function public.revenue_breakdown(text, date, date) from public, anon;
revoke all on function public.revenue_forecast(text) from public, anon;

grant execute on function public.revenue_booking_nights(date, date) to authenticated;
grant execute on function public.revenue_derive_source(text, text) to authenticated;
grant execute on function public.revenue_derive_payment_status(text) to authenticated;
grant execute on function public.revenue_metrics(text, date, date) to authenticated;
grant execute on function public.revenue_trend(text, date, date) to authenticated;
grant execute on function public.revenue_breakdown(text, date, date) to authenticated;
grant execute on function public.revenue_forecast(text) to authenticated;

commit;
