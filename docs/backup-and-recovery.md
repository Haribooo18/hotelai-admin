# HotelAI — Backup and Recovery

Documentation only. Automated backup jobs are not implemented in this repository.

Related: [`deployment.md`](./deployment.md), [`release-checklist.md`](./release-checklist.md).

---

## Supabase backup

### What Supabase provides

- **Daily backups** on paid plans (Dashboard → **Database → Backups**)
- **Point-in-time recovery (PITR)** on eligible plans
- Backups include schema and data for the Postgres project

### Recommended production settings

1. Enable daily backups before first production launch.
2. Confirm backup retention meets your compliance needs.
3. Record the Supabase project ref and region in your runbook.
4. Restrict Dashboard access to owners only.

### What to back up outside Supabase

| Asset | Location |
|-------|----------|
| Environment variables | Vercel project settings (export securely) |
| Stripe products/prices | Stripe Dashboard |
| Telegram bot token | @BotFather + secret store |
| Migration history | Git repository (`supabase/migrations/`) |

---

## Restore process

### Full database restore (disaster)

1. **Stop writes** — disable public webhooks (Stripe/Telegram) or put app in maintenance mode via Vercel redeploy of a static banner page if needed.
2. **Supabase Dashboard** → **Database → Backups** → choose restore point.
3. Confirm restore completes (may take minutes).
4. **Re-apply migrations** only if restore point predates schema — prefer restoring to a point after latest migration instead of mixing restore + manual DDL.
5. **Verify RLS** — run smoke queries as authenticated user; confirm tenant isolation.
6. **Redeploy app** at known-good commit.
7. **Re-enable webhooks** and run post-restore verification (below).

### Partial data recovery

Prefer forward-fix scripts or Supabase SQL editor with read-only investigation first. Export affected rows from backup project (clone) if available.

---

## Migration rollback

HotelAI uses **additive, forward-only** migrations.

- **Do not** delete migration files from the repository.
- **Do not** manually drop production columns used by the app.
- If a migration causes issues, ship a **new** migration that fixes data or policies.
- Rolling back application code without rolling back schema is supported; rolling back schema without code alignment is not.

---

## Disaster recovery

| Scenario | Response |
|----------|----------|
| Vercel outage | Wait for provider; no data loss in Supabase |
| Supabase outage | App returns errors; queue channel messages externally if possible |
| Bad deploy | Redeploy previous Vercel build |
| Bad migration | Forward-fix migration + hotfix deploy |
| Credential leak | Rotate keys in Supabase/Stripe/Telegram/OpenAI; redeploy |

**RTO target (guidance):** restore app within 1 hour via Vercel rollback; database restore depends on Supabase backup size.

**RPO target (guidance):** daily backup window unless PITR is enabled.

---

## Recovery verification

After any restore or rollback:

1. `npm run validate:migrations` against release branch
2. `GET /api/ai/health` (authenticated) — dependencies `ok`
3. `npm run smoke-test` against production URL
4. Create test booking in staging or isolated hotel
5. Confirm Stripe/Telegram test events process
6. Review `ai_observability_logs` for new errors

---

## Contacts and runbook

Document for your team:

- Supabase project URL and support plan
- Vercel team / project name
- Stripe account owner
- Primary on-call engineer

Keep secrets in a password manager, not in this document.
