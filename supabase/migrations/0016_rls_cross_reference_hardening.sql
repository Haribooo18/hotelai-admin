-- =========================================================================
-- conversations — lead_id must belong to the same hotel when set
-- =========================================================================
drop policy if exists conversations_tenant_all on public.conversations;
drop policy if exists conversations_tenant_rw on public.conversations;

create policy conversations_tenant_rw on public.conversations
for all
to authenticated
using (
  hotel_id in (
    select m.hotel_id
    from public.memberships m
    where m.user_id = auth.uid()
  )
  and (
    conversations.lead_id is null
    or exists (
      select 1
      from public.leads l
      where l.lead_id::text = conversations.lead_id
        and l.hotel_id = conversations.hotel_id
    )
  )
)
with check (
  hotel_id in (
    select m.hotel_id
    from public.memberships m
    where m.user_id = auth.uid()
  )
  and (
    conversations.lead_id is null
    or exists (
      select 1
      from public.leads l
      where l.lead_id::text = conversations.lead_id
        and l.hotel_id = conversations.hotel_id
    )
  )
);