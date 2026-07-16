# HotelAI Admin — Production Checklist

Use this checklist before and after launching to production.

Related: [`DEPLOYMENT.md`](./DEPLOYMENT.md), [`README.md`](../README.md), [`DATABASE.md`](./DATABASE.md).

---

## Database

- [ ] All migrations applied (`0001` … `0011`) in order
- [ ] RLS enabled on tenant tables (verified via migrations)
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
- [ ] Migration `0011_billing.sql` applied

---

## Telegram

- [ ] Bot created via @BotFather
- [ ] `TELEGRAM_BOT_TOKEN` set
- [ ] `TELEGRAM_WEBHOOK_SECRET` set
- [ ] `TELEGRAM_HOTEL_ID` set (or `DEFAULT_HOTEL_ID`)
- [ ] Webhook registered: `https://<domain>/api/channels/telegram/webhook`
- [ ] `getWebhookInfo` returns correct URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set

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
- [ ] Widget points to `https://<domain>/api/channels/website/stream`

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

- [ ] Custom domain configured in Vercel
- [ ] DNS records correct (apex + www)
- [ ] HTTPS active (Vercel certificate valid)
- [ ] `https://<domain>/login` accessible
- [ ] Redirect from HTTP to HTTPS (Vercel default)

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
- [ ] Telegram vars (if using Telegram)
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

---

## Post-launch

- [ ] Monitor Vercel function errors for 24h
- [ ] Confirm Stripe subscription rows match live subscriptions
- [ ] Document on-call / escalation for payment or AI outages
