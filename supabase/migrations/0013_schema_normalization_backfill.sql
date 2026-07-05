-- HotelAI — Phase 3: Backfill normalized schema from production data
--
-- Non-destructive: only populates new columns / derived rows.

begin;

-- =========================================================================
-- 1. guests — sync vip + normalized counters from legacy columns
-- =========================================================================
update public.guests
set vip = is_vip
where vip is distinct from is_vip;

update public.guests g
set
  lifetime_revenue = coalesce(stats.revenue, g.total_spent, 0),
  total_stays = coalesce(stats.stays, g.total_bookings, 0)
from (
  select
    gg.id as guest_id,
    count(b.id)::integer as stays,
    coalesce(sum(b.total_price), 0) as revenue
  from public.guests gg
  left join public.bookings b
    on b.hotel_id = gg.hotel_id
   and b.status <> 'cancelled'
   and (
     (gg.email is not null and gg.email <> '' and lower(b.guest_email) = lower(gg.email))
     or (
       (gg.email is null or gg.email = '')
       and lower(b.guest_name) = lower(trim(gg.first_name || ' ' || gg.last_name))
     )
   )
  where gg.deleted_at is null
  group by gg.id
) stats
where g.id = stats.guest_id
  and g.deleted_at is null;

-- =========================================================================
-- 2. room_types + rooms.room_type_id
-- =========================================================================
insert into public.room_types (hotel_id, name)
select distinct r.hotel_id, r.room_type
from public.rooms r
where r.room_type is not null
  and trim(r.room_type) <> ''
on conflict (hotel_id, name) do nothing;

update public.rooms r
set room_type_id = rt.id
from public.room_types rt
where r.hotel_id = rt.hotel_id
  and r.room_type = rt.name
  and r.room_type_id is null;

-- =========================================================================
-- 3. bookings — payment_status, booking_source, guest_id
-- =========================================================================
update public.bookings
set payment_status = case
  when status = 'cancelled' then 'cancelled'
  when status in ('checked_in', 'checked_out') then 'paid'
  else 'pending'
end;

update public.bookings b
set guest_id = g.id
from public.guests g
where b.hotel_id = g.hotel_id
  and b.guest_id is null
  and g.deleted_at is null
  and (
    (
      b.guest_email is not null
      and b.guest_email <> ''
      and g.email is not null
      and lower(b.guest_email) = lower(g.email)
    )
    or (
      (b.guest_email is null or b.guest_email = '')
      and lower(b.guest_name) = lower(trim(g.first_name || ' ' || g.last_name))
    )
  );

-- =========================================================================
-- 4. knowledge_articles — quality_score + ai_indexed heuristics
-- =========================================================================
update public.knowledge_articles
set
  quality_score = least(
    100,
    greatest(
      0,
      (case when status = 'published' then 25 else 0 end)
      + (case priority when 'high' then 20 when 'normal' then 10 else 5 end)
      + least(20, coalesce(array_length(tags, 1), 0) * 4)
      + least(15, coalesce(array_length(search_keywords, 1), 0) * 3)
      + least(20, char_length(coalesce(content, '')) / 500)
      + (case when is_pinned then 5 else 0 end)
    )
  ),
  ai_indexed = (status = 'published'),
  usage_count = 0;

-- =========================================================================
-- 5. payments + invoices — seed from completed bookings (idempotent)
-- =========================================================================
insert into public.payments (
  hotel_id,
  booking_id,
  amount,
  currency,
  status,
  provider,
  captured_at,
  created_at,
  updated_at
)
select
  b.hotel_id,
  b.id,
  b.total_price,
  'USD',
  case
    when b.payment_status = 'paid' then 'captured'
    when b.payment_status = 'cancelled' then 'failed'
    else 'pending'
  end,
  'migration',
  case when b.payment_status = 'paid' then b.updated_at else null end,
  b.created_at,
  b.updated_at
from public.bookings b
where not exists (
  select 1 from public.payments p
  where p.booking_id = b.id and p.hotel_id = b.hotel_id
);

insert into public.invoices (
  hotel_id,
  booking_id,
  payment_id,
  invoice_number,
  subtotal,
  tax,
  total,
  status,
  issued_at,
  created_at,
  updated_at
)
select
  b.hotel_id,
  b.id,
  p.id,
  'INV-' || replace(b.id::text, '-', ''),
  b.total_price,
  0,
  b.total_price,
  case when b.payment_status = 'paid' then 'paid' else 'issued' end,
  b.created_at,
  b.created_at,
  b.updated_at
from public.bookings b
join public.payments p
  on p.booking_id = b.id and p.hotel_id = b.hotel_id
where not exists (
  select 1 from public.invoices i
  where i.booking_id = b.id and i.hotel_id = b.hotel_id
);

commit;
