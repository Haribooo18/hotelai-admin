# Final project audit

## Included work

This archive includes all previously completed API and Supabase tenant-isolation fixes, including migration `0022_tenant_reference_integrity.sql`.

Additional final-pass hardening:

- Website widget SSE endpoint now uses the shared bounded JSON parser instead of unbounded `request.json()`.
  - Requires JSON content type.
  - Limits request bodies to 16 KiB.
  - Preserves the endpoint's public 400 error response.
- Telegram webhook now uses the shared bounded JSON parser.
  - Requires JSON content type.
  - Limits webhook bodies to 256 KiB.
  - Preserves the existing public 400 error response.

## Verification performed

- `npm ci`: completed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- Focused security regression tests: 19/19 passed.
- Full Vitest suite progressed without observed failures, but the isolated audit environment terminated the command at its execution-time limit before Vitest printed the final summary.
- Widget production bundle completed.
- Next.js production compilation started successfully; the isolated audit environment terminated the command during the optimized build phase before final completion.

The previously supplied project version was independently verified by the project owner on macOS with:

- 89 test files / 501 tests passing after the Supabase audit stage.
- A successful production build before this final request-body hardening pass.

## Dependency audit

`npm audit` reports two moderate findings through Next.js/PostCSS. The installed stable Next.js version in this project is currently 16.2.10. No forced dependency upgrade was applied because `npm audit fix --force` would introduce breaking dependency changes and the audit environment's package mirror could not resolve the optional Tailwind WASI package during lockfile regeneration.

## Database migration warning

Do not apply `supabase/migrations/0022_tenant_reference_integrity.sql` directly to production without first running it on a database branch or staging copy. It intentionally fails when pre-existing cross-hotel references are detected.
