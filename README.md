# HotelAI Admin

Multi-tenant property management admin panel for independent hotels. Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Supabase** (Postgres + Auth + RLS).

Staff use this app to manage leads, bookings, rooms, guests, calendar, knowledge base, and an AI receptionist inbox. See [`docs/PRODUCT.md`](docs/PRODUCT.md) for product vision and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for system design.

---

## Requirements

| Tool | Version |
|------|---------|
| **Node.js** | 22.x (matches CI — see `.github/workflows/ci.yml`) |
| **npm** | 10+ (ships with Node 22) |
| **Supabase** | Project with Auth enabled |

---

## Quick start

```bash
git clone <repository-url>
cd hotelai-admin
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/login` (see `proxy.ts`).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + server | Supabase anon (public) key |
| `DEFAULT_HOTEL_ID` | Yes* | Server | Fallback hotel id when user metadata has no `hotel_id` (default: `hotel_aurora` from seed migration). **Temporary** — remove once all users have memberships (TD-09). |
| `OPENAI_API_KEY` | No | Server only | OpenAI API key for AI receptionist. App runs without it; AI features stay disabled until set. Never expose to the client. |

\* Required for local dev with the seeded tenant model until every user has `app_metadata.hotel_id`.

---

## Supabase setup

1. Create a [Supabase](https://supabase.com) project.
2. Copy **Project URL** and **anon key** into `.env.local`.
3. Apply SQL migrations in order (see below).
4. Create a user in **Authentication → Users** (email + password).
5. Link the user to the seeded hotel:

```sql
-- After running 0001, hotel_aurora exists. Replace <USER_UUID> with the auth user id.
insert into public.memberships (user_id, hotel_id, role)
values ('<USER_UUID>', 'hotel_aurora', 'owner')
on conflict do nothing;
```

Optionally set JWT app metadata (reduces reliance on `DEFAULT_HOTEL_ID`):

```sql
-- In Supabase SQL or via Admin API
-- app_metadata: { "hotel_id": "hotel_aurora", "hotel_name": "Aurora Hotel" }
```

Enable **Realtime** for leads if you use the dashboard live feed (migration `0005`).

---

## Database migrations

Migrations live in `supabase/migrations/`. Apply **in numeric order** on a fresh database:

| File | Summary |
|------|---------|
| `0001_auth_multitenancy_rls.sql` | Hotels, memberships, RLS, `is_hotel_member()` |
| `0002_constraints_indexes.sql` | FKs, indexes, booking overlap constraint |
| `0003_rls_optimization.sql` | RLS policy performance |
| `0004_harden_leads_rpc.sql` | Secure leads RPCs |
| `0005_realtime_leads.sql` | Realtime publication for leads |
| `0006_guests_crm.sql` | Guest CRM columns |
| `0007_ai_receptionist.sql` | Conversations, messages, knowledge, AI tables |
| `0008_knowledge_base.sql` | Knowledge article workflow fields |
| `0009_ai_openai.sql` | AI settings, observability, `is_ai_typing` |
| `0010_ai_settings_hardening.sql` | `top_p`, `tool_choice`, `system_language` |

Run via Supabase SQL Editor (paste each file) or Supabase CLI:

```bash
supabase db push   # if using linked Supabase CLI project
```

Full schema notes: [`docs/DATABASE.md`](docs/DATABASE.md).

---

## Running locally

```bash
npm run dev      # development server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
```

### Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run test:watch` and `npm run test:coverage` are also available.

---

## Continuous Integration

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every **push** and **pull_request**:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build` (placeholder Supabase env vars)
5. `npm run test`

Node **22**, npm cache enabled.

---

## Project structure

```
hotelai-admin/
├── app/                    # Next.js App Router (thin pages only)
├── components/
│   ├── dashboard/<feature>/  # Feature UI (bookings, rooms, ai, …)
│   └── ui/                 # Generic design-system primitives
├── lib/
│   ├── services/           # *.service.ts (reads), *.mutations.ts (writes)
│   ├── ai/                 # AI provider, orchestrator, tools
│   ├── validations/        # Shared Zod schemas
│   └── tenant.ts           # Auth + hotel context
├── types/                  # Domain TypeScript types
├── supabase/migrations/    # Ordered SQL migrations
├── tests/unit/             # Vitest unit tests
└── docs/                   # Architecture, database, roadmap, standards
```

**Docs index**

| Document | Purpose |
|----------|---------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Routes, services, AI layer, conventions |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Tables, RLS, migrations |
| [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md) | TypeScript, React, git hygiene |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Product status by area |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Sprint backlog & technical debt |
| [`AGENTS.md`](AGENTS.md) | Agent/coding entrypoint |

---

## Routes (authenticated)

| Path | Feature |
|------|---------|
| `/` | Leads dashboard |
| `/login` | Public login |
| `/bookings` | Bookings CRUD |
| `/rooms` | Rooms CRUD |
| `/guests` | Guest CRM |
| `/calendar` | Reservation timeline |
| `/ai` | AI receptionist inbox |
| `/knowledge` | Knowledge base admin |
| `/settings` | AI settings & diagnostics |

`/pricing` is linked in navigation but not yet implemented (see ROADMAP).

---

## License

Private — not for public distribution unless otherwise stated by the repository owner.
