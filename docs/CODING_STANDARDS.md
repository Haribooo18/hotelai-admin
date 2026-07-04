# HotelAI — Coding Standards

Standards for all TypeScript and React code in the HotelAI Admin project.

---

## TypeScript Rules

### Compiler Settings

- `strict: true` — always enabled, no exceptions
- Target: `ES2017`, module: `esnext`, resolution: `bundler`
- Path alias: `@/*` maps to project root

### Types vs Interfaces

- Prefer `type` for entity shapes and unions
- Use `interface` only when declaration merging is needed
- Export types alongside components when feature-local; promote to `types/` when shared

```typescript
// ✅ Entity type
export type Booking = {
  id: string;
  hotel_id: string;
  status: BookingStatus;
};

// ✅ Union
export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";
```

### Nullability

- Database nullable columns: `string | null` (not `undefined`)
- Optional function parameters: `?` suffix
- Avoid `any` — use `unknown` and narrow with type guards
- Avoid non-null assertions (`!`) except env vars in `lib/supabase.ts`

### Type Safety

```typescript
// ✅ Return typed data
return (data ?? []) as Booking[];

// ✅ satisfies for runtime-checked assignment
return data satisfies Guest[];

// ❌ Untyped returns
return data;
```

### Enums

Do not use TypeScript `enum`. Use string union types instead.

---

## React Rules

### Components

- **Functional components only** — no class components
- One component per file (except tightly coupled sub-components)
- Props via `type Props = { ... }` at top of file
- Destructure props in function signature

```typescript
type Props = {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
};

export function BookingsTable({ bookings, onEdit }: Props) {
```

### Hooks

- Call hooks at top level only
- Custom hooks: prefix with `use`, place in `hooks/` when shared across features
- Prefer `useMemo` for filtered lists, `useTransition` for form submissions
- Clean up subscriptions in `useEffect` return function

### State

- Local UI state (`open`, `search`, `filter`) in the orchestrator component (e.g. `BookingsPage`)
- Server data flows down as props — do not duplicate in state unless needed for optimistic UI
- Form fields: individual `useState` per field (current pattern)

### Keys

- Always provide `key` on mapped elements — use entity `id`
- Never use array index as key for dynamic lists

---

## Folder Naming

| Folder                    | Convention     | Example                        |
|---------------------------|----------------|--------------------------------|
| Route segments (`app/`)   | kebab-case     | `app/bookings/`                |
| Feature folders           | lowercase      | `components/dashboard/bookings/` |
| UI primitives             | lowercase      | `components/ui/`               |
| Service layer             | lowercase      | `lib/services/`                |
| Types                     | lowercase      | `types/`                       |
| Documentation             | lowercase      | `docs/`                        |

---

## File Naming

| File type            | Convention              | Example                   |
|----------------------|-------------------------|---------------------------|
| React component      | PascalCase `.tsx`       | `BookingsTable.tsx`       |
| Server service       | kebab domain `.ts`      | `bookings.service.ts`     |
| Server mutation      | kebab domain `.ts`      | `bookings.mutations.ts`   |
| Type definition      | singular domain `.ts`   | `types/booking.ts`        |
| Utility              | camelCase or kebab `.ts`| `utils.ts`                |
| Route page           | `page.tsx`              | `app/rooms/page.tsx`      |
| Barrel export          | `index.ts`              | `bookings/index.ts`       |
| UI primitive         | lowercase `.tsx`        | `button.tsx`              |

---

## Imports

### Order

1. React / Next.js
2. Third-party libraries
3. `@/lib/*` services and utilities
4. `@/types/*`
5. `@/components/ui/*`
6. Relative imports (`./`, `../`)

### Style

```typescript
// ✅ Absolute imports with @/ alias
import type { Booking } from "@/types/booking";
import { getBookings } from "@/lib/services/bookings.service";
import { Button } from "@/components/ui/button";
import { BookingForm } from "./BookingForm";

// ❌ Deep relative paths
import { Button } from "../../../components/ui/button";
```

### Type Imports

Use `import type` for type-only imports:

```typescript
import type { Booking } from "@/types/booking";
import type { ReactNode } from "react";
```

---

## Exports

### Components

- Named exports: `export function BookingsTable`
- No default exports for components (except `app/**/page.tsx` required by Next.js)

### Barrel Files

Feature folders expose public API via `index.ts`:

```typescript
// components/dashboard/bookings/index.ts
export { BookingsPage } from "./BookingsPage";
export { BookingsTable } from "./BookingsTable";
export { BookingCreateDialog, BookingCreateButton } from "./BookingCreateDialog";
```

### Services

- Named exports per function: `export async function getBookings()`
- No barrel file for services — import directly from the specific file

---

## Server Components

### When to Use

