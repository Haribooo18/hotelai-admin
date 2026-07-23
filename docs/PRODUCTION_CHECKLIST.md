# HotelAI Admin — Production Checklist

Use this checklist before and after launching to production.

Related: [`DEPLOYMENT.md`](./DEPLOYMENT.md), [`README.md`](../README.md), [`DATABASE.md`](./DATABASE.md).

**Legend:** `[x]` = confirmed working via a real test in this session (not just "code exists"). `[ ]` = not verified this way — either genuinely not done, or it's infrastructure/dashboard configuration nobody can confirm by reading code (e.g. "Stripe account in live mode"). An unchecked box is not necessarily broken — it just hasn't been proven, so don't treat this file as more certain than it is.

*Last reconciled against reality: 2026-07-23.*

---

## Database

- [x] Migrations applied through `0026` (range updated from the stale `0001…0011` — 16 more exist; `0026` confirmed applied via a direct SQL query against `information_schema.columns`, not just "the command didn't error")
- [ ] RLS enabled on tenant tables (verified via migrations) — not re-checked this session, no reason to believe it changed
- [ ] Seed hotel exists (`hotel_aurora` or your production hotel id)
- [ ] Staff users created in Supabase Auth
- [ ] `memberships` rows link users to hotels
- [ ] JWT `app_metadata.hotel_id` set where possible (reduces `DEFAULT_HOTEL_ID` reliance)

---

## Stripe

- [ ] Stripe account in live mode (or test mode for staging)
- [ ] Products created (Starter, Pro, Enterprise)
- [ ] Prices created and copied to env vars
- [ ] `STRIPE_SECRET_KEY` set in Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` set in Vercel
- [ ] Webhook endpoint registered: `https://<domain>/api/billing/webhook`
- [ ] Webhook events subscribed: `checkout.session.completed`, `customer.subscription.*`
- [x] Migration `0011_billing.sql` applied (covered by the `0026` range check above)
- [x] **Access gating implemented** — `hasProductAccess()` blocks the product for `canceled`/`unpaid`/`incomplete`/`incomplete_expired`/`paused`/no-subscription, allows `active`/`trialing`/`past_due`. New item, wasn't in this checklist before — added because it wasn't true until 23.07.2026

---

## Telegram

