# HotelAI — Backlog

Prioritized work items derived from the roadmap and current technical debt. Use this as the sprint planning source of truth.

**Priority:** P0 (critical) · P1 (high) · P2 (medium) · P3 (low)

---

## P0 — Critical / Blocking

| ID    | Item                                           | Area        | Notes |
|-------|------------------------------------------------|-------------|-------|
| ~~B-001~~ | ~~Resolve duplicate dashboard implementations~~ | Dashboard | ✅ Sprint 3 — `/bookings` now renders `BookingsPage`; overview `DashboardStats` removed (see TD-14) |
| ~~B-002~~ | ~~Add Supabase Auth and replace hardcoded `hotel_id`~~ | Platform | ✅ Sprint 1 — Supabase Auth + `lib/tenant.ts` |
| ~~B-003~~ | ~~Enable Row Level Security on all tables~~   | Database    | ✅ Sprint 1 — migration `0001_auth_multitenancy_rls.sql` (apply on Supabase) |
| ~~B-004~~ | ~~Wire `/bookings` route to the existing `BookingsPage`~~ | Bookings | ✅ Sprint 3 — route renders `BookingsPage` with bookings + rooms |
| ~~B-005~~ | ~~Move `Lead` type to `types/lead.ts`~~       | Architecture| ✅ Sprint 1 |

---

## P1 — High Priority

| ID    | Item                                           | Area        | Notes |
|-------|------------------------------------------------|-------------|-------|
| ~~B-010~~ | ~~Guests page (`/guests`) with list and CRUD UI~~ | Guests | ✅ Sprint 4 — full Guest CRM (list, profile, search/filters, CRUD, merge, soft delete) |
| B-011 | Lead → Booking conversion flow                   | Bookings    | One-click from leads table |
| B-012 | Check-in / check-out status workflow             | Bookings    | Update `BookingStatus` via UI |
| B-013 | Consolidate leads into `components/dashboard/leads/` | Architecture | Feature-first cleanup |
| ~~B-014~~ | ~~Add `loading.tsx` and `error.tsx` per route~~ | Platform | ✅ Sprint 3 — added for `/rooms` and `/bookings` (other routes pending, TD-15) |
| ~~B-015~~ | ~~Zod validation for booking and room forms~~ | Forms | ✅ Sprint 3 — `lib/validations/{room,booking}.ts` shared client + server |
| B-016 | Settings page — hotel profile basics             | Settings    | Name, timezone, contact |
| B-017 | Pricing page — view and edit base rates            | Pricing     | Nav link already exists |
| B-018 | Calendar booking click → detail/edit sheet       | Calendar    | |
| ~~B-019~~ | ~~Standardize error handling in services~~ | Architecture | ✅ Sprint 3 — `rooms.service` now throws like `bookings.service` |
| ~~B-020~~ | ~~Remove stray `Untitled` file in bookings folder~~ | Cleanup | ✅ Sprint 3 |

---

## P2 — Medium Priority

| ID    | Item                                           | Area        | Notes |
|-------|------------------------------------------------|-------------|-------|
| B-030 | Housekeeping room status board                   | Housekeeping| |
| B-031 | Link bookings to guest records                   | Guests      | Replace inline guest fields |
| B-032 | Booking notes and special requests field         | Bookings    | DB column + form |
| B-033 | Email notification on booking create             | Bookings    | Supabase Edge Function or Resend |
| B-034 | FAQ / Knowledge base page (`/knowledge`)           | AI          | Nav link exists |
| B-035 | Revenue chart with real booking data               | Dashboard   | Replace mock `DashboardCharts` data |
| B-036 | Date-range filter for dashboard KPIs               | Dashboard   | |
| B-037 | Room photos upload (Supabase Storage)              | Rooms       | |
| B-038 | Export bookings to CSV                           | Reports     | |
| B-039 | Occupancy report page                            | Reports     | |
| B-040 | Drag-and-drop booking reschedule on calendar       | Calendar    | |
| B-041 | Create booking from calendar empty cell            | Calendar    | |
| B-042 | Payment recording against booking                  | Payments    | |
| B-043 | User roles (owner, manager, staff)               | Settings    | |
| B-044 | i18n extraction — move Russian strings to locale files | Platform | |

---

## P3 — Low Priority / Future

