-- HotelAI — Sprint 12: Stripe billing (subscriptions + webhook events)
--
-- Tenant-scoped subscription state per hotel. Webhook ingress uses service role.

begin;

-- =========================================================================
-- 1. subscriptions
-- =========================================================================
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  hotel_id                text not null references public.hotels (id) on delete cascade,
  stripe_customer_id      text not null,
  stripe_subscription_id  text,
  plan                    text not null default 'starter'
                            check (plan in ('starter', 'pro', 'enterprise')),
  status                  text not null default 'none'
                            check (status in (
                              'none', 'active', 'trialing', 'past_due', 'canceled',
                              'unpaid', 'incomplete', 'incomplete_expired', 'paused'
                            )),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint subscriptions_hotel_id_unique unique (hotel_id),
  constraint subscriptions_stripe_customer_id_unique unique (stripe_customer_id)
);

create index if not exists subscriptions_hotel_id_idx
  on public.subscriptions (hotel_id);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

-- =========================================================================
-- 2. subscription_events (audit log for Stripe webhooks)
-- =========================================================================
create table if not exists public.subscription_events (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text references public.hotels (id) on delete set null,
  stripe_event_id   text not null,
  event_type        text not null,
  payload           jsonb not null default '{}',
  created_at        timestamptz not null default now(),
  constraint subscription_events_stripe_event_id_unique unique (stripe_event_id)
);

create index if not exists subscription_events_hotel_id_idx
  on public.subscription_events (hotel_id, created_at desc);

create index if not exists subscription_events_type_idx
  on public.subscription_events (event_type);

-- =========================================================================
-- 3. RLS — tenant members can read their hotel subscription
-- =========================================================================
alter table public.subscriptions enable row level security;
alter table public.subscription_events enable row level security;

drop policy if exists subscriptions_tenant_select on public.subscriptions;
create policy subscriptions_tenant_select on public.subscriptions
  for select
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id
      from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

drop policy if exists subscription_events_tenant_select on public.subscription_events;
create policy subscription_events_tenant_select on public.subscription_events
  for select
  to authenticated
  using (
    hotel_id in (
      select m.hotel_id
      from public.memberships m
      where m.user_id = (select auth.uid())
    )
  );

commit;
