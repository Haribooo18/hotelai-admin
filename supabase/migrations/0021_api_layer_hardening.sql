-- Prevent Telegram webhook retries from creating duplicate guest messages and
-- triggering duplicate AI replies. Telegram message ids are unique per chat.
create unique index if not exists messages_telegram_external_message_unique
  on public.messages (
    hotel_id,
    ((metadata -> 'telegram' ->> 'chat_id')),
    ((metadata -> 'telegram' ->> 'message_id'))
  )
  where role = 'guest'
    and metadata ? 'telegram'
    and metadata -> 'telegram' ->> 'chat_id' is not null
    and metadata -> 'telegram' ->> 'message_id' is not null;
