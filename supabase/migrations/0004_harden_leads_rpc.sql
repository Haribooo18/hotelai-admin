-- HotelAI — Sprint 2: Harden the leads RPCs
--
-- `list_hotel_leads` and `update_lead_status` are SECURITY DEFINER functions, so
-- they BYPASS Row Level Security. Sprint 1 flagged this as the main security gap
-- (TD-08). This migration redefines both with an explicit membership check so a
-- signed-in user can only read/update leads for a hotel they belong to.
--
-- ┌ VERIFY BEFORE APPLYING ────────────────────────────────────────────────┐
-- │ These definitions assume the `leads` table primary key column is         │
-- │ `lead_id` (as documented in DATABASE.md) and that `list_hotel_leads`     │
-- │ returns rows shaped like `public.leads`. If the deployed column is `id`, │
-- │ change `returns setof public.leads` to an explicit `returns table(...)`  │
-- │ that selects `id AS lead_id`, and update the WHERE clause below.         │
-- └─────────────────────────────────────────────────────────────────────────┘

begin;

-- -------------------------------------------------------------------------
-- list_hotel_leads(p_hotel_id text, p_limit integer)
-- -------------------------------------------------------------------------
drop function if exists public.list_hotel_leads(text, integer);

create function public.list_hotel_leads(
  p_hotel_id text,
  p_limit integer default 50
)
returns setof public.leads
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
    select *
    from public.leads
    where hotel_id = p_hotel_id
    order by created_at desc
    limit greatest(coalesce(p_limit, 50), 0);
end;
$$;

revoke all on function public.list_hotel_leads(text, integer) from public, anon;
grant execute on function public.list_hotel_leads(text, integer) to authenticated;

-- -------------------------------------------------------------------------
-- update_lead_status(p_lead_id uuid, p_status text)
-- -------------------------------------------------------------------------
drop function if exists public.update_lead_status(uuid, text);

create function public.update_lead_status(
  p_lead_id uuid,
  p_status text
)
returns public.leads
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_hotel_id text;
  v_row public.leads;
begin
  select hotel_id into v_hotel_id
  from public.leads
  where lead_id = p_lead_id;

  if v_hotel_id is null then
    raise exception 'lead % not found', p_lead_id using errcode = 'P0002';
  end if;

  if not public.is_hotel_member(v_hotel_id) then
    raise exception 'access denied for hotel %', v_hotel_id using errcode = '42501';
  end if;

  if p_status not in ('new', 'contacted', 'confirmed', 'cancelled') then
    raise exception 'invalid lead status %', p_status using errcode = '22023';
  end if;

  update public.leads
  set status = p_status
  where lead_id = p_lead_id
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.update_lead_status(uuid, text) from public, anon;
grant execute on function public.update_lead_status(uuid, text) to authenticated;

commit;
