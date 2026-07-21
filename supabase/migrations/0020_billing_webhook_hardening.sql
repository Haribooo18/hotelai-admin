-- Monavel — Stripe webhook ordering and idempotent subscription state updates

begin;

alter table public.subscriptions
  add column if not exists stripe_event_created_at timestamptz;

create or replace function public.apply_stripe_subscription_event(
  p_hotel_id text,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_plan text,
  p_status text,
  p_current_period_start timestamptz,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean,
  p_event_created_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_rows integer;
begin
  if p_plan not in ('starter', 'pro', 'enterprise') then
    raise exception 'Unsupported billing plan: %', p_plan;
  end if;

  if p_status not in (
    'none', 'active', 'trialing', 'past_due', 'canceled',
    'unpaid', 'incomplete', 'incomplete_expired', 'paused'
  ) then
    raise exception 'Unsupported subscription status: %', p_status;
  end if;

  insert into public.subscriptions (
    hotel_id,
    stripe_customer_id,
    stripe_subscription_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    stripe_event_created_at,
    updated_at
  )
  values (
    p_hotel_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_plan,
    p_status,
    p_current_period_start,
    p_current_period_end,
    p_cancel_at_period_end,
    p_event_created_at,
    now()
  )
  on conflict (hotel_id) do update
  set
    stripe_customer_id = excluded.stripe_customer_id,
    stripe_subscription_id = excluded.stripe_subscription_id,
    plan = excluded.plan,
    status = excluded.status,
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    cancel_at_period_end = excluded.cancel_at_period_end,
    stripe_event_created_at = excluded.stripe_event_created_at,
    updated_at = now()
  where public.subscriptions.stripe_event_created_at is null
     or excluded.stripe_event_created_at >= public.subscriptions.stripe_event_created_at;

  get diagnostics affected_rows = row_count;
  return affected_rows > 0;
end;
$$;

revoke all on function public.apply_stripe_subscription_event(
  text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz
) from public, anon, authenticated;

grant execute on function public.apply_stripe_subscription_event(
  text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz
) to service_role;

commit;
