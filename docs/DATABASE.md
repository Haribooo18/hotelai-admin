# HotelAI — Database Schema

Database: **Supabase (PostgreSQL)**  
Schema: `public`  
Auth: **Supabase Auth** (`auth.users`)  
Multi-tenancy: domain tables include `hotel_id`, enforced in the app (query scoping) **and** in the database (Row Level Security).

> This document reflects tables and RPC functions **currently used in the codebase**. Columns inferred from TypeScript types, service queries, and mutation payloads.

> **Migrations** (`supabase/migrations/`):
> - `0001_auth_multitenancy_rls.sql` — tenant tables (`hotels`, `memberships`), `is_hotel_member()`, RLS enablement + baseline policies.
> - `0002_constraints_indexes.sql` — foreign keys, check/unique constraints, indexes, no-overlap exclusion, `updated_at` triggers.
> - `0003_rls_optimization.sql` — RLS policies rewritten for performance (`(select auth.uid())` + membership sub-select, `TO authenticated`).
> - `0004_harden_leads_rpc.sql` — membership checks inside `list_hotel_leads` / `update_lead_status`.
> - `0005_realtime_leads.sql` — `leads` replica identity + realtime publication.
> - `0006_guests_crm.sql` — guest CRM columns (`tags`, `is_vip`, `is_favorite`, `avatar_url`, `deleted_at`) + supporting indexes (Sprint 4).
> - `0007_ai_receptionist.sql` — AI Receptionist tables (`conversations`, `messages`, `knowledge_articles`, `ai_actions`, `conversation_tags`, `conversation_assignments`) + RLS (Sprint 6).
> - `0008_knowledge_base.sql` — extends `knowledge_articles` (Sprint 7).
> - `0009_ai_openai.sql` — `hotel_ai_settings`, `ai_observability_logs`, extends `ai_actions`, `is_ai_typing` (Sprint 8).
> - `0010_ai_settings_hardening.sql` — `top_p`, `tool_choice`, `system_language` on `hotel_ai_settings` (Sprint 8.1).

---

## Entity Relationship Overview

```
auth.users ──< memberships >── hotels
                                  │  (FK hotel_id, ON DELETE CASCADE)
                                  ├── rooms
                                  │     └──< bookings.room_id → rooms.id (ON DELETE RESTRICT)
                                  ├── bookings
                                  ├── guests
                                  ├── leads
                                  ├── conversations ──< messages
                                  │        ├──< conversation_tags
                                  │        └──< conversation_assignments
                                  ├── knowledge_articles
                                  └── ai_actions (optional FK → conversations, messages)
```

All `hotel_id` columns are foreign keys to `hotels(id)` (`ON DELETE CASCADE`). `bookings.room_id` references `rooms(id)` (`ON DELETE RESTRICT`, to preserve reservation history).

---

## Tables

### `hotels`

Tenant registry. One row per property.

| Column       | Type          | Nullable | Description                     |
|--------------|---------------|----------|---------------------------------|
| `id`         | `text`        | NO       | Primary key (e.g. `hotel_aurora`) |
| `name`       | `text`        | NO       | Display name                    |
| `created_at` | `timestamptz` | NO       | Creation timestamp              |

**Used by:** tenant resolution (`lib/tenant.ts`) and RLS policies.

---

### `memberships`

Maps authenticated users to the hotels they can access. Source of truth for `is_hotel_member()`.

| Column       | Type          | Nullable | Description                                  |
|--------------|---------------|----------|----------------------------------------------|
| `user_id`    | `uuid`        | NO       | FK → `auth.users.id` (part of PK)            |
| `hotel_id`   | `text`        | NO       | FK → `hotels.id` (part of PK)                |
| `role`       | `text`        | NO       | `owner` \| `manager` \| `staff` (default `staff`) |
| `created_at` | `timestamptz` | NO       | Creation timestamp                           |

**Used by:** `public.is_hotel_member()` (RLS), future role-based authorization.

---

### `rooms`

Hotel room inventory. Each row is a sellable room unit.

