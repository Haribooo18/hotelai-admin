# Changelog

All notable changes to the HotelAI Admin project documentation and architecture.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Telegram Integration (Sprint 10)

- **Channel layer** — `lib/channels/` with Telegram parser, webhook handler, and Bot API sender.
- **Webhook route** — `POST /api/channels/telegram/webhook` (public, secret-validated).
- **Tenant AI service** — `lib/services/tenant-ai.service.ts` (`generateAIResponseForHotel`) owns AI lifecycle for staff + channels.
- **Ingress-only admin client** — webhook uses service role only for find/create conversation and guest message insert (Sprint 10.1).
- **Tests** — parser, webhook secret, conversation create/reuse, AI trigger, sender.
- **Docs** — README Telegram setup, `.env.example`, ARCHITECTURE channel flow.

### AI Stream Pipeline Unification (Sprint 8.5)

- **`AIOrchestrator.runStream()`** — streaming and non-streaming paths share one entrypoint; identical pre-flight checks (enabled, provider, rate limit), `PromptAssembler`, tool loop, `ai_actions` logging, typing/status updates.
- **`/api/ai/stream`** — reduced to auth, validation, SSE wrapper around `runStream()`; removed direct `PromptAssembler` / provider calls.
- **Tests** — `tests/unit/ai/orchestrator-stream.test.ts` covers enabled flag, provider configured, rate limiter, `ai_actions` logging, conversation status, abort cleanup.

### Production Readiness (Sprint 9)

- **README.md** — full bootstrap guide: requirements, env vars, Supabase setup, migrations, local dev, testing, CI, project structure.
- **`.env.example`** — documented all variables including optional `OPENAI_API_KEY`.
- **`package.json`** — `engines.node >= 22` aligned with CI.
- **Docs** — `DATABASE.md` migration `0010`; `ROADMAP` settings/CI/AI respond status; `ARCHITECTURE` knowledge/settings routes; `BACKLOG` TD-05 resolved, B-059/duplicate TD id clarified.

### Core Unit Tests (Sprint 8.4)

- **Vitest** — Node test environment for pure domain logic (`vitest.config.ts`, `tests/unit/`).
- **Scripts** — `npm run test`, `npm run test:watch`, `npm run test:coverage`.
- **Coverage scope** — booking price/availability (`lib/booking-logic.ts`), calendar helpers (`lib/calendar.ts`), `PromptAssembler`, `ToolExecutor`, tenant resolution (`resolveHotelId`, `getCurrentHotelId`).
- **CI** — `npm run test` runs after build in `.github/workflows/ci.yml`.
- **Testing strategy** — mock external boundaries only (Supabase, network); no OpenAI or live DB; deterministic assertions on pure functions and injectable dependencies.

### Continuous Integration (Sprint 8.3)

- **GitHub Actions** — `.github/workflows/ci.yml` runs on every `push` and `pull_request`.
- **Node.js 22** with npm dependency caching (`actions/setup-node`, `cache: npm`).
- **Pipeline** — `npm ci` → `npm run typecheck` → `npm run lint` → `npm run build`; fails on first error.
- **Build env** — placeholder `NEXT_PUBLIC_SUPABASE_*` values in CI only (no secrets, no deployment).

### Architecture & Code Quality Audit (Sprint 8.2)

- Removed dead code: legacy `PromptBuilder` shim, unused knowledge service helpers, `KnowledgePageHeaderIcon`.
- `configureAIServices` skips registry/assembler re-wiring on provider-only updates.
- OpenAI provider reuses a single SDK client instance per provider.
- Dropped unnecessary `"use client"` from `DataTable`, `GuestBookingHistory`, `BookingsStats`.

### AI Infrastructure Hardening (Sprint 8.1)

- **Lazy singleton bootstrap** — `ensureAIServicesInitialized()` in `bootstrap.ts` runs once inside `getAIServices()` (`container.ts`). Removed scattered `bootstrapAIServices()` calls from pages, API routes, and services.
- **Centralized model pricing** — `lib/ai/models.ts` (`AI_MODELS`); `estimateCostUsd()` reads rates from this file only.
- **Extended `hotel_ai_settings`** — `top_p`, `tool_choice`, `system_language`; migration `0010_ai_settings_hardening.sql`; validation, types, settings form, provider options.
- **Streaming cancellation** — `/api/ai/stream` passes `request.signal` via `AbortController`; provider and orchestrator stop on disconnect; no message persisted after abort.
- **`npm run typecheck`** — `tsc --noEmit` script added.

