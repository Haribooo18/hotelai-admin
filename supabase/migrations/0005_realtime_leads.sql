-- HotelAI — Sprint 2: Realtime review
--
-- The only LIVE realtime subscription is `DashboardPage`, which listens to
-- postgres_changes on `public.leads` filtered by `hotel_id` (event = '*').
--
-- For that filter to work across INSERT/UPDATE/DELETE (DELETE only ships the
-- primary key by default), the table needs REPLICA IDENTITY FULL and must be a
-- member of the `supabase_realtime` publication.
--
-- Note: the previous `hotel_leads` subscription lived in dead code
-- (`RealtimeListener`, never mounted) and is removed in this sprint, so no
-- publication entry is needed for it.

begin;

alter table public.leads replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
exception
  when undefined_object then
    raise warning 'Publication "supabase_realtime" not found. Enable Realtime in the Supabase dashboard, then add public.leads.';
  when insufficient_privilege then
    raise warning 'Insufficient privilege to alter supabase_realtime. Add public.leads to the publication from the Supabase dashboard.';
  when others then
    raise warning 'Could not add public.leads to supabase_realtime (%). Add it from the Supabase dashboard.', sqlerrm;
end $$;

commit;
