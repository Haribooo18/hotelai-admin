begin;

-- Monavel / HotelAI: n8n AI Runtime RPCs adapted to the current schema.

create table if not exists public.hotel_info (
  id uuid primary key default gen_random_uuid(),
  hotel_id text not null references public.hotels(id) on update cascade on delete cascade,
  category text,
  question text,
  answer text,
  created_at timestamp without time zone default now(),
  active boolean not null default true
);

create index if not exists hotel_info_hotel_active_idx
  on public.hotel_info (hotel_id, active);

alter table public.hotel_info enable row level security;

drop function if exists public.upsert_booking_session(
  text, text, text, date, date, integer, text, text, text, text
);

create or replace function public.get_hotel_settings(p_hotel_id text)
returns table (
  hotel_id text,
  hotel_name text,
  assistant_name text,
  language text,
  timezone text,
  currency text,
  greeting text,
  telegram_chat_id text,
  telegram_enabled boolean
)
language sql
security definer
set search_path = pg_catalog, public
as $function$
  select
    hs.hotel_id,
    coalesce(hs.hotel_name, h.name),
    hs.assistant_name,
    coalesce(hs.language, h.language, 'ru'),
    coalesce(hs.timezone, h.timezone, 'UTC'),
    coalesce(hs.currency, 'USD'),
    hs.greeting,
    hs.telegram_chat_id,
    hs.telegram_enabled
  from public.hotel_settings hs
  join public.hotels h on h.id = hs.hotel_id
  where hs.hotel_id = p_hotel_id
    and h.status = 'active'
  limit 1;
$function$;

create or replace function public.get_booking_session(p_session_id text)
returns public.booking_sessions
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  result public.booking_sessions;
begin
  if nullif(btrim(p_session_id), '') is null then
    raise exception 'session id is required';
  end if;

  select * into result
  from public.booking_sessions
  where session_id = p_session_id;

  if result.session_id is null then
    result.session_id := p_session_id;
  end if;

  return result;
end;
$function$;

create or replace function public.upsert_booking_session(
  p_session_id text,
  p_hotel_id text,
  p_room_type text default null,
  p_check_in date default null,
  p_check_out date default null,
  p_guests integer default null,
  p_guest_name text default null,
  p_phone text default null,
  p_email text default null,
  p_comment text default null,
  p_current_step text default null
)
returns public.booking_sessions
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  result public.booking_sessions;
begin
  if nullif(btrim(p_session_id), '') is null then
    raise exception 'session id is required';
  end if;

  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if not exists (
    select 1 from public.hotels
    where id = p_hotel_id and status = 'active'
  ) then
    raise exception 'active hotel not found';
  end if;

  if p_check_in is not null and p_check_out is not null and p_check_out <= p_check_in then
    raise exception 'check-out must be later than check-in';
  end if;

  if p_guests is not null and p_guests <= 0 then
    raise exception 'guests must be greater than zero';
  end if;

  insert into public.booking_sessions (
    session_id, hotel_id, room_type, check_in, check_out,
    guests, guest_name, phone, email, comment, current_step, updated_at
  )
  values (
    p_session_id,
    p_hotel_id,
    nullif(btrim(p_room_type), ''),
    p_check_in,
    p_check_out,
    p_guests,
    nullif(btrim(p_guest_name), ''),
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_email), ''),
    nullif(btrim(p_comment), ''),
    nullif(btrim(p_current_step), ''),
    now()
  )
  on conflict (session_id)
  do update set
    hotel_id = excluded.hotel_id,
    room_type = coalesce(excluded.room_type, booking_sessions.room_type),
    check_in = coalesce(excluded.check_in, booking_sessions.check_in),
    check_out = coalesce(excluded.check_out, booking_sessions.check_out),
    guests = coalesce(excluded.guests, booking_sessions.guests),
    guest_name = coalesce(excluded.guest_name, booking_sessions.guest_name),
    phone = coalesce(excluded.phone, booking_sessions.phone),
    email = coalesce(excluded.email, booking_sessions.email),
    comment = coalesce(excluded.comment, booking_sessions.comment),
    current_step = coalesce(excluded.current_step, booking_sessions.current_step),
    updated_at = now()
  returning * into result;

  return result;
end;
$function$;