- [x] Bot created via @BotFather
- [x] `TELEGRAM_BOT_TOKEN` set
- [x] `TELEGRAM_WEBHOOK_SECRET` set
- [x] `TELEGRAM_HOTEL_ID` set (checklist previously said `DEFAULT_HOTEL_ID` — the code actually reads `TELEGRAM_HOTEL_ID` specifically; corrected)
- [x] Webhook registered: `https://<domain>/api/channels/telegram/webhook`
- [x] `getWebhookInfo` returns correct URL — confirmed live, including catching and fixing a `www` vs apex-domain redirect that was silently breaking delivery (`308` responses Telegram doesn't follow)
- [x] `SUPABASE_SERVICE_ROLE_KEY` set
- [x] **Live end-to-end test passed** — real message sent from Telegram, AI replied, conversation appeared in `/app/ai`

---

## OpenAI

- [ ] `OPENAI_API_KEY` set (server-only, never `NEXT_PUBLIC_`)
- [ ] AI enabled for hotel at `/settings` → AI-ресепшн
- [ ] Model and limits configured

---

## Website Chat

- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `WEBSITE_CHAT_HOTEL_ID` or `DEFAULT_HOTEL_ID` set
- [ ] `OPENAI_API_KEY` set for AI replies
- [x] Widget points to `https://<domain>/api/channels/website/stream` — tested live via the "Monavel — AI-ресепшн отеля" chat bubble, got a real AI response

---

## Monitoring

- [ ] Startup logs visible in Vercel (`[HotelAI startup]` lines)
- [ ] `GET /api/ai/health` returns expected JSON (authenticated)
- [ ] Supabase logs reviewed for RLS / auth errors
- [ ] Stripe webhook delivery log shows 200 responses
- [ ] AI observability logs visible at `/settings` (when configured)

---

## Backups

- [ ] Supabase daily backups enabled
- [ ] Backup retention policy documented
- [ ] Restore procedure tested on staging (optional)

---

## Domain

- [x] Custom domain configured in Vercel (`monavel.app`, primary is `www.monavel.app`)
- [x] DNS records correct (apex + www) — apex correctly 308-redirects to `www`; this exact redirect was the root cause of a real Telegram webhook outage today, now documented instead of tripping the next person up
- [x] HTTPS active (Vercel certificate valid)
- [x] `https://<domain>/login` accessible
- [x] Redirect from apex to `www` confirmed via `curl -I` (not just assumed)

---

## Environment variables (production)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `DEFAULT_HOTEL_ID`
- [ ] `OPENAI_API_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_STARTER` / `PRO` / `ENTERPRISE`
- [x] Telegram vars (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_HOTEL_ID`) — all three added and confirmed working today
- [ ] `WEBSITE_CHAT_HOTEL_ID` (if different from default)

---

## Manual smoke tests

Run after each production deploy.

### AI reply

1. Log in as staff.
2. Open `/ai`, select a conversation.
3. Send a test guest message or use an existing thread.
4. Trigger AI respond (or wait for auto-reply if channel-driven).
5. **Expect:** AI message persisted, conversation status updates, no 5xx in network tab.

### Telegram

1. Message the production bot from a test Telegram account.
2. **Expect:** Guest message in `/ai` inbox (`channel: telegram`).
3. **Expect:** AI reply returned in Telegram (if AI enabled).
4. Check Stripe/Telegram webhook logs for errors.

### Website chat

```bash
curl -N -X POST "https://<domain>/api/channels/website/stream" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "guest_message",
    "session_id": "smoke-test-1",
    "message_id": "msg-1",
    "guest_name": "Smoke Test",
    "body": "Привет"
  }'
```

**Expect:** SSE stream with `ack`, optional `text_delta` / `done`, or `ai_disabled` if AI off.

### Stripe checkout

1. Log in → `/settings` → **Биллинг**.
2. Click **Оформить** on a plan.
3. **Expect:** Redirect to Stripe Checkout.
4. Complete test payment (test mode) or cancel.
5. **Expect:** Return to `/settings?tab=billing`.

### Stripe webhook

1. In Stripe Dashboard → Webhooks → select endpoint → **Send test webhook**.
2. Send `checkout.session.completed` or `customer.subscription.updated`.
3. **Expect:** HTTP 200 from app.
4. **Expect:** Row in `subscription_events`; `subscriptions` updated if metadata includes `hotel_id`.

### Billing portal

1. With an active subscription, open `/settings` → **Биллинг**.
2. Click **Управление подпиской**.
3. **Expect:** Redirect to Stripe Billing Portal.
4. Return to `/settings?tab=billing`.

### Health endpoint

1. Log in as staff.
2. `GET /api/ai/health` (browser devtools or curl with session cookie).
3. **Expect:** JSON with `supabase`, `openai`, `stripe`, `telegram`, `website_chat`, `ai` sections.

### Billing access gating (new, added 23.07.2026 — not yet run against production)

1. In Supabase, set a test hotel's `subscriptions.status` to `canceled`.
2. Log in as a staff member of that hotel, visit any page other than `/settings` (e.g. `/dashboard`, `/bookings`).
3. **Expect:** Full-page "Subscription needed" block instead of the page content. Sidebar/top bar still visible.
4. As `staff` role: **expect** no "Manage billing" button, just a message to contact the owner/manager.
5. As `owner`/`manager` role: **expect** a "Manage billing" button linking to `/settings?tab=billing`.
6. Visit `/settings` directly while still blocked. **Expect:** loads normally — this is the one exception.
7. Set `subscriptions.status` back to `active` (or `trialing`/`past_due`), reload `/dashboard`. **Expect:** normal content, no block.

---

## Post-launch

- [ ] Monitor Vercel function errors for 24h
- [ ] Confirm Stripe subscription rows match live subscriptions
- [ ] Document on-call / escalation for payment or AI outages
