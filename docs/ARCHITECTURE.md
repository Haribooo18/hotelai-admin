# HotelAI Admin — Architecture

This document defines the long-term architectural foundation for the HotelAI Property Management System (PMS) admin application.

## Overview

HotelAI Admin is a **Next.js 16** application using the **App Router**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui (base-nova)**, and **Supabase** as the backend.

The architecture follows a **feature-first** model: each business domain (bookings, rooms, calendar, guests, leads) owns its UI, while shared infrastructure (types, services, UI primitives) lives in cross-cutting folders.

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
| Dashboard | `components/dashboard/dashboard/` | `/` (bookings dashboard variant in progress) |
| Leads     | `components/dashboard/` (root)    | `/` (leads)     |
| Bookings  | `components/dashboard/bookings/`  | `/bookings`     |
| Rooms     | `components/dashboard/rooms/`     | `/rooms`        |
| Calendar  | `components/dashboard/calendar/`  | `/calendar`     |

> **Note:** The leads dashboard (`DashboardPage`) currently lives at the root of `components/dashboard/` alongside shared shell components. New features should use dedicated subfolders.

---

## Folder Structure

```
hotelai-admin/
├── app/                          # Next.js App Router — routes only
│   ├── layout.tsx                # Root layout, fonts, providers
│   ├── page.tsx                  # Home / leads dashboard
│   ├── globals.css               # Design tokens, Tailwind theme
│   ├── providers.tsx             # Client providers (toasts, etc.)
│   ├── bookings/page.tsx
│   ├── rooms/page.tsx
│   ├── calendar/page.tsx
│   └── <route>/page.tsx          # One page per route
│
├── components/
│   ├── dashboard/                # Feature UI + app shell
│   │   ├── AppShell.tsx          # Sidebar, header, layout wrapper
│   │   ├── <feature>/            # Feature modules (see above)
│   │   └── *.tsx                 # Legacy/shared dashboard components
│   └── ui/                       # shadcn/ui primitives (Button, Input, Sheet, …)
│
├── lib/
│   ├── supabase.ts               # Supabase client singleton
│   ├── utils.ts                  # cn() and shared helpers
│   └── services/
│       ├── <domain>.service.ts   # Read operations (queries)
│       └── <domain>.mutations.ts # Write operations (Server Actions)
│
├── types/
│   ├── booking.ts
│   ├── guest.ts
│   └── room.ts
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
import { supabase } from "@/lib/supabase";

type CreateBookingInput = { /* fields */ };

export async function createBooking(input: CreateBookingInput) {
  const { error } = await supabase.from("bookings").insert({ /* ... */ });
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

1. Client subscribes to `postgres_changes` on `leads` / `hotel_leads`.
2. On change, refetch via RPC `list_hotel_leads` or reload page.
3. `RealtimeListener` shows toast on new lead INSERT.

---

## Supabase Layer

### Client

`lib/supabase.ts` creates a singleton browser/server-compatible client:

```typescript
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

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
| `list_hotel_leads`   | `app/page.tsx`, DashboardPage | List leads for hotel |
| `update_lead_status` | `LeadStatusActions`        | Update lead status   |

### Multi-Tenancy

All entities are scoped by `hotel_id`. Current hardcoded tenant: `"hotel_aurora"`. Future: resolve from auth session.

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

- HTML `required` for mandatory fields.
- Server-side validation in mutations (availability, business rules).
- Future: add Zod schemas shared between client and server.

---

## Tables

### Standard Pattern

1. Receive typed array as prop from server page.
2. Empty state: centered message in `rounded-2xl border` container.
3. Table wrapper: `overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950`.
4. Header: `bg-zinc-900`, `text-xs uppercase text-zinc-500`.
5. Rows: `hover:bg-zinc-900/60`, `border-b border-zinc-900`.
6. Actions column: icon buttons or inline dialogs.
7. Delete: `confirm()` → Server Action → toast → `router.refresh()`.

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

---

## Future Architecture Goals

1. **Auth layer** — Supabase Auth + RLS; remove hardcoded `hotel_id`.
2. **Zod validation** — shared schemas in `lib/validations/`.
3. **Error boundaries** — per-route `error.tsx` and `loading.tsx`.
4. **Consolidate leads** — move `Lead` type to `types/lead.ts`, feature folder `components/dashboard/leads/`.
5. **Hooks folder** — `hooks/useBookings.ts` for client-side data when needed.
6. **i18n** — extract Russian UI strings to locale files.
