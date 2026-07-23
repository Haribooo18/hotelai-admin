begin;

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
  expected_nights integer;
  hotel_inventory_days integer;
  max_room_inventory_days integer;
  available_rooms jsonb;
  alternative_rooms jsonb;
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

  expected_nights := p_check_out - p_check_in;

  select count(distinct a.day)::integer
  into hotel_inventory_days
  from public.availability a
  where a.hotel_id = p_hotel_id
    and a.day >= p_check_in
    and a.day < p_check_out;

  select coalesce(max(room_days), 0)::integer
  into max_room_inventory_days
  from (
    select
      lower(a.room_type) as room_type,
      count(distinct a.day)::integer as room_days
    from public.availability a
    where a.hotel_id = p_hotel_id
      and a.day >= p_check_in
      and a.day < p_check_out
    group by lower(a.room_type)
  ) coverage;

  if hotel_inventory_days = 0 then
    return jsonb_build_object(
      'status', 'inventory_missing',
      'available', false,
      'expected_nights', expected_nights,
      'inventory_days', 0,
      'available_rooms', '[]'::jsonb,
      'alternative_rooms', '[]'::jsonb
    );
  end if;

  if max_room_inventory_days < expected_nights then
    return jsonb_build_object(
      'status', 'inventory_incomplete',
      'available', false,
      'expected_nights', expected_nights,
      'inventory_days', max_room_inventory_days,
      'available_rooms', '[]'::jsonb,
      'alternative_rooms', '[]'::jsonb
    );
  end if;

  select coalesce(jsonb_agg(to_jsonb(room_result)), '[]'::jsonb)
  into available_rooms
  from public.search_available_rooms(
    p_hotel_id,
    p_room_type,
    p_check_in,
    p_check_out
  ) room_result;

  if jsonb_array_length(available_rooms) > 0 then
    return jsonb_build_object(
      'status', 'available',
      'available', true,
      'expected_nights', expected_nights,
      'inventory_days', max_room_inventory_days,
      'available_rooms', available_rooms,
      'alternative_rooms', '[]'::jsonb
    );
  end if;

  select coalesce(jsonb_agg(to_jsonb(room_result)), '[]'::jsonb)
  into alternative_rooms
  from public.search_alternative_rooms(
    p_hotel_id,
    p_room_type,
    p_check_in,
    p_check_out
  ) room_result;

  if jsonb_array_length(alternative_rooms) > 0 then
    return jsonb_build_object(
      'status', 'alternatives_available',
      'available', false,
      'expected_nights', expected_nights,
      'inventory_days', max_room_inventory_days,
      'available_rooms', '[]'::jsonb,
      'alternative_rooms', alternative_rooms
    );
  end if;

  return jsonb_build_object(
    'status', 'sold_out',
    'available', false,
    'expected_nights', expected_nights,
    'inventory_days', max_room_inventory_days,
    'available_rooms', '[]'::jsonb,
    'alternative_rooms', '[]'::jsonb
  );
end;
$function$;

revoke all on function public.check_room_availability(
  text, text, date, date
) from public, anon, authenticated;

grant execute on function public.check_room_availability(
  text, text, date, date
) to service_role;

commit;
