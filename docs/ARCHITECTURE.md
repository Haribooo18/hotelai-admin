# HotelAI Admin — Architecture

This document defines the long-term architectural foundation for the HotelAI Property Management System (PMS) admin application.

## Overview

HotelAI Admin is a **Next.js 16** application using the **App Router**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui (base-nova)**, and **Supabase** (Postgres + Auth) as the backend.

The architecture follows a **feature-first** model: each business domain (bookings, rooms, calendar, guests, leads) owns its UI, while shared infrastructure (types, services, UI primitives) lives in cross-cutting folders.

Access is authenticated (Supabase Auth) and multi-tenant: every request runs in the context of a signed-in user and their **hotel**, resolved through a single `lib/tenant.ts` abstraction and enforced by Postgres Row Level Security.

---

## Feature-First Architecture

### Principles

1. **Route pages are thin** — Server Components in `app/` fetch data and compose feature components. They contain no business logic beyond orchestration.
2. **Features own their UI** — Domain-specific components live under `components/dashboard/<feature>/`.
3. **Services own data access** — All Supabase reads go in `lib/services/*.service.ts`; writes go in `lib/services/*.mutations.ts`.
4. **Types are shared** — Domain entities are defined once in `types/` and imported everywhere.
5. **UI primitives are generic** — `components/ui/` contains design-system building blocks only; no domain logic.

### Feature Module Structure

Each feature should follow this layout:

```
components/dashboard/<feature>/
  <Feature>Page.tsx        # Client orchestrator (filters, dialogs, state)
  <Feature>Table.tsx       # Data table presentation
  <Feature>Form.tsx        # Create/edit form
  <Feature>CreateDialog.tsx
  <Feature>EditDialog.tsx
  <Feature>Stats.tsx       # Optional KPI cards
  <Feature>Filters.tsx     # Optional search/filter bar
  index.ts                 # Public barrel exports
```

**Current features:**

| Feature   | Path                              | Route(s)        |
|-----------|-----------------------------------|-----------------|
| Leads     | `components/dashboard/` (root)    | `/` (leads)     |
| Bookings  | `components/dashboard/bookings/`  | `/bookings` → `BookingsPage` |
| Rooms     | `components/dashboard/rooms/`     | `/rooms`        |
| Guests    | `components/dashboard/guests/`    | `/guests`, `/guests/[id]` |
| Calendar  | `components/dashboard/calendar/`  | `/calendar`     |

> **Note:** The leads dashboard (`DashboardPage`) currently lives at the root of `components/dashboard/` alongside shared shell components. New features should use dedicated subfolders.
> **Note:** `getDashboardStats` (`lib/services/dashboard.service.ts`) is retained but currently unwired after the `/bookings` rewire — reserved for a future overview/dashboard route (TD-14).

---

## Folder Structure

```
hotelai-admin/
├── proxy.ts                      # Next.js 16 Proxy (middleware): session refresh + route guard
├── app/                          # Next.js App Router — routes only
│   ├── layout.tsx                # Root layout, fonts, providers
│   ├── page.tsx                  # Home / leads dashboard (protected)
│   ├── login/page.tsx            # Public sign-in page
│   ├── globals.css               # Design tokens, Tailwind theme
│   ├── providers.tsx             # Client providers (toasts, etc.)
│   ├── bookings/page.tsx
│   ├── rooms/page.tsx
│   ├── calendar/page.tsx
│   └── <route>/page.tsx          # One page per route
│
├── components/
│   ├── auth/                     # LoginForm, SignOutButton
│   ├── dashboard/                # Feature UI + app shell
│   │   ├── AppShell.tsx          # Sidebar, header, layout wrapper
│   │   ├── <feature>/            # Feature modules (see above)
│   │   └── *.tsx                 # Legacy/shared dashboard components
│   └── ui/                       # shadcn/ui primitives (Button, Input, Sheet, …)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client (Client Components)
│   │   ├── server.ts             # Server client (Server Components / Actions)
│   │   └── session.ts            # updateSession() used by proxy.ts
│   ├── tenant.ts                 # currentHotel abstraction + auth guards
│   ├── utils.ts                  # cn() and shared helpers
│   └── services/
│       ├── <domain>.service.ts   # Read operations (queries)
│       └── <domain>.mutations.ts # Write operations (Server Actions)
│
├── types/
│   ├── booking.ts
│   ├── guest.ts
│   ├── lead.ts
│   └── room.ts
│
├── supabase/
│   └── migrations/               # SQL migrations (tenant tables + RLS)
│
├── docs/                         # Project documentation (this folder)
└── .cursor/rules/                # AI agent rules
```

### Path Aliases

Configured in `tsconfig.json`:

| Alias         | Maps to              |
|---------------|----------------------|
| `@/*`         | Project root         |
| `@/components`| `components/`        |
| `@/lib`       | `lib/`               |
| `@/components/ui` | `components/ui/` |

