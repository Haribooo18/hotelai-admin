# Supabase tenant-isolation audit

## Fixed

1. **Cross-tenant foreign-key references** — critical.
   RLS limited which rows a user could read, but several foreign keys referenced only an object ID. A caller who knew another tenant's UUID could create a row in their own hotel that pointed at that foreign row. Migration `0022_tenant_reference_integrity.sql` replaces those references with composite `(hotel_id, id)` foreign keys.

2. **Fresh-database migration syntax** — high.
   `0007_ai_receptionist.sql` contained a duplicated PL/pgSQL `begin`, which could break a clean migration replay. The source migration is corrected.

## Covered relationships

- booking → guest
- room → room type
- payment → booking
- refund → payment
- invoice → booking/payment
- message → conversation
- AI action → conversation/message
- conversation tag → conversation
- conversation assignment → conversation

## Deployment note

Apply migration `0022` first in a staging or database branch. It intentionally fails if existing rows contain cross-hotel references; such rows must be investigated rather than silently rewritten.