| Column      | Type          | Nullable | Description                          |
|-------------|---------------|----------|--------------------------------------|
| `id`        | `uuid`        | NO       | Primary key                          |
| `hotel_id`  | `text`        | NO       | Tenant identifier (e.g. `hotel_aurora`) |
| `room_type` | `text`        | NO       | Display name / category (e.g. "Deluxe") |
| `capacity`  | `integer`     | NO       | Maximum guests                       |
| `price`     | `numeric`     | NO       | Base nightly rate (USD)              |

**Constraints & indexes:**
- FK `hotel_id → hotels(id)` `ON DELETE CASCADE`
- `check (capacity > 0)`, `check (price >= 0)`
- Index `rooms_hotel_type_idx (hotel_id, room_type)`

**Used by:**
- `lib/services/rooms.service.ts` — `getRooms()`, `getAvailableRooms()`
- `lib/services/rooms.mutations.ts` — `createRoom`, `updateRoom`, `deleteRoom`
- `lib/services/bookings.mutations.ts` — `calculateTotalPrice()` reads `price`
- `lib/services/dashboard.service.ts` — room count

**TypeScript:** `types/room.ts` → `Room`

---

### `bookings`

Reservations linking a guest to a room for a date range.

| Column        | Type          | Nullable | Description                              |
|---------------|---------------|----------|------------------------------------------|
| `id`          | `uuid`        | NO       | Primary key                              |
| `hotel_id`    | `text`        | NO       | Tenant identifier                        |
| `room_id`     | `uuid`        | NO       | FK → `rooms.id`                          |
| `guest_name`  | `text`        | NO       | Guest full name (denormalized)           |
| `guest_email` | `text`        | YES      | Guest email                              |
| `guest_phone` | `text`        | YES      | Guest phone                              |
| `check_in`    | `date`        | NO       | Arrival date (ISO string in app)         |
| `check_out`   | `date`        | NO       | Departure date                           |
| `adults`      | `integer`     | NO       | Number of adults (default not set in mutations) |
| `children`    | `integer`     | NO       | Number of children                       |
| `total_price` | `numeric`     | NO       | Calculated: `room.price × nights`        |
| `status`      | `text`        | NO       | `confirmed` \| `checked_in` \| `checked_out` \| `cancelled` |
| `created_at`  | `timestamptz` | NO       | Record creation time                     |
| `updated_at`  | `timestamptz` | NO       | Last update time                         |

**Business rules:**
- Overlapping bookings for the same `room_id` are rejected (excluding `cancelled`) — enforced in the app **and** by the `bookings_no_overlap` exclusion constraint
- `total_price` recalculated on create/update
- Minimum 1 night stay

**Constraints & indexes:**
- FK `hotel_id → hotels(id)` `ON DELETE CASCADE`; FK `room_id → rooms(id)` `ON DELETE RESTRICT`
- `check (check_out > check_in)`, `check (total_price >= 0)`, `check (adults >= 0 and children >= 0)`
- `check (status in ('confirmed','checked_in','checked_out','cancelled'))`
- Exclusion `bookings_no_overlap` — GiST on `(room_id, daterange(check_in, check_out, '[)'))` where `status <> 'cancelled'`
- Indexes: `bookings_hotel_checkin_idx (hotel_id, check_in desc)`, `bookings_hotel_status_idx (hotel_id, status)`, `bookings_room_dates_idx (room_id, check_in, check_out)`
- Trigger `set_bookings_updated_at` maintains `updated_at`

**Used by:**
- `lib/services/bookings.service.ts` — `getBookings()`
- `lib/services/bookings.mutations.ts` — `createBooking`, `updateBooking`, `deleteBooking`
- `lib/services/dashboard.service.ts` — booking count, revenue sum, occupied count
- `components/dashboard/calendar/` — timeline rendering

**TypeScript:** `types/booking.ts` → `Booking`, `BookingStatus`

---

### `guests`

Guest CRM records. Booking history is matched by email/name at query time — bookings still store inline guest fields (no `guest_id` FK; see TD-11).

