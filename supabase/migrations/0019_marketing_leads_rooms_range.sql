-- Preserve the exact hotel-size range selected in the marketing forms.
-- The legacy integer `rooms` column truncated values such as `21-50` to `21`.

alter table if exists public.marketing_leads
  add column if not exists rooms_range text;

update public.marketing_leads
set rooms_range = case rooms
  when 1 then '1-20'
  when 21 then '21-50'
  when 51 then '51-100'
  when 101 then '101-250'
  when 251 then '251+'
  else rooms_range
end
where rooms_range is null;

alter table if exists public.marketing_leads
  drop constraint if exists marketing_leads_rooms_range_check;

alter table if exists public.marketing_leads
  add constraint marketing_leads_rooms_range_check
  check (
    rooms_range is null
    or rooms_range in ('1-20', '21-50', '51-100', '101-250', '251+')
  );