| ID    | Item                                           | Area        | Notes |
|-------|------------------------------------------------|-------------|-------|
| B-050 | Stripe payment integration                       | Payments    | |
| B-051 | WhatsApp integration for AI receptionist         | Integrations| |
| B-052 | OTA channel sync (Booking.com)                   | Integrations| |
| B-053 | AI dynamic pricing suggestions                   | AI          | |
| B-054 | Multi-property switcher in sidebar               | Platform    | |
| B-055 | Mobile-optimized housekeeping view               | Housekeeping| |
| B-056 | Guest loyalty / VIP tags                         | Guests      | |
| B-057 | Webhook API for third-party integrations         | Integrations| |
| B-058 | E2E test suite (Playwright)                        | Platform    | |
| B-059 | CI/CD with preview deployments                   | Platform    | |

---

## Technical Debt

| ID    | Item                                           | Notes |
|-------|------------------------------------------------|-------|
| ~~TD-01~~ | ~~`LeadStatusActions` uses client-side Supabase RPC directly~~ | ✅ Sprint 1 — now uses `updateLeadStatus` Server Action |
| TD-02 | `DashboardPage` fetches via client Supabase channel  | Realtime refresh is intentional; still tenant-scoped now |
| TD-03 | Inline styles in `AppShell` (zinc palette) vs CSS variables | Align AppShell with `globals.css` tokens |
| TD-04 | No `hooks/` folder yet                           | Create when client hooks are shared |
| TD-05 | `hotelai-admin-clean.zip` in repo root           | Remove from repo |
| TD-06 | Missing `types/index.ts` barrel export           | Optional convenience |
| ~~TD-07~~ | ~~Some service reads/update/delete operations are not tenant-filtered~~ | ✅ Sprint 1 — all services scope by `hotel_id` |
| ~~TD-08~~ | ~~Leads RPCs bypass RLS~~ | ✅ Sprint 2 — `is_hotel_member()` enforced in `0004` |
| TD-09 | `DEFAULT_HOTEL_ID` fallback in `lib/tenant.ts`   | Remove once every user has a `memberships` row / `app_metadata.hotel_id` |
| TD-10 | `0004` RPC definitions assume `leads` PK column is `lead_id` | Verify against deployed schema before applying (see migration header) |
| TD-11 | `bookings` stores inline guest fields, not a `guest_id` FK | Add `bookings.guest_id → guests.id` once booking→guest linking ships (B-031) |
| TD-12 | `rooms` has no natural unique key (room number) | Consider `unique (hotel_id, room_type)` or add a `room_number` column |
| TD-13 | `DashboardPage` refetches all leads on any realtime event | Apply incremental payload updates instead of full RPC refetch |
| TD-14 | `getDashboardStats` (`lib/services/dashboard.service.ts`) is now unwired | Retained for a future dedicated overview/dashboard route; wire it or remove |
| TD-15 | `/` and `/calendar` still lack `loading.tsx`/`error.tsx` | Services throw; add boundaries or a root `app/error.tsx` |
| TD-16 | Duplicate inline `Field` helper in `RoomForm`, `BookingForm`, `GuestForm` | Extract a shared `FormField` component (now used in 3 forms) |
| TD-17 | Guest booking history matched by email/name, not `guest_id` | Add `bookings.guest_id → guests.id` + backfill; supersedes TD-11 |
| TD-18 | `guests.total_bookings` / `total_spent` are denormalized and can drift | Profile stats are computed live; either backfill counters via trigger or drop the columns |
| TD-19 | `guests_hotel_email_unique` still applies to soft-deleted rows | Re-adding a guest with a tombstoned email fails; scope the unique index `where deleted_at is null` |
| TD-20 | Guest avatar is a raw URL via `<img>` (no upload/validation) | Wire Supabase Storage upload + `next/image` remotePatterns (B-037-style) |

---

## Definition of Done

A backlog item is **done** when:

1. Feature works end-to-end in the admin UI
2. Data layer uses `*.service.ts` / `*.mutations.ts` pattern
3. Types defined in `types/` if new entity
4. UI follows `UI_GUIDELINES.md`
5. Code follows `CODING_STANDARDS.md`
6. Route has `loading.tsx` or skeleton where fetch is slow
7. Roadmap status updated

---

## Sprint Template

```markdown
## Sprint N (YYYY-MM-DD → YYYY-MM-DD)

### Goal
<one sentence>

### Committed
- [ ] B-0XX — ...
- [ ] B-0XX — ...

### Stretch
- [ ] B-0XX — ...

### Completed
- [x] B-0XX — ... (YYYY-MM-DD)
```
