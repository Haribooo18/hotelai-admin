begin;

alter table public.hotels
add column if not exists timezone text not null default 'UTC';

alter table public.hotels
add column if not exists language text not null default 'ru';

commit;