create or replace function public.log_chat_message(
  p_hotel_id text,
  p_session_id text,
  p_role text,
  p_message text,
  p_raw jsonb default '{}'::jsonb
)
returns public.chat_messages
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  result public.chat_messages;
begin
  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if nullif(btrim(p_session_id), '') is null then
    raise exception 'session id is required';
  end if;

  if nullif(btrim(p_role), '') is null or p_role not in ('user', 'guest', 'assistant', 'system') then
    raise exception 'invalid chat role';
  end if;

  if nullif(btrim(p_message), '') is null then
    raise exception 'message is required';
  end if;

  insert into public.chat_messages (hotel_id, session_id, role, message, raw)
  values (p_hotel_id, p_session_id, p_role, p_message, coalesce(p_raw, '{}'::jsonb))
  returning * into result;

  return result;
end;
$function$;

create or replace function public.get_chat_history(
  p_hotel_id text,
  p_session_id text,
  p_limit integer default 10
)
returns text
language sql
security definer
set search_path = pg_catalog, public
as $function$
  select coalesce(
    string_agg(role || ': ' || message, E'\n' order by created_at asc),
    ''
  )
  from (
    select role, message, created_at
    from public.chat_messages
    where hotel_id = p_hotel_id and session_id = p_session_id
    order by created_at desc
    limit greatest(1, least(coalesce(p_limit, 10), 20))
  ) history;
$function$;