| Column           | Type          | Nullable | Description                    |
|------------------|---------------|----------|--------------------------------|
| `id`             | `uuid`        | NO       | Primary key                    |
| `hotel_id`       | `text`        | NO       | Tenant identifier              |
| `first_name`     | `text`        | NO       |                                |
| `last_name`      | `text`        | NO       |                                |
| `email`          | `text`        | YES      |                                |
| `phone`          | `text`        | YES      |                                |
| `country`        | `text`        | YES      |                                |
| `city`           | `text`        | YES      |                                |
| `notes`          | `text`        | YES      | Staff notes                    |
| `tags`           | `text[]`      | NO       | Free-form tags (default `{}`)  |
| `is_vip`         | `boolean`     | NO       | VIP flag (default `false`)     |
| `is_favorite`    | `boolean`     | NO       | Favorite flag (default `false`)|
| `avatar_url`     | `text`        | YES      | Avatar image URL               |
| `total_bookings` | `integer`     | NO       | Denormalized counter (default 0) |
| `total_spent`    | `numeric`     | NO       | Denormalized total (default 0) |
| `deleted_at`     | `timestamptz` | YES      | Soft-delete tombstone (NULL = active) |
| `created_at`     | `timestamptz` | NO       |                                |
| `updated_at`     | `timestamptz` | NO       |                                |

**Constraints & indexes:**
- FK `hotel_id → hotels(id)` `ON DELETE CASCADE`
- `check (total_bookings >= 0 and total_spent >= 0)`
- Unique `guests_hotel_email_unique (hotel_id, lower(email))` where `email is not null`
- Index `guests_hotel_created_idx (hotel_id, created_at desc)`
- Index `guests_hotel_active_created_idx (hotel_id, created_at desc) where deleted_at is null` — default list
- Partial indexes `guests_hotel_vip_idx`, `guests_hotel_favorite_idx` for flag filters
- GIN index `guests_tags_gin_idx (tags)` for tag membership
- Trigger `set_guests_updated_at` maintains `updated_at`

**Used by:**
- `lib/services/guests.service.ts` — `getGuests()`, `getGuest()`, `getGuestBookings()`
- `lib/services/guests.mutations.ts` — `createGuest`, `updateGuest`, `deleteGuest` (soft), `setGuestVip`, `setGuestFavorite`, `mergeGuests`
- Stay statistics computed in `lib/guest-stats.ts` (pure) from booking history

**TypeScript:** `types/guest.ts` → `Guest`

---

### `leads`

Incoming guest inquiries captured by the AI receptionist or manual entry.

| Column       | Type          | Nullable | Description                              |
|--------------|---------------|----------|------------------------------------------|
| `lead_id`    | `uuid`        | NO       | Primary key (exposed as `lead_id` in RPC)  |
| `hotel_id`   | `text`        | NO       | Tenant identifier                        |
| `created_at` | `timestamptz` | NO       | When the inquiry was received            |
| `guest_name` | `text`        | YES      | Guest name from conversation             |
| `phone`      | `text`        | YES      | Contact phone                            |
| `email`      | `text`        | YES      | Contact email                            |
| `room_type`  | `text`        | YES      | Requested room category                  |
| `check_in`   | `date`        | YES      | Requested arrival                        |
| `check_out`  | `date`        | YES      | Requested departure                      |
| `guests`     | `integer`     | YES      | Number of guests                         |
| `status`     | `text`        | YES      | `new` \| `contacted` \| `confirmed` \| `cancelled` |
| `comment`    | `text`        | YES      | Additional notes from AI or staff        |

**Constraints & indexes:**
- FK `hotel_id → hotels(id)` `ON DELETE CASCADE`
- `check (status is null or status in ('new','contacted','confirmed','cancelled'))`
- `check (guests is null or guests >= 0)`
- Indexes: `leads_hotel_created_idx (hotel_id, created_at desc)`, `leads_hotel_status_idx (hotel_id, status)`
- `replica identity full` + member of `supabase_realtime` publication (for realtime filters)

**Used by:**
- `app/page.tsx` / `lib/services/leads.service.ts` — initial fetch via `list_hotel_leads`
- `components/dashboard/DashboardPage.tsx` — realtime subscription on `leads` table
- `app/LeadStatusActions.tsx` / `lib/services/leads.mutations.ts` — status updates via `update_lead_status`

**TypeScript:** `types/lead.ts` → `Lead`, `LeadStatus`