---

## Naming Conventions

### Files

| Kind              | Pattern                        | Example                    |
|-------------------|--------------------------------|----------------------------|
| Route page        | `page.tsx`                     | `app/rooms/page.tsx`       |
| Feature page      | `<Feature>Page.tsx`            | `BookingsPage.tsx`         |
| Table             | `<Feature>Table.tsx`           | `BookingsTable.tsx`        |
| Form              | `<Feature>Form.tsx`            | `BookingForm.tsx`          |
| Create dialog     | `<Feature>CreateDialog.tsx`    | `BookingCreateDialog.tsx`  |
| Edit dialog       | `<Feature>EditDialog.tsx`      | `BookingEditDialog.tsx`    |
| Service (read)    | `<domain>.service.ts`          | `bookings.service.ts`      |
| Service (write)   | `<domain>.mutations.ts`        | `bookings.mutations.ts`    |
| Type definition   | `<domain>.ts`                  | `types/booking.ts`         |
| UI primitive      | lowercase kebab or single word | `button.tsx`, `sheet.tsx`  |
| Barrel export     | `index.ts`                     | `bookings/index.ts`        |

### Symbols

| Kind              | Convention                     | Example                    |
|-------------------|--------------------------------|----------------------------|
| React component   | PascalCase                     | `BookingsTable`            |
| Server Action     | camelCase verb                 | `createBooking`            |
| Service function  | camelCase, `get` prefix reads  | `getBookings`              |
| Type / Interface  | PascalCase                     | `Booking`, `BookingStatus` |
| Constants         | camelCase or UPPER_SNAKE       | `navItems`                 |

### Folders

- **kebab-case** for route segments: `app/bookings/`
- **lowercase** for feature folders: `components/dashboard/bookings/`
- **singular** for type files: `types/booking.ts` (not `bookings.ts`)

---

## Server Actions

All mutations use Next.js **Server Actions** defined in `lib/services/*.mutations.ts`.

### Rules

1. Every mutations file starts with `"use server"`.
2. Actions accept a typed input object — never positional args for complex data.
3. Actions call Supabase directly; no client-side Supabase writes for CRUD.
4. After successful mutation, call `revalidatePath("/<route>")` for affected pages.
5. Throw errors on failure; client components catch and show `toast.error()`.

### Pattern

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

type CreateBookingInput = { /* fields */ };

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId(); // resolves + requires auth

  const { error } = await supabase
    .from("bookings")
    .insert({ hotel_id: hotelId /* ... */ });

  if (error) throw error;
  revalidatePath("/bookings");
}
```

### Current Server Actions

| File                      | Actions                                      |
|---------------------------|----------------------------------------------|
| `bookings.mutations.ts`   | `createBooking`, `updateBooking`, `deleteBooking` |
| `rooms.mutations.ts`      | `createRoom`, `updateRoom`, `deleteRoom`     |
| `guests.mutations.ts`     | `createGuest`, `deleteGuest`                 |

### Business Logic in Actions

Domain rules (availability checks, price calculation) belong inside mutation files as private helper functions — e.g. `ensureRoomAvailable()`, `calculateTotalPrice()` in `bookings.mutations.ts`.

---

## Shared UI

### App Shell

`components/dashboard/AppShell.tsx` wraps every authenticated page:

- Fixed sidebar navigation (desktop `lg+`)
- Sticky header with workspace branding
- Main content area with `p-8` padding

All route pages render:

```tsx
<AppShell>
  <FeatureContent />
</AppShell>
```

### Design System (`components/ui/`)

Built on **shadcn/ui** with **@base-ui/react** primitives. Installed components:

- `button`, `input`, `select`, `badge`, `card`
- `table`, `sheet`, `dropdown-menu`, `separator`

Add new primitives via `npx shadcn@latest add <component>` — never copy-paste from other projects.

### Icons

Use **lucide-react** exclusively. Standard size: `size={18}` in tables, `h-4 w-4` in buttons.

### Toasts

Use **sonner** via `toast.success()` / `toast.error()` in client components after mutations.

---

## Shared Types

Domain types live in `types/` and mirror Supabase table shapes.

| File             | Exports                          |
|------------------|----------------------------------|
| `types/booking.ts` | `Booking`, `BookingStatus`     |
| `types/guest.ts`   | `Guest`                        |
| `types/room.ts`    | `Room`                         |

### Rules

1. One file per domain entity.
2. Use `type` (not `interface`) for entity shapes unless extension is needed.
3. Union types for enums: `BookingStatus = "confirmed" | "checked_in" | …`
4. Nullable DB columns use `string | null`, not `string | undefined`.
5. Feature-local view types (e.g. `Lead`) may live in feature components until promoted to `types/`.

---

## Shared Utils

`lib/utils.ts` exports:

- `cn(...inputs)` — merges Tailwind classes via `clsx` + `tailwind-merge`

Add cross-cutting pure functions here only when used by 3+ features. Feature-specific helpers stay in the feature folder or service file.

---

## Data Flow

```
┌─────────────┐     fetch      ┌──────────────────┐     query     ┌──────────┐
│ app/page.tsx│ ──────────────▶│ *.service.ts     │ ─────────────▶│ Supabase │
│ (Server)    │                │ (server, no      │               │ Postgres │
└─────────────┘                │  "use server")   │               └──────────┘
       │                       └──────────────────┘
       │ props
       ▼
