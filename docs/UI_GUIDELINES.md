# HotelAI — UI Guidelines

Visual and interaction standards for the HotelAI Admin panel. The design is **dark-first**, optimized for hotel staff working long shifts.

---

## Design Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| CSS framework  | Tailwind CSS 4                      |
| Component lib  | shadcn/ui (base-nova style)         |
| Primitives     | @base-ui/react                      |
| Icons          | lucide-react                        |
| Font           | Geist Sans (body), Geist Mono (code)|
| Toasts         | sonner                              |
| Charts         | recharts                            |
| Animations     | tw-animate-css                      |

---

## Spacing

### Scale

Use Tailwind's default spacing scale. Preferred values in this project:

| Token    | Value   | Usage                                    |
|----------|---------|------------------------------------------|
| `1`      | 4px     | Tight icon gaps                          |
| `2`      | 8px     | Button icon margins (`mr-2`)             |
| `3`      | 12px    | Compact padding                          |
| `4`      | 16px    | Standard inner padding (`px-4`, `py-4`)  |
| `5`      | 20px    | Form field spacing (`space-y-5`)         |
| `6`      | 24px    | Card padding (`p-6`), section gaps       |
| `8`      | 32px    | Page content padding (`p-8`), section spacing (`space-y-8`, `mb-8`) |
| `16`     | 64px    | Header height (`h-20` = 80px)            |

### Layout Spacing Rules

- **Page main content:** `p-8` (via `AppShell` `<main>`)
- **Section vertical rhythm:** `space-y-8` between major sections
- **Card internal padding:** `p-6`
- **Form field gaps:** `space-y-5`
- **Table cell padding:** `px-6 py-4` (header), `px-6 py-5` (body)
- **Sidebar nav items:** `px-4 py-3`, `mb-2` between items
- **Grid gaps:** `gap-6` for card grids, `gap-4` for stat card grids

---

## Typography

### Font Families

```css
--font-sans: Geist Sans     /* body, UI */
--font-mono: Geist Mono     /* code, debug */
--font-heading: Geist Sans  /* headings */
```

Applied via `next/font` in `app/layout.tsx`. Body uses `antialiased`.

### Type Scale

| Element              | Classes                                      | Usage                    |
|----------------------|----------------------------------------------|--------------------------|
| Page eyebrow         | `text-sm uppercase tracking-[0.3em] text-zinc-500` | "HOTELAI ADMIN" label |
| Page title           | `text-4xl font-bold`                         | Main h1 per page         |
| Page subtitle        | `text-zinc-400` or `text-zinc-500`           | Description below title  |
| Section title        | `text-xl font-semibold`                      | Card headings            |
| Header title         | `text-2xl font-bold`                         | AppShell header h2       |
| Body text            | default (inherits `text-foreground`)         | Paragraphs, table cells  |
| Muted text           | `text-sm text-zinc-500`                      | Secondary info, dates    |
| Table header         | `text-xs uppercase text-zinc-500`          | Column headers           |
| Badge / label        | `text-xs`                                    | Status badges, buttons   |
| Stat value           | `text-2xl font-bold` or `text-3xl font-bold` | KPI numbers              |

### Rules

- One `h1` per page (the page title)
- Use `font-medium` for primary row labels (guest names, room types)
- Use `font-semibold` for emphasized values (prices, stats)
- Letter-spacing on uppercase labels: `tracking-widest` or `tracking-[0.3em]`

---

## Radius

### CSS Variables (shadcn tokens)

```css
--radius: 0.875rem;                          /* 14px base */
--radius-sm: calc(var(--radius) * 0.6);      /* ~8px */
--radius-md: calc(var(--radius) * 0.8);      /* ~11px */
--radius-lg: var(--radius);                  /* 14px */
--radius-xl: calc(var(--radius) * 1.4);      /* ~20px */
--radius-2xl: calc(var(--radius) * 1.8);    /* ~25px */
```

### Usage Map

| Element              | Class           | Notes                    |
|----------------------|-----------------|--------------------------|
| Buttons (shadcn)     | `rounded-lg`    | UI primitives            |
| Inputs               | `rounded-lg`    |                          |
| Nav items            | `rounded-xl`    | Sidebar links            |
| Cards / panels       | `rounded-2xl`   | Tables, stat cards, dialogs |
| Avatar / logo icon   | `rounded-2xl` or `rounded-full` | Sidebar logo, user avatar |
| Icon action buttons  | `rounded-lg`    | Edit/delete in tables    |
| Badges               | `rounded-full` or `rounded-md` | Status badges     |

---