> The former `hotel_leads` realtime subscription (`RealtimeListener`) was dead code and was removed in Sprint 2. There is no `hotel_leads` object in the schema.

---

## AI Receptionist (Sprint 6)

### `conversations`

Guest conversation threads across channels.

| Column                 | Type          | Nullable | Description |
|------------------------|---------------|----------|-------------|
| `id`                   | `uuid`        | NO       | Primary key |
| `hotel_id`             | `text`        | NO       | Tenant |
| `guest_name`           | `text`        | NO       | |
| `guest_email`          | `text`        | YES      | |
| `guest_phone`          | `text`        | YES      | |
| `channel`              | `text`        | NO       | `website` \| `whatsapp` \| `telegram` \| `instagram` \| `facebook_messenger` \| `email` |
| `status`               | `text`        | NO       | `new` \| `assigned` \| `ai_answering` \| `waiting_guest` \| `resolved` \| `archived` |
| `priority`             | `text`        | NO       | `low` \| `normal` \| `high` \| `urgent` |
| `lead_id`              | `text`        | YES      | Optional link to `leads.lead_id` |
| `subject`              | `text`        | YES      | |
| `last_message_preview` | `text`        | YES      | Denormalized snippet |
| `last_message_at`      | `timestamptz` | YES      | |
| `unread_count`         | `integer`     | NO       | Staff unread counter |
| `assigned_to`          | `uuid`        | YES      | Current assignee (`auth.users`) |
| `is_guest_typing`      | `boolean`     | NO       | Channel typing indicator |
| `internal_notes`       | `text`        | YES      | Staff-only notes |
| `deleted_at`           | `timestamptz` | YES      | Soft delete |
| `created_at`           | `timestamptz` | NO       | |
| `updated_at`           | `timestamptz` | NO       | |

**Used by:** `lib/services/ai.service.ts`, `lib/services/ai.mutations.ts`

### `messages`

Messages within a conversation.

| Column            | Type          | Nullable | Description |
|-------------------|---------------|----------|-------------|
| `id`              | `uuid`        | NO       | Primary key |
| `hotel_id`        | `text`        | NO       | Tenant |
| `conversation_id` | `uuid`        | NO       | FK → `conversations` |
| `role`            | `text`        | NO       | `guest` \| `staff` \| `ai` \| `system` |
| `body`            | `text`        | NO       | |
| `is_internal`     | `boolean`     | NO       | Internal staff note |
| `metadata`        | `jsonb`       | NO       | Provider/channel metadata |
| `deleted_at`      | `timestamptz` | YES      | Soft delete |
| `created_at`      | `timestamptz` | NO       | |

**Used by:** `getMessages`, `sendMessage`

### `knowledge_articles`

Hotel knowledge base for RAG / staff reference.

| Column            | Type          | Nullable | Description |
|-------------------|---------------|----------|-------------|
| `id`              | `uuid`        | NO       | Primary key |
| `hotel_id`        | `text`        | NO       | Tenant |
| `title`           | `text`        | NO       | |
| `slug`            | `text`        | YES      | |
| `content`         | `text`        | NO       | Markdown body |
| `category`        | `text`        | YES      | |
| `language`        | `text`        | NO       | ISO-ish code, default `ru` (Sprint 7) |
| `priority`        | `text`        | NO       | `low` \| `normal` \| `high` (Sprint 7) |
| `status`          | `text`        | NO       | `draft` \| `published` \| `archived` (Sprint 7) |
| `version`         | `integer`     | NO       | Incremented on publish (Sprint 7) |
| `is_pinned`       | `boolean`     | NO       | |
| `tags`            | `text[]`      | NO       | |
| `search_keywords` | `text[]`      | NO       | Manual search terms; embeddings later (Sprint 7) |
| `created_by`      | `uuid`        | YES      | `auth.users` (Sprint 7) |
| `updated_by`      | `uuid`        | YES      | `auth.users` (Sprint 7) |
| `deleted_at`      | `timestamptz` | YES      | Soft delete |
| `created_at`      | `timestamptz` | NO       | |
| `updated_at`      | `timestamptz` | NO       | |

