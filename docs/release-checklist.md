# HotelAI — Release Checklist

Use this checklist for every production release. Related docs: [`deployment.md`](./deployment.md), [`production-readiness.md`](./production-readiness.md), [`backup-and-recovery.md`](./backup-and-recovery.md).

---

## 1. Database migration

- [ ] Review new SQL in `supabase/migrations/` (additive only; do not delete old migrations)
- [ ] Run `npm run validate:migrations` locally
- [ ] Apply migrations to staging in numeric order (`0001` … latest)
- [ ] Apply migrations to production in the same order
- [ ] Confirm RLS policies remain enabled on tenant tables
- [ ] Spot-check critical tables: `bookings`, `guests`, `rooms`, `leads`, `conversations`, `payments`

---

## 2. Environment verification

- [ ] `NODE_ENV=production` on Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (webhooks + channels)
- [ ] `OPENAI_API_KEY` set if AI receptionist is enabled
- [ ] `OPENAI_MODEL` set or default accepted
- [ ] Stripe keys and price IDs set if billing is enabled
- [ ] Telegram vars set if Telegram channel is enabled
- [ ] `WEBSITE_CHAT_SECRET` / widget origins configured if Website Chat is public
- [ ] Review startup logs for `[HotelAI startup] env [missing]` lines (no secrets printed)

---

## 3. Health endpoint

- [ ] Log in as staff
- [ ] `GET /api/ai/health` returns `status`, `dependencies`, `startup`, `metrics`, `uptime`
- [ ] Supabase dependency is `ok`
- [ ] Optional integrations show `unconfigured` or `ok` as expected

---

## 4. Billing webhook

- [ ] Stripe endpoint: `https://<domain>/api/billing/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- [ ] Test event or checkout in staging updates `subscriptions`

---

## 5. Telegram webhook

- [ ] `setWebhook` points to `https://<domain>/api/channels/telegram/webhook`
- [ ] `TELEGRAM_WEBHOOK_SECRET` matches `secret_token`
- [ ] Test message creates/updates conversation in Supabase

---

## 6. Website widget

- [ ] `WEBSITE_WIDGET_ALLOWED_ORIGINS` lists customer embed origins
- [ ] Widget loads on customer site
- [ ] `POST /api/channels/website/stream` returns SSE for valid payload
- [ ] Rate limits behave as expected (`429` with `Retry-After`)

---

## 7. AI health

- [ ] AI enabled in `/settings` for target hotel
- [ ] Staff AI respond (`/api/ai/respond`) succeeds
- [ ] Stream endpoint (`/api/ai/stream`) completes with `[DONE]`
- [ ] `ai_actions` and `ai_observability_logs` receive entries

---

## 8. Smoke tests

```bash
SMOKE_TEST_BASE_URL=https://<domain> npm run smoke-test
```

With authenticated cookie:

```bash
SMOKE_TEST_BASE_URL=https://<domain> \
SMOKE_TEST_COOKIE="sb-..." \
npm run smoke-test
```

- [ ] All checks pass
- [ ] Non-zero exit code blocks release

---

## 9. Rollback steps

1. **Application**: redeploy previous Vercel deployment.
2. **Database**: do not revert applied migrations in production unless a forward-fix migration exists. Restore from Supabase backup only for disaster recovery (see [`backup-and-recovery.md`](./backup-and-recovery.md)).
3. **Stripe/Telegram**: webhook URLs remain until manually changed.
4. **Verification after rollback**: rerun smoke tests and health endpoint.

---

## 10. Sign-off

- [ ] CI green on release commit (`typecheck`, `lint`, `test`, `build`, migration validation)
- [ ] Staging verified
- [ ] Production deploy completed
- [ ] Post-deploy smoke tests passed
- [ ] On-call / owner notified