┌─────────────────┐   user action   ┌───────────────────┐   mutate   ┌──────────┐
│ FeaturePage     │ ────────────────▶│ *.mutations.ts    │ ──────────▶│ Supabase │
│ (Client)        │                 │ ("use server")     │            └──────────┘
└─────────────────┘                 └───────────────────┘
       │                                      │
       │ router.refresh()                     │ revalidatePath()
       ▼                                      ▼
┌─────────────────┐                 Server re-renders page
│ Updated UI      │
└─────────────────┘
```

### Read Path

1. **Server Component** (`app/<route>/page.tsx`) calls `getX()` from `*.service.ts`.
2. Service queries Supabase, throws or returns typed data.
3. Data passed as props to Client or Server feature components.

### Write Path

1. **Client Component** form/table calls Server Action from `*.mutations.ts`.
2. Action validates, mutates Supabase, calls `revalidatePath`.
3. Client calls `router.refresh()` and shows toast.
4. Optional `onSuccess` callback closes dialogs.

### Realtime Path (Leads)

1. `DashboardPage` subscribes to `postgres_changes` on `leads`, filtered by `hotel_id`.
2. On change, it refetches via the `list_hotel_leads` RPC.
3. Realtime respects RLS, so a client only receives events for its own hotel (requires `leads` replica identity full + publication membership).

---

## Authentication & Session

Auth uses **Supabase Auth** with the cookie-based `@supabase/ssr` package.

| Concern            | Where                                             |
|--------------------|---------------------------------------------------|
| Sign in            | `signIn` Server Action (`lib/services/auth.mutations.ts`) via `LoginForm` |
| Sign out           | `signOut` Server Action, triggered by `SignOutButton` in `AppShell` |
| Session refresh    | `proxy.ts` → `updateSession()` runs on every matched request |
| Route protection   | `proxy.ts` redirects anonymous users to `/login`; `requireUser()` guards data access |
| Reading the user   | `getCurrentUser()` / `requireUser()` in `lib/tenant.ts` |

`/login` is the only public route. Every other route requires a session.

## Tenant Context (`currentHotel`)

`lib/tenant.ts` is the **single source of hotel context**. Services never hardcode a hotel id.

- `getCurrentUser()` — cached authenticated user or `null`
- `requireUser()` — returns the user or redirects to `/login`
- `getCurrentHotelId()` — resolves `hotel_id` from `app_metadata` → `user_metadata` → `DEFAULT_HOTEL_ID` env fallback
- `getCurrentHotel()` — `{ id, name }` for services and UI

Every service read and mutation calls `getCurrentHotelId()` and scopes queries with `.eq("hotel_id", hotelId)`. This keeps queries secure even independent of RLS.

## Supabase Layer

### Clients

Two request-scoped factories (no shared singleton):

```typescript
// Client Components ("use client")
import { createClient } from "@/lib/supabase/client"; // createBrowserClient

// Server Components / Server Actions / services
import { createClient } from "@/lib/supabase/server"; // async, cookie-aware
```

- Browser client: realtime subscriptions and other client-only reads.
- Server client: all `*.service.ts` reads and `*.mutations.ts` writes. Created per call because it binds to request cookies.

### Service Layer Split

| Layer        | File suffix    | `"use server"` | Purpose                    |
|--------------|----------------|----------------|----------------------------|
| Queries      | `.service.ts`  | No             | `get*`, list, count, aggregate |
| Mutations    | `.mutations.ts`| Yes            | `create*`, `update*`, `delete*` |

### Error Handling

- **Services for pages**: throw `Error` with code/message (bookings) or return `[]` on failure (rooms).
- **Mutations**: throw raw Supabase error or domain `Error` (e.g. room conflict).
- **Client**: catch, `console.error`, `toast.error`.

### RPC Functions

| RPC                  | Used by                    | Purpose              |
|----------------------|----------------------------|----------------------|
| `list_hotel_leads`   | `leads.service.ts`, DashboardPage | List leads for hotel (membership-checked) |
| `update_lead_status` | `leads.mutations.ts`       | Update lead status (membership-checked) |

Both are `SECURITY DEFINER` and enforce `is_hotel_member()` internally (migration `0004`).

### Multi-Tenancy

Every business entity carries `hotel_id`. Tenant isolation is enforced at two layers:

1. **Application** — all services resolve the hotel via `getCurrentHotelId()` and filter every read/write with `.eq("hotel_id", hotelId)`.
2. **Database** — Row Level Security policies (`supabase/migrations/0001_auth_multitenancy_rls.sql`) restrict rows to members of the hotel via `public.is_hotel_member(hotel_id)`.

The user → hotel mapping lives in the `memberships` table (and optionally mirrored into JWT `app_metadata.hotel_id`). `DEFAULT_HOTEL_ID` (env) is only a migration fallback until all users have memberships. No hotel id is hardcoded in service code.

---

## Reusable Components

### Composition Hierarchy

```
AppShell
  └── FeaturePage (client state: filters, dialog open)
        ├── FeatureStats
        ├── FeatureFilters
        ├── FeatureTable
        ├── FeatureCreateDialog
        │     └── FeatureForm
        └── FeatureEditDialog
              └── FeatureForm