### Migration notes (Sprint 8.1)

- Apply `supabase/migrations/0010_ai_settings_hardening.sql` after `0009`.
- Existing rows receive defaults: `top_p=1`, `tool_choice=auto`, `system_language=ru`.

### OpenAI Integration (Sprint 8)

- **OpenAI provider** (`lib/ai/providers/openai.ts`) — Responses API, streaming SSE events, tool-call follow-up via `completeWithToolOutputs`.
- **Orchestrator** (`lib/ai/orchestrator.ts`) — `PromptAssembler` → provider → `ToolExecutor` loop; anti-hallucination instructions; logs every completion/tool call to `ai_actions`.
- **Bootstrap** (`lib/ai/bootstrap.ts`) — wires OpenAI when `OPENAI_API_KEY` is set (server-side only).
- **Migration `0009_ai_openai.sql`** — `hotel_ai_settings`, `ai_observability_logs`, extends `ai_actions` (tokens, cost, duration), `conversations.is_ai_typing`.
- **Services** — `ai-completion.service.ts` (generateAIResponse, sendGuestMessage, testAIPrompt), `ai-settings.service/mutations.ts`.
- **API routes** — `/api/ai/respond`, `/api/ai/stream` (SSE), `/api/ai/health`.
- **Resilience** — retry with backoff, timeout, per-hotel rate limiting, token usage + cost estimation.
- **Settings** (`/settings`) — model config, enable toggle, prompt test, health diagnostics, observability log.
- **Inbox** — «AI ответить», guest message simulation, streaming preview, AI typing indicator, conversation replay (`ConversationReplay`).

### Migration notes (Sprint 8)

- Apply `supabase/migrations/0009_ai_openai.sql` after `0008`.
- Set `OPENAI_API_KEY` in server env (never expose to client).
- Enable AI per hotel at `/settings`.

### Knowledge Base & AI Tools (Sprint 7)

- **Knowledge CRUD module** (`components/dashboard/knowledge/`) — `KnowledgePage`, `KnowledgeTable`, `KnowledgeEditor`, create/delete dialogs, filters, search, categories, preview, status badge, empty/loading/error states.
- **Routes** `/knowledge` + `/knowledge/[id]` with `loading.tsx` + `error.tsx`.
- **Migration `0008_knowledge_base.sql`** — extends `knowledge_articles`: `language`, `priority`, `status`, `version`, `created_by`, `updated_by`, `search_keywords` + indexes.
- **Editor** — Markdown + preview, autosave, word count, tags/keywords, publish/unpublish, duplicate, archive.
- **Search pipeline** — `lib/knowledge-search.ts` ranked lexical search (title, body, tags, category, keywords, priority, language); prepared for embeddings.
- **AI intelligence layer** — `PromptAssembler`, `ContextBuilder`, `SystemPromptBuilder`, `ConversationMemory`, `ToolRegistry`/`ToolResolver`/`ToolExecutor`, 7 built-in tools in `lib/ai/tools/`.
- **Validation** — `lib/validations/ai-tools.ts` (tool input/output Zod schemas).
- **Inbox** — `KnowledgePanel` now shows published articles only; link to `/knowledge` when empty.

### Migration notes (Sprint 7)

- Apply `supabase/migrations/0008_knowledge_base.sql` after `0007`.
- OpenAI is **not** wired; `PromptAssembler` prepares `AIRequest` only.
- `ai_actions` population awaits provider integration (B-060).

### AI Receptionist foundation (Sprint 6)