## Colors

### Theme Tokens (`globals.css`)

Dark theme using OKLCH color space:

| Token                    | Value (OKLCH)        | Usage                     |
|--------------------------|----------------------|---------------------------|
| `--background`           | `oklch(0.09 0 0)`    | Page background           |
| `--foreground`           | `oklch(0.96 0 0)`    | Primary text              |
| `--card`                 | `oklch(0.13 0 0)`    | Card surfaces             |
| `--primary`              | `oklch(0.96 0 0)`    | Primary button bg         |
| `--secondary`            | `oklch(0.22 0 0)`    | Secondary surfaces        |
| `--muted`                | `oklch(0.22 0 0)`    | Muted backgrounds         |
| `--muted-foreground`     | `oklch(0.68 0 0)`    | Muted text                |
| `--destructive`          | `oklch(0.55 0.22 27)`| Error, delete actions     |
| `--border`               | `oklch(1 0 0 / 10%)` | Default borders           |
| `--input`                | `oklch(1 0 0 / 12%)` | Input backgrounds         |
| `--ring`                 | `oklch(0.55 0 0)`    | Focus rings               |

### App Shell Palette (Tailwind zinc)

The `AppShell` uses explicit zinc classes alongside theme tokens:

| Class            | Usage                              |
|------------------|------------------------------------|
| `bg-zinc-950`    | App background, table backgrounds  |
| `bg-zinc-900`    | Sidebar cards, table headers, hover|
| `border-zinc-800`| Primary borders                    |
| `border-zinc-900`| Subtle row dividers                |
| `text-zinc-400`  | Inactive nav, subtitles            |
| `text-zinc-500`  | Muted labels, empty states         |

### Brand Accent — Emerald

| Class            | Usage                              |
|------------------|------------------------------------|
| `bg-emerald-600` | Active nav item, logo, CTA buttons |
| `bg-emerald-700` | Confirm actions (leads)           |
| `hover:bg-emerald-600` | Hover on confirm buttons    |
| `hover:border-emerald-600` | Quick action card hover     |

### Semantic Colors

| Purpose     | Background                  | Text/Border                  |
|-------------|-----------------------------|-----------------------------|
| Error state | `bg-red-950/40`             | `text-red-400`, `border-red-800` |
| Delete btn  | `hover:bg-red-950`          | `text-red-400`, `border-red-900` |
| Success     | via sonner toast (green)    | —                           |
| Empty state | —                           | `text-zinc-500`             |

### Status Badge Colors

Follow `BookingStatusBadge` patterns:
- `confirmed` — neutral/muted
- `checked_in` — emerald/green
- `checked_out` — zinc/muted
- `cancelled` — red/destructive

---

## Buttons

Use `Button` from `@/components/ui/button`.

### Variants

| Variant        | Usage                                    |
|----------------|------------------------------------------|
| `default`      | Primary actions (create, save)           |
| `secondary`    | Secondary actions (contacted)            |
| `outline`      | Tertiary actions                         |
| `ghost`        | Icon-only toolbar actions                |
| `destructive`  | Delete, cancel                             |
| `link`         | Inline text links                          |

### Sizes

| Size      | Usage                                     |
|-----------|-------------------------------------------|
| `default` | Standard buttons in forms and toolbars    |
| `sm`      | Compact table actions                     |
| `xs`      | Inline status action buttons              |
| `icon`    | Square icon buttons                       |

### Custom Patterns

```tsx
// Full-width form submit
<Button type="submit" className="w-full" disabled={pending}>

// Table icon button (non-shadcn, AppShell style)
<button className="rounded-lg border border-zinc-700 p-2 transition hover:bg-zinc-800">

// Confirm with brand color
<Button className="bg-emerald-700 text-white hover:bg-emerald-600">
```

### Rules

- Always `disabled={pending}` during form submission
- Icon + text: `<Icon className="mr-2 h-4 w-4" />` before label
- Destructive actions require a `ConfirmDialog` (`components/ui/confirm-dialog.tsx`) before execution — never native `confirm()`

---

## Inputs

Use `Input` from `@/components/ui/input` and `Select` from `@/components/ui/select`.

### Input Defaults

- Height: `h-8`
- Border: `border-input`
- Focus: `focus-visible:ring-3 focus-visible:ring-ring/50`
- Placeholder: `placeholder:text-muted-foreground`
- Dark mode bg: `dark:bg-input/30`

### Form Layout

```tsx
<form className="space-y-5">
  <Input placeholder="..." required />
  <Select value={...} onChange={...} options={...} />
  <Input type="date" required />
  <Button type="submit" className="w-full">...</Button>
</form>
```

