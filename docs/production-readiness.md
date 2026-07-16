# HotelAI — Production Readiness Report

Last updated for release engineering phase. This document summarizes the production posture of HotelAI Admin.

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`deployment.md`](./deployment.md), [`release-checklist.md`](./release-checklist.md).

---

## Architecture

- **Next.js App Router** — thin `app/**/page.tsx` routes; feature UI under `components/dashboard/`
- **Tenant context** — `getTenantContext()` / `getCurrentHotelId()`; single hotel per session
- **Repositories** — tenant-scoped reads/writes; server factories in `repositories/*.server.ts`
- **AI** — single orchestration path via `AIOrchestrator`; OpenAI behind `AIProvider` abstraction
- **Ops** — request context (AsyncLocalStorage), structured logger, in-process metrics, typed errors

---

## Repositories

- All queries scoped by `ctx.hotelId`
- Server Supabase client instrumented for query/RPC latency metrics
- RPC fallbacks for dashboard and revenue aggregation
- `throwRepositoryError` emits typed `RepositoryError`

---

## RLS

- Tenant policies on all business tables (`hotel_id` membership)
- Cross-reference hardening migration `0016` validates FK ownership (bookings↔rooms, messages↔conversations, payments↔bookings, etc.)
- Service role limited to webhooks, channel ingress, billing writes

---

## RPC

| Function | Guard |
|----------|-------|
| `dashboard_metrics` | `SECURITY DEFINER` + `is_hotel_member()` |
| `revenue_*` | Same |
| `list_hotel_leads` | Same |
| `update_lead_status` | Resolves hotel from lead row |

---

## AI

- Centralized retry (429/503/network), circuit breaker, timeouts (request/stream/tool/conversation)
- Prompt versioning (`CurrentPromptVersion` + system prompt hash)
- Token usage and cost estimation via `lib/ai/cost.ts`
- Observability: `ai_actions`, `ai_observability_logs`, structured ops metrics

---

## Security

- Phase 7 RLS audit completed with additive hardening
- API routes use request context + normalized errors
- No service role in browser paths
- Website widget origin allowlist + rate limits
- Secrets redacted in structured logs

---

## Monitoring

- `GET /api/ai/health` — dependencies, startup diagnostics, uptime, request/error counts, latency snapshot
- Structured JSON logs with `requestId`, `hotelId`, `module`, `operation`
- In-process metrics (`lib/ops/metrics.ts`) — no Prometheus yet
- Startup validation on boot (`instrumentation.ts`)

---

## Known limitations

- Metrics are in-memory per server instance (reset on cold start)
- Smoke tests require `SMOKE_TEST_COOKIE` for authenticated page checks
- Migration validation is static (no live Postgres compile in CI)
- `WEBSITE_CHAT_SECRET` is validated at startup but optional in code paths
- Single-region deployment; no active-active failover

---

## Open items

- External metrics backend (Prometheus/Datadog)
- Automated Supabase backup verification job
- Staging environment parity checklist automation
- Per-hotel JWT `hotel_id` to reduce `DEFAULT_HOTEL_ID` reliance

---

## Launch checklist

- [ ] CI green on release commit
- [ ] Migrations applied through latest version
- [ ] Production env vars verified (startup logs)
- [ ] Health endpoint OK
- [ ] Smoke tests pass
- [ ] Billing/Telegram/Website webhooks registered
- [ ] Backup enabled in Supabase
- [ ] Rollback owner assigned

See [`release-checklist.md`](./release-checklist.md) for the full step-by-step list.
