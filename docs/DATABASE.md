# HotelAI — Database Schema

Database: **Supabase (PostgreSQL)**  
Schema: `public`  
Multi-tenancy: all tables scoped by `hotel_id`

> This document reflects tables and RPC functions **currently used in the codebase**. Columns inferred from TypeScript types, service queries, and mutation payloads.

---

## Entity Relationship Overview

```
hotel (implicit tenant)
  │
  ├── rooms
  │     └── bookings.room_id → rooms.id
  │
  ├── bookings
  │
  ├── guests
  │
  └── leads / hotel_leads
```

---

## Tables

### `rooms`

Hotel room inventory. Each row is a sellable room unit.

| Column      | Type          | Nullable | Description                          |
|-------------|---------------|----------|--------------------------------------|
| `id`        | `uuid`        | NO       | Primary key                          |
| `hotel_id`  | `text`        | NO       | Tenant identifier (e.g. `hotel_aurora`) |
| `room_type` | `text`        | NO       | Display name / category (e.g. "Deluxe") |
| `capacity`  | `integer`     | NO       | Maximum guests                       |
| `price`     | `numeric`     | NO       | Base nightly rate (USD)              |

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

**Business rules (application layer):**
- Overlapping bookings for the same `room_id` are rejected (excluding `cancelled`)
- `total_price` recalculated on create/update
- Minimum 1 night stay

**Used by:**
- `lib/services/bookings.service.ts` — `getBookings()`
- `lib/services/bookings.mutations.ts` — `createBooking`, `updateBooking`, `deleteBooking`
- `lib/services/dashboard.service.ts` — booking count, revenue sum, occupied count
- `components/dashboard/calendar/` — timeline rendering

**TypeScript:** `types/booking.ts` → `Booking`, `BookingStatus`

---

### `guests`

Guest CRM records. Not yet linked to bookings in the UI (bookings store inline guest fields).

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
| `total_bookings` | `integer`     | NO       | Denormalized counter (default 0) |
| `total_spent`    | `numeric`     | NO       | Denormalized total (default 0) |
| `created_at`     | `timestamptz` | NO       |                                |
| `updated_at`     | `timestamptz` | NO       |                                |

**Used by:**
- `lib/services/guests.service.ts` — `getGuests()`
- `lib/services/guests.mutations.ts` — `createGuest`, `deleteGuest`

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

**Used by:**
- `app/page.tsx` — initial fetch via RPC
- `components/dashboard/DashboardPage.tsx` — realtime subscription on `leads` table
- `app/LeadStatusActions.tsx` — status updates via RPC

**TypeScript:** `Lead` type in `components/dashboard/DashboardPage.tsx` (to be moved to `types/lead.ts`)

---

### `hotel_leads`

Referenced in `RealtimeListener` for INSERT events. Likely a view or mirror of `leads` data scoped per hotel.

| Column       | Type          | Nullable | Description                    |
|--------------|---------------|----------|--------------------------------|
| `hotel_id`   | `text`        | NO       | Tenant filter for realtime     |
| `guest_name` | `text`        | YES      | Used in toast notification   |
| `room_type`  | `text`        | YES      | Used in toast notification   |
| *(others)*   | —             | —        | Assumed same shape as `leads`  |

**Used by:**
- `components/dashboard/RealtimeListener.tsx` — `postgres_changes` on INSERT

> **Action item:** Confirm with Supabase whether `hotel_leads` is a table or view and align realtime subscriptions.

---

## RPC Functions

### `list_hotel_leads`

Returns leads for a specific hotel.

**Parameters:**

| Parameter     | Type      | Description          |
|---------------|-----------|----------------------|
| `p_hotel_id`  | `text`    | Hotel tenant ID      |
| `p_limit`     | `integer` | Max rows to return   |

**Returns:** Array of lead objects matching the `Lead` type shape.

**Used by:**
- `app/page.tsx`
- `components/dashboard/DashboardPage.tsx` (realtime refresh)

---

### `update_lead_status`

Updates the status of a lead.

**Parameters:**

| Parameter    | Type   | Description                                        |
|--------------|--------|----------------------------------------------------|
| `p_lead_id`  | `uuid` | Lead to update                                     |
| `p_status`   | `text` | New status: `contacted`, `confirmed`, `cancelled`  |

**Used by:**
- `app/LeadStatusActions.tsx`

---

## Realtime Subscriptions

| Channel       | Table          | Event    | Filter                  | Component            |
|---------------|----------------|----------|-------------------------|----------------------|
| `hotel-leads` | `leads`        | `*`      | —                       | `DashboardPage`      |
| `hotel-leads` | `hotel_leads`  | `INSERT` | `hotel_id=eq.<id>`      | `RealtimeListener`   |

---

## Conventions

### Tenant Scoping

All queries must filter by `hotel_id`. Current hardcoded value:

```
hotel_id = "hotel_aurora"
```

Future: resolve from authenticated user's session.

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
| `hotels`           | Tenant profile, settings       | Settings        |
| `users`            | Staff accounts                 | Settings        |
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