- **New AI module** (`components/dashboard/ai/`) — production inbox UI: `AIInboxPage`, `ConversationList`, `ConversationView`, `MessageBubble`, `MessageComposer`, `ConversationHeader`, `LeadCard`, `KnowledgePanel`, `QuickActions`, `TypingIndicator`, `EmptyConversation`, `AIStatusBadge`.
- **Route** `/ai` with `loading.tsx` + `error.tsx`; **AppShell** nav item "AI Receptionist".
- **Migration `0007_ai_receptionist.sql`** — `conversations`, `messages`, `knowledge_articles`, `ai_actions`, `conversation_tags`, `conversation_assignments`; all tenant-scoped with RLS, indexes, soft delete on conversations/messages/articles.
- **Services** — `ai.service.ts` / `ai.mutations.ts` (CRUD conversations, send message, assign, status/priority, tags, archive); `knowledge.service.ts` / `knowledge.mutations.ts` (article CRUD, pin, soft delete).
- **Domain types** — `types/conversation.ts`, `types/message.ts`, `types/knowledge-article.ts`, `types/ai-action.ts`.
- **Provider layer** (`lib/ai/`) — `AIProvider`, `AIRequest`/`AIResponse`, `AITool`, `KnowledgeRetriever`, `PromptBuilder`; DI via `configureAIServices()`. `unconfiguredAIProvider` throws — **no fake AI responses**.
- **Validation** — `lib/validations/ai.ts`, `lib/validations/knowledge.ts` (Zod, shared client + server).
- **Metadata** — `lib/ai/metadata.ts` (status/channel/priority labels and badge styles).

### Migration notes (Sprint 6)

- Apply `supabase/migrations/0007_ai_receptionist.sql`.
- OpenAI is **not** wired; call `configureAIServices({ provider: openAIAdapter })` when the adapter ships.
- Guest messages from external channels will populate `messages` via future webhooks (see TD-23).

### Calendar Pro (Sprint 5)

- **Rebuilt the reservation calendar** (`components/dashboard/calendar/`) — replaced the static month grid prototype with a production timeline. Removed `CalendarGrid`, `CalendarHeader`, `CalendarRoomRow`, `CalendarBooking`, and the dead `components/dashboard/calendar/page.tsx` duplicate route.
- **Horizontal timeline** — sticky room column (`CalendarRoomCell`) + sticky date header (`CalendarDateHeader`), booking bars spanning multiple days with half-open `[check_in, check_out)` placement.
- **Navigation** — month/week view toggle, prev/next by view unit, and Today shortcut (`CalendarToolbar`).
- **Row virtualization** — `CalendarTimeline` windows visible room rows (fixed row height + overscan) for large room lists.
- **Drag & resize** — `CalendarBookingBar` supports pointer drag to move and edge handles to change duration, snapped to day columns, with optimistic UI and revert on failure. Keyboard equivalents: arrows move ±1 day, Shift+arrows resize, Enter opens details.
- **Overlap prevention** — client-side `hasRoomConflict` guard plus the server `rescheduleBooking` mutation (`ensureRoomAvailable` + DB exclusion constraint).
- **Booking detail** — clicking a bar (or agenda item) opens the existing `BookingEditDialog`.
- **Visualization** — status colors via new `barClassName` in `lib/booking-status.ts`, hover/focus summary card, per-day occupancy bars, per-room availability bars, empty-room highlighting, weekend + current-day tinting.
- **Shared utilities** — `lib/calendar.ts` (date math, day-range builder, booking placement, occupancy, overlap helpers, layout constants).
- **Validation** — `bookingRescheduleSchema` + `rescheduleBooking` mutation (dates/room only, reuses price + availability helpers).
- **Responsive** — desktop timeline (`md:block`) with a mobile agenda fallback (`CalendarAgenda`, `md:hidden`).
- **States** — `app/calendar/loading.tsx`, `app/calendar/error.tsx`, and an empty state when no rooms exist.

### Migration notes (Sprint 5)

- No database migration required; `rescheduleBooking` reuses the existing bookings schema and the `0002` no-overlap exclusion constraint.
- Reschedule is same-room only; changing a booking's room still goes through `BookingEditDialog` (see TD-21).

### Guest CRM (Sprint 4)

