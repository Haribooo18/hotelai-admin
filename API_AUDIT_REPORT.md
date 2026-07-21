# HotelAI API Security Audit

Date: 2026-07-21
Scope: `app/api/**` and directly related API/security helpers.

## Result

The API layer was reviewed for authentication, tenant isolation, privileged Supabase access, webhook verification, request validation, rate limiting, SSE behavior, and error handling.

## Verified controls

- Authenticated AI endpoints require a valid Supabase user session.
- Tenant selection is verified against `memberships`; JWT metadata is not trusted as authorization by itself.
- AI conversation reads and writes are scoped by `hotel_id`.
- Billing checkout and portal access are restricted to owner/manager roles.
- Stripe webhook handling uses the dedicated webhook path and signature-processing layer.
- Telegram webhook requests require `x-telegram-bot-api-secret-token`.
- Website widget ingress validates origin, hotel, payload, and rate limits requests.
- Service-role access is isolated to server-only modules.

## Changes applied

### 1. Bounded JSON request parsing

Added `lib/http/json-body.ts` and applied it to:

- `POST /api/ai/respond`
- `POST /api/ai/stream`
- `POST /api/billing/checkout`
- `POST /api/marketing/leads`

The helper now:

- requires `Content-Type: application/json`;
- rejects empty or invalid JSON;
- enforces per-endpoint byte limits;
- checks both declared and actual body size.

This reduces memory-abuse and oversized-payload risk.

### 2. Marketing lead abuse protection

Added `lib/marketing/rate-limit.ts` and applied it to `POST /api/marketing/leads`:

- 8 submissions per client IP per 10-minute window;
- HTTP 429 response with `Retry-After`;
- existing honeypot remains active;
- responses now use `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`.

Note: the in-memory limiter is suitable as an application-layer fallback. For multi-instance production deployment, use a shared store such as Redis/Upstash or an edge/WAF rate limit.

### 3. SSE response hardening

Applied to authenticated AI streaming and website widget streaming:

- `Cache-Control: no-cache, no-transform`;
- `X-Content-Type-Options: nosniff`;
- `X-Accel-Buffering: no`;
- existing `Connection: keep-alive` retained.

This reduces proxy buffering and content-sniffing issues.

### 4. Safer public error logging

Marketing lead database errors now log only structured `code` and `message`, while clients receive a generic failure response.

## Tests added

- `tests/unit/ops/json-body.test.ts` — 4 tests.
- `tests/unit/marketing/rate-limit.test.ts` — 2 tests.

## Validation

- TypeScript: passed.
- ESLint: passed.
- Vitest: 88 files passed, 489 tests passed.
- Production build: started successfully and completed widget compilation, but the container build process did not finish within the execution timeout. The same project version had already built successfully on the user's Mac before these localized API changes. Run `npm run build` locally after replacing the project to confirm in the target environment.

## Remaining production recommendations

1. Replace process-local marketing rate limiting with a distributed limiter before horizontal scaling.
2. Configure Stripe keys and test webhook replay/idempotency in a Stripe test environment.
3. Run authenticated cross-tenant tests with two real hotel accounts to validate RLS end-to-end.
4. Load-test AI and widget SSE routes behind the actual production proxy/CDN.
5. Rotate any secrets that were ever included in an archive or source-control history.