**Indexes (Sprint 7):** `knowledge_articles_hotel_status_idx`, `knowledge_articles_hotel_language_idx`, `knowledge_articles_hotel_category_idx`, `knowledge_articles_hotel_priority_idx`, `knowledge_articles_search_keywords_gin_idx`.

**Used by:** `lib/services/knowledge.service.ts`, `lib/services/knowledge.mutations.ts`, `lib/ai/server-knowledge-retriever.ts`, `lib/knowledge-search.ts`

### `ai_actions`

Audit log for AI tool calls and automations (populated when OpenAI integration ships).

| Column            | Type          | Nullable | Description |
|-------------------|---------------|----------|-------------|
| `id`              | `uuid`        | NO       | Primary key |
| `hotel_id`        | `text`        | NO       | Tenant |
| `conversation_id` | `uuid`        | YES      | |
| `message_id`      | `uuid`        | YES      | |
| `action_type`     | `text`        | NO       | e.g. `tool_call`, `completion` |
| `tool_name`       | `text`        | YES      | |
| `input`           | `jsonb`       | NO       | |
| `output`          | `jsonb`       | YES      | |
| `status`          | `text`        | NO       | `pending` \| `completed` \| `failed` |
| `error_message`   | `text`        | YES      | |
| `created_at`      | `timestamptz` | NO       | |
| `completed_at`    | `timestamptz` | YES      | |

### `conversation_tags`

Free-form tags on conversations. Unique per `(conversation_id, tag)`.

### `conversation_assignments`

Assignment history (`is_active` marks the current assignment row).

**TypeScript:** `types/conversation.ts`, `types/message.ts`, `types/knowledge-article.ts`, `types/ai-action.ts`

---

## RPC Functions

### `list_hotel_leads`

Returns leads for a specific hotel.

**Parameters:**

| Parameter     | Type      | Description          |
|---------------|-----------|----------------------|
| `p_hotel_id`  | `text`    | Hotel tenant ID      |
| `p_limit`     | `integer` | Max rows to return   |

**Returns:** `setof public.leads` (matching the `Lead` type shape).

**Security:** `SECURITY DEFINER`; raises `42501` unless the caller `is_hotel_member(p_hotel_id)` (migration `0004`).

**Used by:**
- `lib/services/leads.service.ts` (`getLeads`) — used by `app/page.tsx`
- `components/dashboard/DashboardPage.tsx` (realtime refresh)

---

### `update_lead_status`

Updates the status of a lead.

**Parameters:**

| Parameter    | Type   | Description                                        |
|--------------|--------|----------------------------------------------------|
| `p_lead_id`  | `uuid` | Lead to update                                     |
| `p_status`   | `text` | New status: `new`, `contacted`, `confirmed`, `cancelled` |

**Security:** `SECURITY DEFINER`; resolves the lead's hotel, raises `42501` unless the caller is a member, validates `p_status` (migration `0004`).

**Used by:**
- `lib/services/leads.mutations.ts` (`updateLeadStatus`) — used by `app/LeadStatusActions.tsx`

---

## Realtime Subscriptions

| Channel             | Table   | Event | Filter             | Component       |
|---------------------|---------|-------|--------------------|-----------------|
| `hotel-leads-<id>`  | `leads` | `*`   | `hotel_id=eq.<id>` | `DashboardPage` |

Requires `leads` to have `replica identity full` and be in the `supabase_realtime` publication (migration `0005`). Realtime respects RLS, so a client only receives events for hotels it belongs to.

---

## Conventions

### Tenant Scoping

Every hotel-owned query filters by `hotel_id`, resolved from `getCurrentHotelId()` (`lib/tenant.ts`) — never hardcoded. This is enforced twice:

1. **App layer:** all `*.service.ts` reads and `*.mutations.ts` writes chain `.eq("hotel_id", hotelId)`.
2. **Database layer:** RLS policies restrict every row to hotel members.

```
const hotelId = await getCurrentHotelId();
supabase.from("bookings").select("*").eq("hotel_id", hotelId);
```

`DEFAULT_HOTEL_ID` (env, default `hotel_aurora`) is a migration fallback only, used until every user has a `memberships` row / `app_metadata.hotel_id`.

### Row Level Security (RLS)

