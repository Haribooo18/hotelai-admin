# Changelog

All notable changes to the HotelAI Admin project documentation and architecture.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

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