create or replace function public.log_activity(
  p_hotel_id text,
  p_event_type text,
  p_message text default null,
  p_actor_type text default 'system',
  p_actor_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.activity_logs
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  result public.activity_logs;
begin
  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if nullif(btrim(p_event_type), '') is null then
    raise exception 'event type is required';
  end if;

  insert into public.activity_logs (
    hotel_id, actor_type, actor_id, event_type, message, metadata
  )
  values (
    p_hotel_id,
    coalesce(nullif(btrim(p_actor_type), ''), 'system'),
    nullif(btrim(p_actor_id), ''),
    p_event_type,
    p_message,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into result;

  return result;
end;
$function$;

create or replace function public.search_hotel_info(
  p_hotel_id text,
  p_query text,
  p_limit integer default 5
)
returns table (category text, question text, answer text, rank real)
language sql
security definer
set search_path = pg_catalog, public
as $function$
  select
    hi.category,
    hi.question,
    hi.answer,
    ts_rank(
      to_tsvector(
        'russian',
        coalesce(hi.category, '') || ' ' ||
        coalesce(hi.question, '') || ' ' ||
        coalesce(hi.answer, '')
      ),
      plainto_tsquery('russian', coalesce(p_query, ''))
    )
  from public.hotel_info hi
  where hi.hotel_id = p_hotel_id
    and hi.active = true
    and nullif(btrim(p_query), '') is not null
    and (
      to_tsvector(
        'russian',
        coalesce(hi.category, '') || ' ' ||
        coalesce(hi.question, '') || ' ' ||
        coalesce(hi.answer, '')
      ) @@ plainto_tsquery('russian', p_query)
      or hi.question ilike '%' || p_query || '%'
      or hi.answer ilike '%' || p_query || '%'
      or hi.category ilike '%' || p_query || '%'
    )
  order by 4 desc, hi.created_at desc
  limit greatest(1, least(coalesce(p_limit, 5), 10));
$function$;

create or replace function public.search_available_rooms(
  p_hotel_id text,
  p_room_type text default null,
  p_check_in date default null,
  p_check_out date default null
)
returns table (
  room_type text,
  capacity integer,
  price numeric,
  currency text,
  description text,
  amenities text,
  min_available integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  expected_nights integer;
begin
  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if p_check_in is null or p_check_out is null then
    raise exception 'check-in and check-out are required';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'check-out must be later than check-in';
  end if;

  expected_nights := p_check_out - p_check_in;

  return query
  select
    r.room_type,
    max(r.capacity)::integer,
    min(r.price)::numeric,
    coalesce(max(r.currency), 'USD'),
    max(r.description),
    max(r.amenities),
    min(a.available)::integer
  from public.rooms r
  join public.availability a
    on a.hotel_id = r.hotel_id
   and lower(a.room_type) = lower(r.room_type)
   and a.day >= p_check_in
   and a.day < p_check_out
  where r.hotel_id = p_hotel_id
    and (
      nullif(btrim(p_room_type), '') is null
      or lower(r.room_type) = lower(p_room_type)
    )
    and r.maintenance_status = 'operational'
  group by r.room_type
  having count(distinct a.day) = expected_nights
     and min(a.available) > 0
  order by min(r.price) asc nulls last;
end;
$function$;

create or replace function public.search_alternative_rooms(
  p_hotel_id text,
  p_requested_room_type text default null,
  p_check_in date default null,
  p_check_out date default null
)
returns table (
  room_type text,
  capacity integer,
  price numeric,
  currency text,
  description text,
  amenities text,
  min_available integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  expected_nights integer;
begin
  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if p_check_in is null or p_check_out is null then
    raise exception 'check-in and check-out are required';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'check-out must be later than check-in';
  end if;

  expected_nights := p_check_out - p_check_in;

  return query
  select
    r.room_type,
    max(r.capacity)::integer,
    min(r.price)::numeric,
    coalesce(max(r.currency), 'USD'),
    max(r.description),
    max(r.amenities),
    min(a.available)::integer
  from public.rooms r
  join public.availability a
    on a.hotel_id = r.hotel_id
   and lower(a.room_type) = lower(r.room_type)
   and a.day >= p_check_in
   and a.day < p_check_out
  where r.hotel_id = p_hotel_id
    and (
      nullif(btrim(p_requested_room_type), '') is null
      or lower(r.room_type) <> lower(p_requested_room_type)
    )
    and r.maintenance_status = 'operational'
  group by r.room_type
  having count(distinct a.day) = expected_nights
     and min(a.available) > 0
  order by min(r.price) asc nulls last;
end;
$function$;

create or replace function public.check_room_availability(
  p_hotel_id text,
  p_room_type text,
  p_check_in date,
  p_check_out date
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  available_rooms jsonb;
  alternative_rooms jsonb;
begin
  select coalesce(jsonb_agg(to_jsonb(room_result)), '[]'::jsonb)
  into available_rooms
  from public.search_available_rooms(
    p_hotel_id, p_room_type, p_check_in, p_check_out
  ) room_result;

  if jsonb_array_length(available_rooms) > 0 then
    return jsonb_build_object(
      'available', true,
      'available_rooms', available_rooms,
      'alternative_rooms', '[]'::jsonb
    );
  end if;

  select coalesce(jsonb_agg(to_jsonb(room_result)), '[]'::jsonb)
  into alternative_rooms
  from public.search_alternative_rooms(
    p_hotel_id, p_room_type, p_check_in, p_check_out
  ) room_result;

  return jsonb_build_object(
    'available', false,
    'available_rooms', '[]'::jsonb,
    'alternative_rooms', alternative_rooms
  );
end;
$function$;

create or replace function public.calculate_booking_price(
  p_hotel_id text,
  p_room_type text,
  p_check_in date,
  p_check_out date
)
returns table (
  nights integer,
  priced_nights integer,
  missing_nights integer,
  currency text,
  total_price numeric,
  average_price numeric,
  price_breakdown jsonb
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
begin
  if nullif(btrim(p_hotel_id), '') is null then
    raise exception 'hotel id is required';
  end if;

  if nullif(btrim(p_room_type), '') is null then
    raise exception 'room type is required';
  end if;

  if p_check_in is null or p_check_out is null then
    raise exception 'check-in and check-out are required';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'check-out must be later than check-in';
  end if;

  return query
  with days as (
    select generate_series(
      p_check_in,
      p_check_out - 1,
      interval '1 day'
    )::date as day
  ),
  base_room as (
    select
      min(r.price) as price,
      coalesce(max(r.currency), 'USD') as currency
    from public.rooms r
    where r.hotel_id = p_hotel_id
      and lower(r.room_type) = lower(p_room_type)
  ),
  priced as (
    select
      d.day,
      coalesce(rp.price, br.price) as nightly_price,
      coalesce(rp.currency, br.currency, 'USD') as nightly_currency
    from days d
    left join public.room_prices rp
      on rp.hotel_id = p_hotel_id
     and lower(rp.room_type) = lower(p_room_type)
     and rp.day = d.day
    cross join base_room br
  )
  select
    count(*)::integer,
    count(nightly_price)::integer,
    (count(*) - count(nightly_price))::integer,
    coalesce(max(nightly_currency), 'USD'),
    coalesce(sum(nightly_price), 0)::numeric,
    case when count(nightly_price) > 0 then round(avg(nightly_price), 2) else 0 end,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'day', day,
          'price', nightly_price,
          'currency', nightly_currency
        ) order by day
      ),
      '[]'::jsonb
    )
  from priced;
end;
$function$;

create or replace function public.find_guest_history(
  p_hotel_id text,
  p_phone text default null,
  p_email text default null
)
returns table (
  found boolean,
  guest_name text,
  phone text,
  email text,
  bookings_count integer,
  last_booking_at timestamp without time zone,
  last_room_type text,
  last_comment text
)
language sql
security definer
set search_path = pg_catalog, public
as $function$
  with matched as (
    select *
    from public.leads
    where hotel_id = p_hotel_id
      and (
        (nullif(btrim(p_phone), '') is not null and phone = p_phone)
        or
        (nullif(btrim(p_email), '') is not null and lower(email) = lower(p_email))
      )
    order by created_at desc
  )
  select
    exists(select 1 from matched),
    (select guest_name from matched limit 1),
    (select phone from matched limit 1),
    (select email from matched limit 1),
    (select count(*)::integer from matched),
    (select created_at from matched limit 1),
    (select room_type from matched limit 1),
    (
      select comment
      from matched
      where nullif(btrim(comment), '') is not null
      limit 1
    );
$function$;

create or replace function public.create_lead_from_booking_session(
  p_session_id text
)
returns public.leads
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  session_record public.booking_sessions;
  result public.leads;
begin
  if nullif(btrim(p_session_id), '') is null then
    raise exception 'session id is required';
  end if;

  select * into session_record
  from public.booking_sessions
  where session_id = p_session_id;

  if session_record.session_id is null then
    raise exception 'booking session not found';
  end if;

  if session_record.hotel_id is null
     or session_record.room_type is null
     or session_record.check_in is null
     or session_record.check_out is null
     or session_record.guests is null
     or session_record.guest_name is null
     or (session_record.phone is null and session_record.email is null)
  then
    raise exception 'booking session is incomplete';
  end if;

  insert into public.leads (
    hotel_id, session_id, guest_name, phone, email, room_type,
    guests, check_in, check_out, comment, status, source, created_at
  )
  values (
    session_record.hotel_id,
    session_record.session_id,
    session_record.guest_name,
    session_record.phone,
    session_record.email,
    session_record.room_type,
    session_record.guests,
    session_record.check_in,
    session_record.check_out,
    session_record.comment,
    'new',
    'chat',
    now()
  )
  on conflict (session_id)
  where session_id is not null
  do update set
    session_id = excluded.session_id
  returning * into result;

  update public.booking_sessions
  set current_step = 'done', updated_at = now()
  where session_id = p_session_id;

  return result;
end;
$function$;

revoke all on function public.get_hotel_settings(text) from public, anon, authenticated;
revoke all on function public.get_booking_session(text) from public, anon, authenticated;
revoke all on function public.upsert_booking_session(text, text, text, date, date, integer, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.log_chat_message(text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.get_chat_history(text, text, integer) from public, anon, authenticated;
revoke all on function public.log_activity(text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.search_hotel_info(text, text, integer) from public, anon, authenticated;
revoke all on function public.search_available_rooms(text, text, date, date) from public, anon, authenticated;
revoke all on function public.search_alternative_rooms(text, text, date, date) from public, anon, authenticated;
revoke all on function public.check_room_availability(text, text, date, date) from public, anon, authenticated;
revoke all on function public.calculate_booking_price(text, text, date, date) from public, anon, authenticated;
revoke all on function public.find_guest_history(text, text, text) from public, anon, authenticated;
revoke all on function public.create_lead_from_booking_session(text) from public, anon, authenticated;

grant execute on function public.get_hotel_settings(text) to service_role;
grant execute on function public.get_booking_session(text) to service_role;
grant execute on function public.upsert_booking_session(text, text, text, date, date, integer, text, text, text, text, text) to service_role;
grant execute on function public.log_chat_message(text, text, text, text, jsonb) to service_role;
grant execute on function public.get_chat_history(text, text, integer) to service_role;
grant execute on function public.log_activity(text, text, text, text, text, jsonb) to service_role;
grant execute on function public.search_hotel_info(text, text, integer) to service_role;
grant execute on function public.search_available_rooms(text, text, date, date) to service_role;
grant execute on function public.search_alternative_rooms(text, text, date, date) to service_role;
grant execute on function public.check_room_availability(text, text, date, date) to service_role;
grant execute on function public.calculate_booking_price(text, text, date, date) to service_role;
grant execute on function public.find_guest_history(text, text, text) to service_role;
grant execute on function public.create_lead_from_booking_session(text) to service_role;

commit;
