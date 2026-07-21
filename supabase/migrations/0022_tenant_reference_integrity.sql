-- Enforce same-hotel integrity for every cross-table tenant reference.
-- RLS restricts row visibility, but foreign-key checks do not guarantee that
-- two referenced rows belong to the same tenant unless hotel_id participates
-- in the constraint.

begin;

-- Parent keys used by composite foreign keys.
alter table public.guests
  add constraint guests_hotel_id_id_unique unique (hotel_id, id);
alter table public.room_types
  add constraint room_types_hotel_id_id_unique unique (hotel_id, id);
alter table public.bookings
  add constraint bookings_hotel_id_id_unique unique (hotel_id, id);
alter table public.payments
  add constraint payments_hotel_id_id_unique unique (hotel_id, id);
alter table public.conversations
  add constraint conversations_hotel_id_id_unique unique (hotel_id, id);
alter table public.messages
  add constraint messages_hotel_id_id_unique unique (hotel_id, id);

-- Replace single-column references with tenant-scoped references.
alter table public.bookings drop constraint if exists bookings_guest_id_fkey;
alter table public.bookings
  add constraint bookings_hotel_guest_fkey
  foreign key (hotel_id, guest_id)
  references public.guests (hotel_id, id)
  on update cascade on delete set null (guest_id);

alter table public.rooms drop constraint if exists rooms_room_type_id_fkey;
alter table public.rooms
  add constraint rooms_hotel_room_type_fkey
  foreign key (hotel_id, room_type_id)
  references public.room_types (hotel_id, id)
  on update cascade on delete set null (room_type_id);

alter table public.payments drop constraint if exists payments_booking_id_fkey;
alter table public.payments
  add constraint payments_hotel_booking_fkey
  foreign key (hotel_id, booking_id)
  references public.bookings (hotel_id, id)
  on update cascade on delete restrict;

alter table public.refunds drop constraint if exists refunds_payment_id_fkey;
alter table public.refunds
  add constraint refunds_hotel_payment_fkey
  foreign key (hotel_id, payment_id)
  references public.payments (hotel_id, id)
  on update cascade on delete restrict;

alter table public.invoices drop constraint if exists invoices_booking_id_fkey;
alter table public.invoices
  add constraint invoices_hotel_booking_fkey
  foreign key (hotel_id, booking_id)
  references public.bookings (hotel_id, id)
  on update cascade on delete restrict;

alter table public.invoices drop constraint if exists invoices_payment_id_fkey;
alter table public.invoices
  add constraint invoices_hotel_payment_fkey
  foreign key (hotel_id, payment_id)
  references public.payments (hotel_id, id)
  on update cascade on delete set null (payment_id);

alter table public.messages drop constraint if exists messages_conversation_id_fkey;
alter table public.messages
  add constraint messages_hotel_conversation_fkey
  foreign key (hotel_id, conversation_id)
  references public.conversations (hotel_id, id)
  on update cascade on delete cascade;

alter table public.ai_actions drop constraint if exists ai_actions_conversation_id_fkey;
alter table public.ai_actions
  add constraint ai_actions_hotel_conversation_fkey
  foreign key (hotel_id, conversation_id)
  references public.conversations (hotel_id, id)
  on update cascade on delete set null (conversation_id);

alter table public.ai_actions drop constraint if exists ai_actions_message_id_fkey;
alter table public.ai_actions
  add constraint ai_actions_hotel_message_fkey
  foreign key (hotel_id, message_id)
  references public.messages (hotel_id, id)
  on update cascade on delete set null (message_id);

alter table public.conversation_tags drop constraint if exists conversation_tags_conversation_id_fkey;
alter table public.conversation_tags
  add constraint conversation_tags_hotel_conversation_fkey
  foreign key (hotel_id, conversation_id)
  references public.conversations (hotel_id, id)
  on update cascade on delete cascade;

alter table public.conversation_assignments drop constraint if exists conversation_assignments_conversation_id_fkey;
alter table public.conversation_assignments
  add constraint conversation_assignments_hotel_conversation_fkey
  foreign key (hotel_id, conversation_id)
  references public.conversations (hotel_id, id)
  on update cascade on delete cascade;

commit;