RLS is enabled on `hotels`, `memberships`, `rooms`, `bookings`, `guests`, `leads`.

Business-table policies (migration `0003`) are scoped `TO authenticated` and use a cached membership sub-select rather than a per-row function call:

```sql
using (
  hotel_id in (
    select m.hotel_id from public.memberships m
    where m.user_id = (select auth.uid())
  )
)
```

- `(select auth.uid())` is evaluated once per statement (InitPlan), not per row.
- The membership set is materialized once and applied as a semi-join.
- `memberships`: a user sees only their own rows. `hotels`: a user sees only hotels they belong to.
- `public.is_hotel_member(hid)` is retained for the `SECURITY DEFINER` RPCs.

**RPC hardening (done in `0004`):** `list_hotel_leads` / `update_lead_status` are `SECURITY DEFINER` and bypass RLS, so they now call `is_hotel_member()` internally and raise `42501` on non-members.

### Indexes & Performance

| Table    | Index                                        | Serves                                   |
|----------|----------------------------------------------|------------------------------------------|
| rooms    | `rooms_hotel_type_idx (hotel_id, room_type)` | `getRooms` / `getAvailableRooms`         |
| bookings | `bookings_hotel_checkin_idx (hotel_id, check_in desc)` | `getBookings`                   |
| bookings | `bookings_hotel_status_idx (hotel_id, status)` | dashboard occupied count               |
| bookings | `bookings_room_dates_idx (room_id, check_in, check_out)` | availability scan + `room_id` FK |
| bookings | `bookings_no_overlap` (GiST)                 | overlap prevention + range lookups       |
| guests   | `guests_hotel_active_created_idx (hotel_id, created_at desc) where deleted_at is null` | `getGuests` (active list) |
| guests   | `guests_hotel_vip_idx` / `guests_hotel_favorite_idx` (partial) | VIP / favorite filters          |
| guests   | `guests_tags_gin_idx (tags)` GIN             | tag membership filter                    |
| leads    | `leads_hotel_created_idx (hotel_id, created_at desc)` | `list_hotel_leads`               |
| leads    | `leads_hotel_status_idx (hotel_id, status)`  | status filters                           |
| conversations | `conversations_hotel_active_idx` (partial) | `getConversations` inbox list        |
| messages | `messages_conversation_created_idx`          | `getMessages` thread                     |
| knowledge_articles | `knowledge_articles_hotel_active_idx` | `getKnowledgeArticles`           |
| ai_actions | `ai_actions_conversation_idx`              | future AI audit queries                  |
| memberships | `memberships_user_id_idx`, `memberships_hotel_id_idx` | RLS membership lookups          |

Every hot-path query is now index-backed on its `hotel_id` prefix, so tenant-scoped scans stay logarithmic as data grows.

### Timestamps

- Store as `timestamptz` in Postgres
- Serialize as ISO 8601 strings in TypeScript (`string` type)
- Date-only fields (`check_in`, `check_out`) stored as `date`, handled as `YYYY-MM-DD` strings

### Status Enums

| Table     | Column   | Values                                              |
|-----------|----------|-----------------------------------------------------|
| `bookings`| `status` | `confirmed`, `checked_in`, `checked_out`, `cancelled` |
| `leads`   | `status` | `new`, `contacted`, `confirmed`, `cancelled`        |

### Currency

Prices stored as `numeric`. Displayed with `$` prefix in UI. Currency field per hotel is roadmap (Settings).

---

## Planned Tables (Not Yet in Codebase)

| Table              | Purpose                        | Roadmap Area    |
|--------------------|--------------------------------|-----------------|
| `room_status`      | Housekeeping state per room    | Housekeeping    |
| `payments`         | Payment records per booking    | Payments        |
| `pricing_rules`    | Seasonal / dynamic rates       | Pricing         |
| `knowledge_articles`| FAQ for AI receptionist       | AI              |
| `integrations`     | Third-party connection config  | Integrations    |

---

## Migration Guidelines

1. All schema changes via Supabase migrations (SQL files in repo when added)
2. Update `types/<entity>.ts` to match new columns
3. Update this document
4. Update affected `*.service.ts` and `*.mutations.ts`
5. Add RLS policies before production deployment