- **New Guests module** (`components/dashboard/guests/`) following feature architecture — list, profile, search, filters, CRUD, all tenant-scoped.
- **Routes:** `/guests` (list) and `/guests/[id]` (profile) with `loading.tsx` + `error.tsx`; added a "Гости" sidebar link.
- **Migration `0006_guests_crm.sql`** — adds `tags text[]`, `is_vip`, `is_favorite`, `avatar_url`, `deleted_at` to `guests` plus a partial active-list index, VIP/favorite partial indexes, and a GIN tags index.
- **Service reads** (`guests.service.ts`): `getGuests` (excludes soft-deleted), `getGuest`, `getGuestBookings` (matches history by email, then name).
- **Mutations** (`guests.mutations.ts`): `createGuest`, `updateGuest`, `deleteGuest` (soft delete via `deleted_at`), `setGuestVip`, `setGuestFavorite`, `mergeGuests` (unions tags/notes, fills contacts, archives the duplicate) — all Zod-validated and tenant-scoped.
- **Stay statistics** — pure `lib/guest-stats.ts` computes total bookings, total nights, total revenue, last stay, and upcoming check-in from booking history.
- **Reusable components:** `GuestForm`, `GuestsTable` (shared `DataTable` + optimistic soft-delete + favorite toggle), `GuestProfileCard`, `GuestStats`, `GuestBookingHistory`, `GuestAvatar` (image/initials), `GuestTags`, `GuestTagsInput`, `GuestCreateDialog`/`GuestEditDialog`, `MergeGuestsDialog`, `GuestProfileActions`.
- **Shared validation** — `lib/validations/guest.ts` (create/update schemas) used by forms (inline errors) and mutations (server backstop).
- **New primitive** — `components/ui/textarea.tsx`.
- **A11y** — labeled fields (`aria-invalid`/`aria-describedby`), `aria-label`/`aria-pressed` on icon actions, table captions, and `dl`-based profile contact list.
- **States** — loading skeletons, error boundaries, and empty states for guests list, profile, and booking history.

### Migration notes (Sprint 4)

- Apply `supabase/migrations/0006_guests_crm.sql`.
- Guest booking history is derived by matching email/name (bookings have no `guest_id` yet — see TD-17).
- Deleting a guest is a **soft delete**; the row is hidden but retained. The email uniqueness constraint still covers tombstones (TD-19).

### Rooms & Bookings stabilization (Sprint 3)

- **Wired `/bookings` to the real feature.** `app/bookings/page.tsx` now renders the full `BookingsPage` (stats + filters + table + create/edit sheets) instead of a duplicate stats dashboard (closes B-004). The previously unreachable Bookings CRUD UI is now live.
- **Zod validation** — new `lib/validations/{room,booking}.ts` schemas shared by forms (inline field errors) and Server Actions (server-side backstop that throws localized messages). Closes B-015.
- **Reusable `DataTable`** (`components/dashboard/DataTable.tsx`) with column defs, screen-reader caption, and standardized empty state; `RoomsTable` and `BookingsTable` now use it, removing duplicated table markup. Closes part of the table review.
- **`ConfirmDialog`** (`components/ui/confirm-dialog.tsx`, base-ui) replaces native `confirm()` in `RoomsTable` and `BookingsTable`.
- **Optimistic delete** — both tables use `useOptimistic` to remove the row immediately and revert on error.
- **Loading & error states** — added `loading.tsx` and `error.tsx` for `/rooms` and `/bookings` (closes B-014); `rooms.service` now throws on error like `bookings.service` (closes B-019).
- **Deduped types & constants** — booking status labels/badge styles/filter options centralized in `lib/booking-status.ts`; `BookingCreateDialog`/`BookingForm` use the shared `Room` type instead of local duplicates.
- **Accessibility** — labeled form fields (`<label>` + `aria-invalid`/`aria-describedby`), `aria-label` on icon-only action buttons, `scope="col"` headers and table captions.
- **Dead code removed** — stale `components/dashboard/bookings/Untitled` (old `BookingsPage` copy) and the now-unused overview `components/dashboard/dashboard/DashboardStats.tsx`.
- Broadened `revalidatePath` in room/booking mutations to also refresh `/` and `/calendar`.

### Database hardening (Sprint 2)

