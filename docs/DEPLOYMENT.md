# HotelAI — Deployment Guide

Production deployment for **Vercel + Supabase + OpenAI + Stripe + Telegram + Website Chat**.

See also: [`release-checklist.md`](./release-checklist.md), [`production-readiness.md`](./production-readiness.md), [`backup-and-recovery.md`](./backup-and-recovery.md).

---

## Overview

| Component | Host |
|-----------|------|
| Next.js admin | Vercel (Node 22) |
| Database + Auth | Supabase Postgres + RLS |
| AI | OpenAI (server-only) |
| Billing | Stripe Checkout + webhooks |
| Telegram | Bot webhook → Vercel |
| Website widget | SSE → `/api/channels/website/stream` |

---

## Environment variables

Set in Vercel → **Settings → Environment Variables** (Production).

### Required (core)

| Variable | Notes |
|----------|-------|
| `NODE_ENV` | Set to `production` on Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Or `SUPABASE_URL` alias |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Or `SUPABASE_ANON_KEY` alias |
| `DEFAULT_HOTEL_ID` | Until all users have JWT `hotel_id` |

### Required (webhooks + channels)

| Variable | Notes |
|----------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to browser |

### AI

| Variable | Notes |
|----------|-------|
| `OPENAI_API_KEY` | Server-only |
| `OPENAI_MODEL` | Optional; defaults to `gpt-4o-mini` |

### Billing

| Variable | Notes |
|----------|-------|
| `STRIPE_SECRET_KEY` | |
| `STRIPE_WEBHOOK_SECRET` | |
| `STRIPE_PRICE_STARTER` / `PRO` / `ENTERPRISE` | |

### Telegram (optional)

| Variable | Notes |
|----------|-------|
| `TELEGRAM_BOT_TOKEN` | |
| `TELEGRAM_WEBHOOK_SECRET` | |
| `TELEGRAM_HOTEL_ID` | Falls back to `DEFAULT_HOTEL_ID` |

### Website Chat (optional)

| Variable | Notes |
|----------|-------|
| `WEBSITE_CHAT_HOTEL_ID` | Target hotel |
| `WEBSITE_WIDGET_ALLOWED_ORIGINS` | Required for cross-origin embed |
| `WEBSITE_CHAT_SECRET` | Optional shared secret for hardened ingress |

### Optional / host-specific

| Variable | Notes |
|----------|-------|
| `NEXTAUTH_SECRET` | Not used by Supabase Auth; set if your platform requires it |

Full local template: [`.env.example`](../.env.example).

Startup logs report each variable as `[ok]`, `[missing]`, or `[optional]` — **never print values**.

---

## Migration order

1. Validate locally: `npm run validate:migrations`
2. Apply in Supabase SQL editor or CLI in strict numeric order:

```
0001_auth_multitenancy_rls.sql
0002_constraints_indexes.sql
…
0016_rls_cross_reference_hardening.sql
```

3. Never skip versions or reorder files.
4. Never remove migrations from the repository.

---

## Deploy order

1. Merge to release branch; confirm **CI green** (`.github/workflows/ci.yml`).
2. Apply pending Supabase migrations to production.
3. Set/update Vercel environment variables.
4. Deploy to Vercel (production).
5. Register/update Stripe and Telegram webhooks if URLs changed.
6. Run post-deploy verification.

---

## Post-deploy verification

```bash
# Migration sanity (from repo)
npm run validate:migrations

# Live smoke tests
SMOKE_TEST_BASE_URL=https://your-domain.com npm run smoke-test

# Authenticated checks
SMOKE_TEST_BASE_URL=https://your-domain.com \
SMOKE_TEST_COOKIE="your-session-cookie" \
npm run smoke-test
```

Manual checks:

1. `GET /api/ai/health` while logged in — `status`, `dependencies`, `metrics`
2. `/login`, `/dashboard`, `/bookings`, `/guests`, `/rooms`, `/knowledge`, `/rates`
3. Stripe test checkout (staging or live test mode)
4. Telegram test message
5. Website widget SSE on allowed origin

Review Vercel logs for `[HotelAI startup]` lines.

---

## Rollback procedure

1. **App**: Vercel → Deployments → Promote previous deployment.
2. **Database**: prefer forward-fix migrations; full restore only for disaster ([`backup-and-recovery.md`](./backup-and-recovery.md)).
3. **Webhooks**: revert manually in Stripe/Telegram if needed.
4. Re-run smoke tests.

---

## CI pipeline

On every push and pull request:

```bash
npm ci
npm run validate:migrations
npm run typecheck
npm run lint
npm test
npm run build
```

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
