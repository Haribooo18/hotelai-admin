-- HotelAI — Sprint 7: Knowledge Base expansion
--
-- Extends knowledge_articles with publishing workflow, i18n, priority,
-- audit columns, and search keywords. Prepares for future embeddings.

begin;

alter table public.knowledge_articles
  add column if not exists language text not null default 'ru',
  add column if not exists priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high')),
  add column if not exists status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists created_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_by uuid references auth.users (id) on delete set null,
  add column if not exists search_keywords text[] not null default '{}';

-- Backfill: existing articles are treated as published drafts migrated to published
update public.knowledge_articles
set status = 'published'
where status = 'draft' and content <> '' and deleted_at is null;

create index if not exists knowledge_articles_hotel_status_idx
  on public.knowledge_articles (hotel_id, status)
  where deleted_at is null;

create index if not exists knowledge_articles_hotel_language_idx
  on public.knowledge_articles (hotel_id, language)
  where deleted_at is null;

create index if not exists knowledge_articles_hotel_category_idx
  on public.knowledge_articles (hotel_id, category)
  where deleted_at is null and category is not null;

create index if not exists knowledge_articles_hotel_priority_idx
  on public.knowledge_articles (hotel_id, priority)
  where deleted_at is null;

create index if not exists knowledge_articles_search_keywords_gin_idx
  on public.knowledge_articles using gin (search_keywords);

-- Placeholder for future vector embeddings (pgvector extension in a later sprint)
comment on column public.knowledge_articles.search_keywords is
  'Manual keywords for lexical search; future sprints may add embedding column for semantic retrieval.';

commit;