- `0002_constraints_indexes.sql` — foreign keys (`*_hotel_id → hotels`, `bookings.room_id → rooms`) with cascade rules, check constraints (dates, non-negative prices/counts, status enums), unique guest email per hotel, hot-path indexes, a `bookings_no_overlap` GiST exclusion constraint, and `updated_at` triggers. FK/CHECK added `NOT VALID` then validated with warn-not-abort for legacy data.
- `0003_rls_optimization.sql` — rewrote business-table RLS to `TO authenticated` using `(select auth.uid())` + a cached membership sub-select (no per-row `SECURITY DEFINER` call); policies generated in a loop to remove duplicated SQL.
- `0004_harden_leads_rpc.sql` — `list_hotel_leads` / `update_lead_status` now enforce `is_hotel_member()` and validate input (closes the RLS-bypass gap, TD-08).
- `0005_realtime_leads.sql` — `leads` replica identity full + `supabase_realtime` publication membership so `hotel_id`-filtered realtime works across all events.
- Removed dead `RealtimeListener` component and the phantom `hotel_leads` table from docs; the only live realtime subscription is `DashboardPage` → `leads`.
- Rewrote `DATABASE.md` with per-table constraints/indexes, an Indexes & Performance section, and the updated RLS/RPC/realtime model.

### Added

- **Supabase Auth** integration via `@supabase/ssr` (cookie-based sessions)
  - `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server), `lib/supabase/session.ts` (proxy helper)
  - Sign in (`/login` + `LoginForm` + `signIn` action), sign out (`SignOutButton` + `signOut` action)
- **`proxy.ts`** (Next.js 16 Proxy/middleware) — refreshes sessions and blocks anonymous users from all routes except `/login`
- **`lib/tenant.ts`** — `currentHotel` abstraction: `getCurrentUser`, `requireUser`, `getCurrentHotelId`, `getCurrentHotel`
- **Multi-tenancy + RLS migration** `supabase/migrations/0001_auth_multitenancy_rls.sql` — `hotels`, `memberships`, `is_hotel_member()`, and RLS policies on all business tables
- `types/lead.ts` — shared `Lead` / `LeadStatus` types
- `lib/services/leads.service.ts` + `lib/services/leads.mutations.ts` — normalized leads read/write
- `lib/services/auth.mutations.ts` — auth Server Actions
- `.env.example` — documented environment variables
- Project documentation structure (`docs/`) and Cursor AI rules (`.cursor/rules/`)

### Changed

- All `*.service.ts` reads and `*.mutations.ts` writes now resolve the hotel via `getCurrentHotelId()` and scope queries with `.eq("hotel_id", …)` — no hardcoded `hotel_aurora` in service code
- Client components (`DashboardPage`, `RealtimeListener`) use the browser Supabase client and tenant-scoped realtime channels
- `LeadStatusActions` now calls the `updateLeadStatus` Server Action instead of a client-side RPC (removed `alert()`)
- `RoomForm` no longer accepts a `hotelId` prop; the server action resolves the tenant
- `AppShell` shows the active hotel (`hotel` prop) and includes a sign-out button; fixed dead `/leads` nav link
- Removed `lib/supabase.ts` singleton in favor of the `lib/supabase/*` client factories
- Simplified `.cursor/rules/*.mdc` so rules point to canonical docs instead of duplicating long-form guidance

### Migration notes

- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `DEFAULT_HOTEL_ID` (see `.env.example`)
- Apply `supabase/migrations/0001_auth_multitenancy_rls.sql`, then create users in Supabase Auth and add `memberships` rows (or set `app_metadata.hotel_id`)
- Update `list_hotel_leads` / `update_lead_status` RPCs to check `is_hotel_member()` before enabling them for untrusted tenants

---

## [0.1.0] — 2026-03-28

### Added

- Initial Next.js 16 admin panel with Supabase backend
- Leads dashboard with realtime updates
- Rooms CRUD (create, edit, delete)
- Bookings CRUD with room conflict detection and price calculation
- Calendar view (room × date grid)
- Dashboard stats (occupancy, revenue, counts)
- Guest service layer (types, queries, mutations — UI pending)
- App shell with sidebar navigation
- shadcn/ui component library (base-nova style)
- Dark theme with Geist font

### Known Issues

- Hardcoded tenant ID (`hotel_aurora`)
- Duplicate dashboard implementations (leads vs stats)
- `Lead` type not yet in `types/`
- No authentication or RLS
- Several nav routes are placeholders (`/pricing`, `/settings`, `/knowledge`)

---

[Unreleased]: https://github.com/hotelai/hotelai-admin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hotelai/hotelai-admin/releases/tag/v0.1.0
