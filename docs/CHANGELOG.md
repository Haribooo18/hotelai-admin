# Changelog

All notable changes to the HotelAI Admin project documentation and architecture.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added

- Project documentation structure (`docs/`)
- `ARCHITECTURE.md` — feature-first architecture, data flow, conventions
- `PRODUCT.md` — HotelAI product vision and value propositions
- `ROADMAP.md` — feature roadmap across all PMS modules
- `BACKLOG.md` — prioritized work items and technical debt
- `DATABASE.md` — schema documentation for all tables in use
- `UI_GUIDELINES.md` — spacing, typography, colors, components
- `CODING_STANDARDS.md` — TypeScript, React, and project conventions
- Cursor AI rules (`.cursor/rules/`) — machine-readable rule summaries

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
