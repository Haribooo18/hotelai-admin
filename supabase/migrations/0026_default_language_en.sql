-- Change the default language for NEW hotels and NEW AI settings rows from
-- Russian to English. This only changes what happens when a column is left
-- unspecified on insert going forward — it deliberately does NOT touch any
-- existing row's stored value. A hotel that already has language='ru' set
-- (explicitly or via the old default) keeps it; that may well be an
-- intentional choice for that hotel's actual guest base, not something to
-- silently overwrite.

alter table public.hotels
  alter column "language" set default 'en';

alter table public.hotel_ai_settings
  alter column system_language set default 'en';
