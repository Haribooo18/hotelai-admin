# HotelAI Audit Report

Date: 2026-07-21

## Corrected

- Fixed Next.js Server Action compilation error by moving `resolvePostSignInDestination` from the `"use server"` module to `lib/services/auth.redirects.ts`.
- Updated redirect tests to import the helper from the new module.
- Removed `next/font/google` from the root layout so builds no longer require Google Fonts network access.
- Added deterministic system-font fallbacks in `app/globals.css`.
- Applied safe dependency updates with `npm audit fix`, removing the high-severity `brace-expansion` advisory.

## Verified

- `npm run typecheck`: passed.
- `npm run lint`: passed during the audit runs.
- Unit tests in serial mode: 86 files, 483 tests passed.
- Migration validation: passed.
- Redirect tests: 6 passed.
- No remaining synchronous exports were found in `"use server"` modules.
- 42 page/layout/API route files were inventoried.

## Remaining dependency advisories

Two moderate PostCSS advisories remain inside the installed Next.js dependency tree. `npm audit fix --force` proposes a breaking downgrade to Next 9, so it was intentionally not applied.

## Build limitation

The production build no longer fails on the known Server Action or Google Fonts errors. In this container it remains on `Creating an optimized production build ...` until the execution timeout. A completed production build therefore must still be verified in CI/Vercel.

## External-runtime limitations

A complete certification of Supabase RLS tenant isolation, Stripe billing/webhooks, OpenAI calls, Telegram webhooks, and browser end-to-end flows requires disposable external test services and credentials. Those live checks were not possible in this isolated environment.

## Before production

1. Run `npm ci && npm run build` in CI/Vercel.
2. Apply migrations to a disposable Supabase project and run cross-tenant RLS tests.
3. Run end-to-end flows for login, rooms, bookings, guests, knowledge, leads, billing, website chat, Telegram, and AI.
4. Rotate any secret that may previously have existed in shared archives or Git history.