```

### When to Extract

| Extract to `components/ui/`     | Keep in feature folder        |
|---------------------------------|-------------------------------|
| Button, Input, generic Table    | BookingsTable, RoomsTable     |
| Sheet, Dialog shell             | BookingCreateDialog           |
| Badge variants                  | BookingStatusBadge            |

---

## Forms

### Standard Pattern

1. `*Form.tsx` is a **client component** with local `useState` per field.
2. Submits via `useTransition` + Server Action.
3. Uses `Input`, `Select`, `Button` from `components/ui/`.
4. Accepts optional entity prop for edit mode.
5. Calls `onSuccess?.()` after success (closes parent dialog).
6. Calls `router.refresh()` to sync server data.

### Validation

- Zod schemas in `lib/validations/{room,booking}.ts`, shared by client and server.
- Forms `safeParse` on submit and render inline field errors (`aria-invalid` + `aria-describedby`).
- Mutations re-parse the same schema as a server-side backstop and throw localized messages.
- Server-side business rules stay in mutations (room availability, price calculation).

---

## Tables

### Standard Pattern

1. Receive typed array as prop from server page.
2. Use the shared `DataTable` (`components/dashboard/DataTable.tsx`): column defs, `getRowId`, `caption`, and an `empty` slot.
3. `DataTable` renders the standard shell: `overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950`, header `bg-zinc-900 text-xs uppercase text-zinc-500`, rows `hover:bg-zinc-900/60`.
4. Empty state: centered message passed via the `empty` prop.
5. Actions column: icon buttons (with `aria-label`) or inline dialogs; align `right`.
6. Delete: `ConfirmDialog` → `useOptimistic` row removal → Server Action → toast → `router.refresh()`.

---

## Dialogs

HotelAI uses **Sheet** (slide-over panel) from `components/ui/sheet.tsx` as the primary dialog pattern.

### Standard Pattern

1. `*Dialog.tsx` manages `open` state (or receives controlled `open`/`onOpenChange`).
2. `SheetContent` with `sm:max-w-lg`.
3. `SheetHeader` + `SheetTitle` for title.
4. Form in `mt-6` container below header.
5. `onSuccess={() => setOpen(false)}` passed to form.

### Variants

| Pattern              | Example                |
|----------------------|------------------------|
| Self-contained       | `RoomCreateDialog` — owns open state + trigger button |
| Controlled           | `BookingCreateDialog` — parent owns `open` state |
| Edit with selection  | `BookingEditDialog` — parent sets `selectedBooking` |
| Confirmation         | `ConfirmDialog` (`components/ui/confirm-dialog.tsx`) — centered modal replacing native `confirm()` |

---

## Future Architecture Goals

1. ~~**Auth layer** — Supabase Auth + RLS; remove hardcoded `hotel_id`.~~ ✅ Delivered in Sprint 1.
2. ~~**Consolidate leads** — move `Lead` type to `types/lead.ts`.~~ ✅ `types/lead.ts` added; feature folder `components/dashboard/leads/` still pending.
3. ~~**Zod validation** — shared schemas in `lib/validations/`.~~ ✅ Sprint 3 (`room`/`booking` schemas).
4. **Error boundaries** — per-route `error.tsx` and `loading.tsx`. ✅ `/rooms` and `/bookings` (Sprint 3); `/` and `/calendar` pending (TD-15).
5. **Hooks folder** — `hooks/useBookings.ts` for client-side data when needed.
6. **i18n** — extract Russian UI strings to locale files.
7. **Roles** — use the `memberships.role` column for owner/manager/staff authorization.
8. ~~**Harden leads RPCs** — add membership checks inside `list_hotel_leads` / `update_lead_status`.~~ ✅ Sprint 2 (migration `0004`).
