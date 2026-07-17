-- Adds an explicit queue state for conversations escalated by the AI.
begin;

alter table public.conversations
  drop constraint if exists conversations_status_check;

alter table public.conversations
  add constraint conversations_status_check
  check (status in (
    'new',
    'assigned',
    'ai_answering',
    'waiting_guest',
    'handoff_requested',
    'resolved',
    'archived'
  ));

create index if not exists conversations_handoff_queue_idx
  on public.conversations (hotel_id, priority desc, last_message_at desc nulls last)
  where deleted_at is null and status = 'handoff_requested';

commit;