### Rules

- Use `placeholder` for labels (no separate `<label>` elements currently)
- `required` for mandatory fields
- Date fields: `type="date"`
- Select for foreign keys (room selection)

---

## Tables

### Wrapper

```tsx
<div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
  <table className="w-full">...</table>
</div>
```

### Header

```tsx
<thead className="border-b border-zinc-800 bg-zinc-900">
  <tr>
    <th className="px-6 py-4 text-left text-xs uppercase text-zinc-500">...</th>
  </tr>
</thead>
```

### Body Rows

```tsx
<tr className="border-b border-zinc-900 hover:bg-zinc-900/60">
  <td className="px-6 py-5">...</td>
</tr>
```

### Empty State

```tsx
<div className="rounded-2xl border border-zinc-800 bg-zinc-950 py-16 text-center text-zinc-500">
  Пока нет данных
</div>
```

### Rules

- Right-align action columns: `text-right` on `<th>`, `justify-end` on action `<div>`
- Icons inline with text in cells (`flex items-center gap-2`)
- Prefer native `<table>` for feature tables; shadcn `Table` for simpler cases

---

## Dialogs

Primary pattern: **Sheet** (slide-over from right).

### Structure

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent className="sm:max-w-lg">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    <div className="mt-6">
      <FeatureForm onSuccess={() => setOpen(false)} />
    </div>
  </SheetContent>
</Sheet>
```

### Overlay

`bg-black/10 backdrop-blur-sm` — subtle, not fully opaque.

### Rules

- Max width: `sm:max-w-lg` for forms
- Title in Russian matching the action (Создать, Редактировать)
- Close on successful form submit via `onSuccess` callback
- Controlled `open` state for create/edit from parent pages
- Self-contained dialogs (e.g. `RoomCreateDialog`) manage own state when standalone

---

## Animations

### Available

- `tw-animate-css` imported in `globals.css`
- Tailwind `transition-all` on nav items and hover states
- `transition` on buttons and bordered elements
- `active:translate-y-px` on buttons (shadcn default)

### Rules

- Use `transition` or `transition-all` for hover states — keep subtle
- No gratuitous entrance animations on data tables
- Sheet/dialog: uses base-ui default slide animation
- Loading states: text change ("Создание...", "Сохранение...") not spinners

---

## Responsive Behavior

### Breakpoints (Tailwind defaults)

| Prefix | Min-width | Usage in project                |
|--------|-----------|---------------------------------|
| `sm`   | 640px     | Sheet max-width                 |
| `lg`   | 1024px    | Sidebar visible (`lg:flex`)     |
| `xl`   | 1280px    | Dashboard grid (`xl:grid-cols-3`)|

### Current Patterns

- **Sidebar:** hidden below `lg`, full app still usable (no mobile nav yet)
- **Dashboard grid:** single column → `xl:col-span-2` + sidebar column
- **Stat cards:** `md:grid-cols-2 lg:grid-cols-4`
- **Header:** sticky `top-0 z-40` with `backdrop-blur`

### Rules

- Mobile nav drawer is **planned** — do not remove sidebar code
- Tables: `overflow-hidden` on wrapper; horizontal scroll not yet implemented
- Touch targets: minimum `p-2` on icon buttons (32px+ effective area)
- Test at 375px, 768px, 1280px widths

---

## Cards & Panels

### Stat Card

```tsx
<div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  {/* icon + label + value */}
</div>
```

### Content Card

Same border/radius/padding. Use `grid gap-6` for card layouts.

### Workspace Card (Sidebar)

```tsx
<div className="m-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
```

---

## Icons

- Library: **lucide-react** only
- Table row icons: `size={16}` or `size={18}`
- Nav icons: `size={20}`
- Button icons: `h-4 w-4` with `mr-2`
- Semantic: `BedDouble` (rooms), `CalendarDays` (bookings), `User` (guest), `Trash2` (delete), `Pencil` (edit), `Plus` (create)

---

## Do / Don't

| Do                                    | Don't                              |
|---------------------------------------|------------------------------------|
| Use `cn()` for conditional classes    | Concatenate class strings manually |
| Use theme tokens in `components/ui/`| Hardcode colors in UI primitives   |
| Use zinc palette in feature components | Mix random color palettes       |
| Keep Russian UI copy consistent       | Mix EN/RU in same view             |
| Use Sheet for create/edit forms       | Use `window.prompt` for data entry |
| Show toast on mutation success/error  | Use `alert()` (except legacy leads)|
