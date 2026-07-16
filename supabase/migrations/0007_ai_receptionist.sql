-- HotelAI — Sprint 6: AI Receptionist foundation
--
-- Tables: conversations, messages, knowledge_articles, ai_actions,
--         conversation_tags, conversation_assignments
-- All tenant-scoped via hotel_id + RLS (optimized pattern from 0003).

begin;

-- =========================================================================
-- 1. conversations
-- =========================================================================
create table if not exists public.conversations (
  id                    uuid primary key default gen_random_uuid(),
  hotel_id              text not null references public.hotels (id) on delete cascade,
  guest_name            text not null,
  guest_email           text,
  guest_phone           text,
  channel               text not null default 'website'
                          check (channel in (
                            'website', 'whatsapp', 'telegram',
                            'instagram', 'facebook_messenger', 'email'
                          )),
  status                text not null default 'new'
                          check (status in (
                            'new', 'assigned', 'ai_answering',
                            'waiting_guest', 'resolved', 'archived'
                          )),
  priority              text not null default 'normal'
                          check (priority in ('low', 'normal', 'high', 'urgent')),
  lead_id               text,
  subject               text,
  last_message_preview  text,
  last_message_at       timestamptz,
  unread_count          integer not null default 0 check (unread_count >= 0),
  assigned_to           uuid references auth.users (id) on delete set null,
  is_guest_typing       boolean not null default false,
  internal_notes        text,
  deleted_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists conversations_hotel_active_idx
  on public.conversations (hotel_id, last_message_at desc nulls last)
  where deleted_at is null;

create index if not exists conversations_hotel_status_idx
  on public.conversations (hotel_id, status)
  where deleted_at is null;

create index if not exists conversations_hotel_channel_idx
  on public.conversations (hotel_id, channel)
  where deleted_at is null;

create index if not exists conversations_hotel_priority_idx
  on public.conversations (hotel_id, priority)
  where deleted_at is null;

-- =========================================================================
-- 2. messages
-- =========================================================================
create table if not exists public.messages (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text not null references public.hotels (id) on delete cascade,
  conversation_id   uuid not null references public.conversations (id) on delete cascade,
  role              text not null
                      check (role in ('guest', 'staff', 'ai', 'system')),
  body              text not null,
  is_internal       boolean not null default false,
  metadata          jsonb not null default '{}',
  deleted_at        timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

create index if not exists messages_hotel_created_idx
  on public.messages (hotel_id, created_at desc);

-- =========================================================================
-- 3. knowledge_articles
-- =========================================================================
create table if not exists public.knowledge_articles (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    text not null references public.hotels (id) on delete cascade,
  title       text not null,
  slug        text,
  content     text not null default '',
  category    text,
  is_pinned   boolean not null default false,
  tags        text[] not null default '{}',
  deleted_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists knowledge_articles_hotel_active_idx
  on public.knowledge_articles (hotel_id, updated_at desc)
  where deleted_at is null;

create index if not exists knowledge_articles_hotel_pinned_idx
  on public.knowledge_articles (hotel_id)
  where is_pinned and deleted_at is null;

create index if not exists knowledge_articles_tags_gin_idx
  on public.knowledge_articles using gin (tags);

-- =========================================================================
-- 4. ai_actions (audit log for future AI tool calls)
-- =========================================================================
create table if not exists public.ai_actions (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text not null references public.hotels (id) on delete cascade,
  conversation_id   uuid references public.conversations (id) on delete set null,
  message_id        uuid references public.messages (id) on delete set null,
  action_type       text not null,
  tool_name         text,
  input             jsonb not null default '{}',
  output            jsonb,
  status            text not null default 'pending'
                      check (status in ('pending', 'completed', 'failed')),
  error_message     text,
  created_at        timestamptz not null default now(),
  completed_at      timestamptz
);

create index if not exists ai_actions_hotel_created_idx
  on public.ai_actions (hotel_id, created_at desc);

create index if not exists ai_actions_conversation_idx
  on public.ai_actions (conversation_id, created_at desc)
  where conversation_id is not null;

-- =========================================================================
-- 5. conversation_tags
-- =========================================================================
create table if not exists public.conversation_tags (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text not null references public.hotels (id) on delete cascade,
  conversation_id   uuid not null references public.conversations (id) on delete cascade,
  tag               text not null,
  created_at        timestamptz not null default now(),
  unique (conversation_id, tag)
);

create index if not exists conversation_tags_hotel_idx
  on public.conversation_tags (hotel_id);

create index if not exists conversation_tags_conversation_idx
  on public.conversation_tags (conversation_id);

-- =========================================================================
-- 6. conversation_assignments (assignment history)
-- =========================================================================
create table if not exists public.conversation_assignments (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          text not null references public.hotels (id) on delete cascade,
  conversation_id   uuid not null references public.conversations (id) on delete cascade,
  user_id           uuid not null references auth.users (id) on delete cascade,
  assigned_by       uuid references auth.users (id) on delete set null,
  is_active         boolean not null default true,
  assigned_at       timestamptz not null default now(),
  unassigned_at     timestamptz
);

create index if not exists conversation_assignments_conversation_idx
  on public.conversation_assignments (conversation_id, assigned_at desc);

create index if not exists conversation_assignments_user_active_idx
  on public.conversation_assignments (user_id)
  where is_active;

-- =========================================================================
-- 7. updated_at triggers (reuse set_updated_at from 0002 if present)
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_conversations_updated_at'
  ) then
    create trigger set_conversations_updated_at
      before update on public.conversations
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_knowledge_articles_updated_at'
  ) then
    create trigger set_knowledge_articles_updated_at
      before update on public.knowledge_articles
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- =========================================================================
-- 8. RLS
-- =========================================================================
alter table public.conversations           enable row level security;
alter table public.messages                enable row level security;
alter table public.knowledge_articles      enable row level security;
alter table public.ai_actions              enable row level security;
alter table public.conversation_tags       enable row level security;
alter table public.conversation_assignments enable row level security;

do $$
declare
  t text;
  tables text[] := array[
    'conversations', 'messages', 'knowledge_articles',
    'ai_actions', 'conversation_tags', 'conversation_assignments'
  ];
begin
  foreach t in array tables loop
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

commit;
