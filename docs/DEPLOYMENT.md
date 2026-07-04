# HotelAI Admin — Deployment Guide

Production deployment guide for **Vercel** + **Supabase** + **Stripe** + **Telegram** + **Website Chat**.

See also [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md) for a pre-launch checklist and smoke tests.

---

## Overview

| Component | Host | Notes |
|-----------|------|-------|
| Next.js app | Vercel | Node 22, App Router |
| Database + Auth | Supabase | Postgres, RLS, migrations |
| AI provider | OpenAI | Server-only `OPENAI_API_KEY` |
| Billing | Stripe | Checkout, portal, webhooks |
| Telegram | Telegram Bot API | Webhook ingress |
| Website chat | Same Vercel app | SSE endpoint |

---

## Vercel deployment

1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Set **Framework Preset** to Next.js.
3. Set **Node.js Version** to **22.x** (matches `package.json` `engines`).
4. Add all environment variables from [Environment variables](#environment-variables) (Production scope).
5. Deploy `main` or your release branch.

### Build settings

Default Vercel settings work:

```bash
npm run build
```

CI already runs `typecheck`, `lint`, `test`, and `build` (see `.github/workflows/ci.yml`).

### Startup validation

On server boot, `instrumentation.ts` runs `runStartupValidation()` and logs diagnostics to stdout. The app **does not crash** on missing optional integrations.

Check Vercel **Functions → Logs** after deploy for lines prefixed with `[HotelAI startup]`.

---

## Supabase production

1. Create a **production** Supabase project (separate from staging/dev).
2. Apply migrations in order from `supabase/migrations/` (`0001` … `0011`).
3. Enable **Row Level Security** on all tenant tables (migrations handle this).
4. Create staff users in **Authentication → Users**.
5. Grant memberships:

```sql
insert into public.memberships (user_id, hotel_id, role)
values ('<USER_UUID>', 'hotel_aurora', 'owner');
```

6. Copy **Project URL**, **anon key**, and **service_role key** into Vercel env vars.
7. Enable **daily backups** in Supabase Dashboard → **Database → Backups**.
8. Optional: enable **Realtime** for `leads` if using the dashboard live feed (migration `0005`).

---

## Environment variables

Set in Vercel → **Project → Settings → Environment Variables** (Production).

### Required (core app)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `DEFAULT_HOTEL_ID` | Fallback hotel id until all users have JWT `hotel_id` |

### Required (channels + billing webhooks)

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for Telegram, Website Chat, and Stripe webhook writes |

### OpenAI (AI receptionist)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Server-only. Required for AI auto-replies. |

### Stripe Billing

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_…` in production) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from Stripe webhook endpoint |
| `STRIPE_PRICE_STARTER` | Price id for Starter plan |
| `STRIPE_PRICE_PRO` | Price id for Pro plan |
| `STRIPE_PRICE_ENTERPRISE` | Price id for Enterprise plan |

### Telegram (optional)

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | `secret_token` for `setWebhook` |
| `TELEGRAM_HOTEL_ID` | Target hotel (defaults to `DEFAULT_HOTEL_ID`) |

### Website Chat

| Variable | Description |
|----------|-------------|
| `WEBSITE_CHAT_HOTEL_ID` | Target hotel for widget (defaults to `DEFAULT_HOTEL_ID`) |

Full reference: [`.env.example`](../.env.example) and [`README.md`](../README.md).

---

## Domain configuration

1. Add your custom domain in Vercel → **Domains**.
2. Configure DNS at your registrar:
   - **Apex**: Vercel A record (`76.76.21.21`) or ALIAS/ANAME if supported.
   - **www**: CNAME to `cname.vercel-dns.com`.
3. Wait for DNS propagation; Vercel provisions **HTTPS** automatically (Let's Encrypt).
4. Set the production domain as **Primary** in Vercel.

All webhook URLs must use **HTTPS** in production.

---

## Stripe webhook

1. In [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → Webhooks**, add endpoint:

```
https://<your-domain>/api/billing/webhook
```

2. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

3. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET` in Vercel.

4. Create products/prices in Stripe; map price ids to `STRIPE_PRICE_*` env vars.

5. Redeploy after env changes.

---

## Telegram webhook

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://<your-domain>/api/channels/telegram/webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Verify:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"
```

Requires `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.

---

## Website Chat (SSE)

Public endpoint (no session auth):

```
POST https://<your-domain>/api/channels/website/stream
```

Requires `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` (for AI replies), and `hotel_id` in each guest frame.

### Widget production hardening

Before embedding `widget.js` on customer sites:

1. Set **`WEBSITE_WIDGET_ALLOWED_ORIGINS`** — multiline list of allowed embed origins:

```env
WEBSITE_WIDGET_ALLOWED_ORIGINS=https://customer-hotel.com
https://www.customer-hotel.com
https://*.hotelai.app
```

2. Optional rate limits and message size:

```env
WEBSITE_WIDGET_SESSION_RATE_LIMIT=30
WEBSITE_WIDGET_IP_RATE_LIMIT=60
WEBSITE_WIDGET_MAX_MESSAGE_LENGTH=4000
```

3. Ensure each customer's `hotelId` exists in the `hotels` table (seeded via migrations).

4. In development (`NODE_ENV=development`), `http://localhost:*` origins are allowed automatically.

Rejected requests return JSON (not SSE): `403` (origin), `404` (unknown hotel), `429` (rate limit), `400` (invalid payload).

Full widget guide: [`docs/WIDGET.md`](docs/WIDGET.md).

---

## Health endpoint

Authenticated staff can call:

```
GET /api/ai/health
```

Returns JSON with `supabase`, `openai`, `stripe`, `telegram`, `website_chat`, and tenant `ai` metrics.

Use after deploy to confirm env configuration. Requires a logged-in session (cookie).

---

## HTTPS and DNS checklist

- [ ] Custom domain added in Vercel
- [ ] DNS records point to Vercel
- [ ] Vercel shows **Valid Configuration**
- [ ] `https://<domain>/login` loads without certificate warnings
- [ ] Stripe webhook URL uses `https://`
- [ ] Telegram `setWebhook` URL uses `https://`

---

## Rollback

- **Vercel**: redeploy a previous deployment from the Deployments tab.
- **Supabase**: restore from backup (Dashboard → Database → Backups).
- **Stripe/Telegram**: webhook URLs remain until changed manually.
