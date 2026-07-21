begin;

-- Enable RLS on legacy tables that were still publicly exposed.
alter table public.activity_logs enable row level security;
alter table public.availability enable row level security;
alter table public.booking_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.hotel_settings enable row level security;
alter table public.hotel_users enable row level security;
alter table public.integrations enable row level security;
alter table public.organizations enable row level security;
alter table public.room_prices enable row level security;

-- Prevent trigger function name resolution from depending on the caller's
-- mutable search_path.
alter function public.sync_booking_payment_status()
  set search_path = pg_catalog, public;

-- Financial analytics must not be available to anonymous callers or through
-- the implicit PostgreSQL PUBLIC role.
revoke all
  on function public.revenue_trend(text, date, date)
  from public, anon;

grant execute
  on function public.revenue_trend(text, date, date)
  to authenticated;

commit;