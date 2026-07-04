-- HotelAI — Sprint 2: RLS policy review & performance optimization
--
-- Problem with the Sprint 1 policies:
--   USING (public.is_hotel_member(hotel_id))
-- calls a SECURITY DEFINER function once PER ROW, and re-evaluates auth.uid()
-- per row. On large scans this is measurably slower.
--
-- Fix (Supabase-recommended pattern):
--   * Wrap auth.uid() in a scalar subselect so it is evaluated ONCE per statement
--     (Postgres caches it as an InitPlan).
--   * Compare hotel_id against a membership sub-select, which the planner
--     materializes once and applies as a semi-join.
--   * Scope every policy to the `authenticated` role so it is never evaluated
--     for anonymous requests.
--
-- `public.is_hotel_member()` is retained — it is still used by the SECURITY
-- DEFINER RPCs (see 0004).

begin;

-- Business tables share one identical policy shape; generate them in a loop to
-- avoid duplicated SQL.
do $$
declare
  t text;
  tables text[] := array['rooms', 'bookings', 'guests', 'leads'];
begin
  foreach t in array tables loop
    -- Drop the Sprint 1 policy (and this policy, for idempotency).
    execute format('drop policy if exists %I on public.%I', t || '_tenant_all', t);
    execute format('drop policy if exists %I on public.%I', t || '_tenant_rw', t);

    execute format($p$
      create policy %1$I on public.%2$I
        for all
        to authenticated
        using (
          hotel_id in (
            select m.hotel_id
            from public.memberships m
            where m.user_id = (select auth.uid())
          )
        )
        with check (
          hotel_id in (
            select m.hotel_id
            from public.memberships m
            where m.user_id = (select auth.uid())
          )
        )
    $p$, t || '_tenant_rw', t);
  end loop;
end $$;

-- hotels: visible to members only (same InitPlan optimization).
drop policy if exists hotels_member_select on public.hotels;
create policy hotels_member_select on public.hotels
  for select
  to authenticated
  using (
    id in (
      select m.hotel_id
      from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

-- memberships: a user sees only their own rows.
drop policy if exists memberships_self_select on public.memberships;
create policy memberships_self_select on public.memberships
  for select
  to authenticated
  using (user_id = (select auth.uid()));

commit;
