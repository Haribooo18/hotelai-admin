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

  select count(*)::integer
  into v_room_count
  from public.rooms r
  where r.hotel_id = p_hotel_id;

  return query
  with days as (
    select generate_series(p_from, p_to, interval '1 day')::date as day
  ),
  day_revenue as (
    select
      d.day,
      coalesce(
        sum(b.total_price) filter (
          where b.status <> 'cancelled'
        ),
        0
      ) as revenue,
      coalesce(
        sum(public.revenue_booking_nights(b.check_in, b.check_out)) filter (
          where b.status <> 'cancelled'
        ),
        0
      ) as nights
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
    case
      when dr.nights > 0 then dr.revenue / dr.nights
      else 0
    end,
    case
      when v_room_count > 0 then dr.revenue / v_room_count::numeric
      else 0
    end,
    case
      when v_room_count > 0
        then round((occ.occupied::numeric / v_room_count::numeric) * 100)
      else 0
    end
  from day_revenue dr
  join day_occupied occ
    on occ.day = dr.day
  order by dr.day;
end;
$$;