- Route pages (`app/**/page.tsx`) — default, no directive needed
- Data fetching before render
- Static layout content

### Rules

1. No `useState`, `useEffect`, event handlers
2. Fetch data with `*.service.ts` functions
3. Pass data as props to client components
4. Wrap in `<AppShell>` for consistent layout

```typescript
// app/rooms/page.tsx
export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <AppShell>
      <RoomsTable rooms={rooms} />
    </AppShell>
  );
}
```

### Async Params (Next.js 16)

```typescript
type Props = {
  searchParams?: Promise<Record<string, string>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
```

---

## Client Components

### When to Use

Add `"use client"` when the component needs:

- `useState`, `useEffect`, `useMemo`, `useTransition`
- Event handlers (`onClick`, `onSubmit`, `onChange`)
- Browser APIs (`window`, `confirm`)
- Supabase realtime subscriptions

### Rules

1. `"use client"` as first line of file
2. Keep client components small — push data fetching to server
3. Refresh server data after mutations: `router.refresh()`
4. Show feedback: `toast.success()` / `toast.error()` from sonner

### Boundary Pattern

```
Server Page (fetch) → Client FeaturePage (state) → Server Actions (mutate)
```

---

## Error Handling

### Server Services (reads)

```typescript
// Pattern A: throw (bookings)
if (error) {
  throw new Error(`${error.code}: ${error.message}`);
}

// Pattern B: return empty (rooms) — prefer throw for new code
if (error) {
  console.error("Failed to load rooms:", error);
  return [];
}
```

**Standard:** Prefer throwing for new services. Return empty only when graceful degradation is intentional.

### Server Actions (writes)

```typescript
if (error) throw error;

// Domain errors
throw new Error("Номер уже забронирован");
```

### Client Components

```typescript
try {
  await deleteBooking(id);
  toast.success("Бронирование удалено");
  router.refresh();
} catch (error) {
  console.error(error);
  toast.error("Не удалось удалить бронирование");
}
```

### Rules

- Never swallow errors silently (empty `catch`)
- Always `console.error` in catch blocks
- User-facing messages in Russian
- Use `ConfirmDialog` before destructive actions (not native `confirm()`)
- Do not use `alert()` in new code — use toast

---

## Forms

### Structure

1. Client component with `onSubmit` handler
2. `e.preventDefault()` at start
3. `useTransition` for pending state
4. Call Server Action inside `startTransition`
5. Reset form fields after successful create
6. `router.refresh()` after success

### Validation

| Layer    | Method                                  |
|----------|-----------------------------------------|
| Client   | Zod `safeParse` in the form → inline field errors |
| Server   | Same Zod schema re-parsed in `*.mutations.ts` + business rules |
| Schemas  | `lib/validations/{room,booking}.ts`     |

### Rules

- One `BookingForm` for both create and edit — differentiate via optional `booking` prop
- Disable submit button while `pending`
- Button text changes during pending state
- Pass `onSuccess` callback to close parent dialog

---

## Validation (Business Rules)

Current server-side validations:

| Rule                     | Location                        |
|--------------------------|---------------------------------|
| Room availability        | `ensureRoomAvailable()`         |
| Price calculation        | `calculateTotalPrice()`         |
| Minimum 1 night          | `calculateTotalPrice()`         |

New validations should be private functions in the mutations file, throwing descriptive `Error` messages in Russian.

---

## Server Actions Checklist

- [ ] File starts with `"use server"`
- [ ] Input typed as `type XxxInput = { ... }`
- [ ] Supabase error thrown, not returned
- [ ] `revalidatePath` called for affected routes
- [ ] Business logic in private helper functions
- [ ] No UI imports in mutations files

---

## Linting

- ESLint with `eslint-config-next`
- Run `npm run lint` before committing
- Fix all lint errors — no `eslint-disable` without justification

---

## Environment Variables

| Variable                          | Usage              |
|-----------------------------------|--------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anon key  |

- Prefix with `NEXT_PUBLIC_` only for client-safe values
- Never commit `.env` files
- Access via `process.env` — no hardcoded credentials

---

## Git Conventions

- Do not commit secrets, `.env`, or build artifacts
- Do not commit `hotelai-admin-clean.zip` or temp files
- Feature branches: `feature/<name>`, fixes: `fix/<name>`
- Commit messages: imperative mood, focus on why

---

## Code Review Checklist

- [ ] Follows feature-first folder structure
- [ ] Types in `types/`, not inline (unless feature-local temporary)
- [ ] Server/client boundary correct
- [ ] Mutations in `*.mutations.ts` with `revalidatePath`
- [ ] UI matches `UI_GUIDELINES.md`
- [ ] Russian user-facing strings
- [ ] No business logic changes unless intended
- [ ] No `any`, no unnecessary `eslint-disable`
