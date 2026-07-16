-- HotelAI — Sprint 8.1: AI settings hardening (top_p, tool_choice, system_language)

begin;

alter table public.hotel_ai_settings
  add column if not exists top_p numeric(4, 2) not null default 1.00
    check (top_p >= 0 and top_p <= 1),
  add column if not exists tool_choice text not null default 'auto'
    check (tool_choice in ('auto', 'none', 'required')),
  add column if not exists system_language text not null default 'ru';

commit;
