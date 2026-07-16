-- HotelAI — Sprint 8: OpenAI integration settings & observability

begin;

-- =========================================================================
-- 1. Per-hotel AI configuration (model, limits, instructions)
-- =========================================================================
create table if not exists public.hotel_ai_settings (
  hotel_id              text primary key references public.hotels (id) on delete cascade,
  enabled               boolean not null default false,
  model                 text not null default 'gpt-4o-mini',
  max_output_tokens     integer not null default 1024 check (max_output_tokens between 64 and 16384),
  temperature           numeric(4, 2) not null default 0.30 check (temperature between 0 and 2),
  rate_limit_per_minute integer not null default 30 check (rate_limit_per_minute between 1 and 500),
  timeout_ms            integer not null default 60000 check (timeout_ms between 5000 and 300000),
  max_tool_rounds       integer not null default 5 check (max_tool_rounds between 0 and 10),
  max_retries           integer not null default 2 check (max_retries between 0 and 5),
  extra_instructions    text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger set_hotel_ai_settings_updated_at
  before update on public.hotel_ai_settings
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 2. Extend ai_actions for token/cost observability
-- =========================================================================
alter table public.ai_actions
  add column if not exists model text,
  add column if not exists token_usage jsonb not null default '{}',
  add column if not exists cost_usd numeric(12, 6),
  add column if not exists duration_ms integer,
  add column if not exists request_id text;

-- =========================================================================
-- 3. AI typing indicator on conversations
-- =========================================================================
alter table public.conversations
  add column if not exists is_ai_typing boolean not null default false;

-- =========================================================================
-- 4. Structured observability logs
-- =========================================================================
create table if not exists public.ai_observability_logs (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text not null references public.hotels (id) on delete cascade,
  level             text not null check (level in ('debug', 'info', 'warn', 'error')),
  event             text not null,
  conversation_id   uuid references public.conversations (id) on delete set null,
  payload           jsonb not null default '{}',
  created_at        timestamptz not null default now()
);

create index if not exists ai_observability_logs_hotel_created_idx
  on public.ai_observability_logs (hotel_id, created_at desc);

create index if not exists ai_observability_logs_conversation_idx
  on public.ai_observability_logs (conversation_id, created_at desc)
  where conversation_id is not null;

-- =========================================================================
-- 5. RLS
-- =========================================================================
alter table public.hotel_ai_settings      enable row level security;
alter table public.ai_observability_logs  enable row level security;

do $$
declare
  t text;
  tables text[] := array['hotel_ai_settings', 'ai_observability_logs'];
begin
  foreach t in array tables loop
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

commit;
