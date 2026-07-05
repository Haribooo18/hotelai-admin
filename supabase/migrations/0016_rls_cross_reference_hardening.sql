-- HotelAI — Phase 7: RLS cross-reference hardening (additive policy replacement)
--
-- Tightens tenant policies so hotel_id membership alone is not sufficient when
-- foreign keys can reference rows owned by another hotel (same-table hotel_id
-- vs cross-table parent id).

begin;

-- Shared membership predicate (inline in each policy for planner compatibility).

-- =========================================================================
-- bookings — room_id and guest_id must belong to the same hotel
-- =========================================================================
drop policy if exists bookings_tenant_all on public.bookings;
drop policy if exists bookings_tenant_rw on public.bookings;

create policy bookings_tenant_rw on public.bookings
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.rooms r
      where r.id = bookings.room_id
        and r.hotel_id = bookings.hotel_id
    )
    and (
      guest_id is null
      or exists (
        select 1 from public.guests g
        where g.id = bookings.guest_id
          and g.hotel_id = bookings.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.rooms r
      where r.id = room_id
        and r.hotel_id = hotel_id
    )
    and (
      guest_id is null
      or exists (
        select 1 from public.guests g
        where g.id = guest_id
          and g.hotel_id = hotel_id
      )
    )
  );

-- =========================================================================
-- rooms — room_type_id must belong to the same hotel when set
-- =========================================================================
drop policy if exists rooms_tenant_all on public.rooms;
drop policy if exists rooms_tenant_rw on public.rooms;

create policy rooms_tenant_rw on public.rooms
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      room_type_id is null
      or exists (
        select 1 from public.room_types rt
        where rt.id = rooms.room_type_id
          and rt.hotel_id = rooms.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      room_type_id is null
      or exists (
        select 1 from public.room_types rt
        where rt.id = room_type_id
          and rt.hotel_id = hotel_id
      )
    )
  );

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
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      lead_id is null
      or exists (
        select 1 from public.leads l
        where l.lead_id = conversations.lead_id
          and l.hotel_id = conversations.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      lead_id is null
      or exists (
        select 1 from public.leads l
        where l.lead_id = lead_id
          and l.hotel_id = hotel_id
      )
    )
  );

-- =========================================================================
-- messages — conversation_id must belong to the same hotel
-- =========================================================================
drop policy if exists messages_tenant_all on public.messages;
drop policy if exists messages_tenant_rw on public.messages;

create policy messages_tenant_rw on public.messages
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.hotel_id = messages.hotel_id
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.hotel_id = hotel_id
    )
  );

-- =========================================================================
-- conversation_tags — conversation_id must belong to the same hotel
-- =========================================================================
drop policy if exists conversation_tags_tenant_all on public.conversation_tags;
drop policy if exists conversation_tags_tenant_rw on public.conversation_tags;

create policy conversation_tags_tenant_rw on public.conversation_tags
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_tags.conversation_id
        and c.hotel_id = conversation_tags.hotel_id
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.hotel_id = hotel_id
    )
  );

-- =========================================================================
-- conversation_assignments — conversation_id must belong to the same hotel
-- =========================================================================
drop policy if exists conversation_assignments_tenant_all on public.conversation_assignments;
drop policy if exists conversation_assignments_tenant_rw on public.conversation_assignments;

create policy conversation_assignments_tenant_rw on public.conversation_assignments
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_assignments.conversation_id
        and c.hotel_id = conversation_assignments.hotel_id
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.hotel_id = hotel_id
    )
  );

-- =========================================================================
-- ai_actions — linked conversation/message must belong to the same hotel
-- =========================================================================
drop policy if exists ai_actions_tenant_all on public.ai_actions;
drop policy if exists ai_actions_tenant_rw on public.ai_actions;

create policy ai_actions_tenant_rw on public.ai_actions
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = ai_actions.conversation_id
          and c.hotel_id = ai_actions.hotel_id
      )
    )
    and (
      message_id is null
      or exists (
        select 1 from public.messages m
        where m.id = ai_actions.message_id
          and m.hotel_id = ai_actions.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = conversation_id
          and c.hotel_id = hotel_id
      )
    )
    and (
      message_id is null
      or exists (
        select 1 from public.messages m
        where m.id = message_id
          and m.hotel_id = hotel_id
      )
    )
  );

-- =========================================================================
-- ai_observability_logs — linked conversation must belong to the same hotel
-- =========================================================================
drop policy if exists ai_observability_logs_tenant_all on public.ai_observability_logs;
drop policy if exists ai_observability_logs_tenant_rw on public.ai_observability_logs;

create policy ai_observability_logs_tenant_rw on public.ai_observability_logs
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = ai_observability_logs.conversation_id
          and c.hotel_id = ai_observability_logs.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = conversation_id
          and c.hotel_id = hotel_id
      )
    )
  );

-- =========================================================================
-- payments / invoices / refunds — parent records must belong to the same hotel
-- =========================================================================
drop policy if exists payments_tenant_all on public.payments;

create policy payments_tenant_all on public.payments
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id
        and b.hotel_id = payments.hotel_id
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.hotel_id = hotel_id
    )
  );

drop policy if exists invoices_tenant_all on public.invoices;

create policy invoices_tenant_all on public.invoices
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.bookings b
      where b.id = invoices.booking_id
        and b.hotel_id = invoices.hotel_id
    )
    and (
      payment_id is null
      or exists (
        select 1 from public.payments p
        where p.id = invoices.payment_id
          and p.hotel_id = invoices.hotel_id
      )
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.hotel_id = hotel_id
    )
    and (
      payment_id is null
      or exists (
        select 1 from public.payments p
        where p.id = payment_id
          and p.hotel_id = hotel_id
      )
    )
  );

drop policy if exists refunds_tenant_all on public.refunds;

create policy refunds_tenant_all on public.refunds
  for all
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.payments p
      where p.id = refunds.payment_id
        and p.hotel_id = refunds.hotel_id
    )
  )
  with check (
    hotel_id in (
      select m.hotel_id from public.memberships m
      where m.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.payments p
      where p.id = payment_id
        and p.hotel_id = hotel_id
    )
  );

commit;
