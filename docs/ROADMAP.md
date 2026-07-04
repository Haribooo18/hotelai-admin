# HotelAI — Product Roadmap

Roadmap organized by feature area. Status key: ✅ Done · 🚧 In Progress · 📋 Planned · 🔮 Future

---

## Dashboard

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| KPI cards (rooms, bookings, occupancy, revenue) | ✅ Done   | `DashboardStats` component                 |
| Recent bookings list                      | ✅ Done       | Dashboard page                             |
| Quick actions panel                       | ✅ Done       | Links to bookings, rooms, calendar         |
| Leads overview with charts                | ✅ Done       | `DashboardCharts`, `LeadsTable`            |
| Realtime lead notifications               | ✅ Done       | `RealtimeListener`, Supabase channels      |
| Unified dashboard (merge leads + stats)   | 🚧 In Progress| Two dashboard variants coexist             |
| Date-range filtering for KPIs             | 📋 Planned    |                                            |
| Revenue trend chart (real data)           | 📋 Planned    | Currently mock data in charts              |
| Multi-property switcher                   | 🔮 Future     |                                            |

---

## Rooms

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| List rooms with type, capacity, price     | ✅ Done       | `RoomsTable`                               |
| Create room                               | ✅ Done       | `RoomCreateDialog`, `createRoom`           |
| Edit room                                 | ✅ Done       | Reuses `RoomCreateDialog` with `room` prop |
| Delete room                               | ✅ Done       | `deleteRoom` with confirm dialog           |
| Room photos                               | 📋 Planned    |                                            |
| Room amenities tags                       | 📋 Planned    |                                            |
| Floor / building assignment               | 📋 Planned    |                                            |
| Room status (clean, dirty, maintenance)   | 📋 Planned    | Ties to Housekeeping                       |
| Bulk import (CSV)                         | 🔮 Future     |                                            |

---

## Bookings

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| List bookings with status badges          | ✅ Done       | `BookingsTable`, `BookingStatusBadge`      |
| Create booking with room selection        | ✅ Done       | `BookingCreateDialog`, conflict detection  |
| Edit booking                              | ✅ Done       | `BookingEditDialog`                        |
| Delete booking                            | ✅ Done       |                                            |
| Search and status filters                 | ✅ Done       | `BookingsFilters`                          |
| Auto price calculation (nights × rate)    | ✅ Done       | `calculateTotalPrice` in mutations           |
| Room availability validation              | ✅ Done       | `ensureRoomAvailable`                      |
| Check-in / check-out status transitions   | 📋 Planned    | Status exists; no UI workflow yet          |
| Convert lead → booking                    | 📋 Planned    |                                            |
| Booking notes and special requests        | 📋 Planned    |                                            |
| Email confirmation to guest               | 📋 Planned    |                                            |
| Payment status on booking                 | 📋 Planned    | Ties to Payments                           |

---

## Calendar

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Horizontal timeline with booking bars     | ✅ Done (Sprint 5) | `CalendarTimeline`, `CalendarBookingBar`   |
| Month / week navigation + Today           | ✅ Done (Sprint 5) | `CalendarToolbar`, view toggle             |
| Sticky room column & date header          | ✅ Done (Sprint 5) | `CalendarRoomCell`, `CalendarDateHeader`   |
| Virtualized row scrolling                 | ✅ Done (Sprint 5) | windowed rows in `CalendarTimeline`        |
| Booking detail on click                   | ✅ Done (Sprint 5) | reuses `BookingEditDialog`                 |
| Drag-and-drop reschedule                  | ✅ Done (Sprint 5) | `rescheduleBooking` mutation               |
| Resize by dragging edges                  | ✅ Done (Sprint 5) | pointer handles on `CalendarBookingBar`    |
| Color coding by status                    | ✅ Done (Sprint 5) | `barClassName` in `lib/booking-status.ts`  |
| Hover card with summary                   | ✅ Done (Sprint 5) | group-hover/focus card                     |
| Occupancy indicators & empty rooms        | ✅ Done (Sprint 5) | `computeOccupancy`, room availability bars |
| Weekend / today highlighting              | ✅ Done (Sprint 5) |                                            |
| Keyboard reschedule & mobile agenda       | ✅ Done (Sprint 5) | arrow/Shift+arrow; `CalendarAgenda`        |
| Create booking from calendar cell         | 📋 Planned    |                                            |
| Multi-room drag (change room)             | 🔮 Future     |                                            |

---

## Guests

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Guest type definition                     | ✅ Done       | `types/guest.ts`                           |
| Guest service (list/get/history)          | ✅ Done       | `getGuests`, `getGuest`, `getGuestBookings`|
| Guest CRUD mutations                       | ✅ Done (Sprint 4) | create/update/soft-delete/merge/flags |
| Guests page UI                            | ✅ Done (Sprint 4) | `/guests` → `GuestsPage`              |
| Guest profile with booking history        | ✅ Done (Sprint 4) | `/guests/[id]` + stay statistics      |
| Guest search and filters                  | ✅ Done (Sprint 4) | search + VIP/favorite/tag filters     |
| VIP / favorite / tags                     | ✅ Done (Sprint 4) | flags + free-form tags                |
| Merge duplicate guests                    | ✅ Done (Sprint 4) | `mergeGuests`                         |
| Soft delete                               | ✅ Done (Sprint 4) | `deleted_at` tombstone                |
| Link booking to guest record (FK)         | 📋 Planned    | Still matched by email/name (TD-11)        |

---

## Housekeeping

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Room cleaning status board                | 📋 Planned    |                                            |
| Assign tasks to staff                     | 📋 Planned    |                                            |
| Mark room clean / dirty / inspected       | 📋 Planned    |                                            |
| Auto-dirty on checkout                    | 📋 Planned    |                                            |
| Maintenance request logging               | 📋 Planned    |                                            |
| Mobile-friendly housekeeping view         | 🔮 Future     |                                            |

---

## Payments

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Record payment against booking            | 📋 Planned    |                                            |
| Payment methods (cash, card, transfer)      | 📋 Planned    |                                            |
| Partial payments and deposits             | 📋 Planned    |                                            |
| Invoice generation                        | 📋 Planned    |                                            |
| Stripe integration                        | 🔮 Future     |                                            |
| Refund workflow                           | 🔮 Future     |                                            |

---

## Pricing

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Base room price (per room)                | ✅ Done       | `rooms.price` field                        |
| Pricing page UI                           | 📋 Planned    | Nav link exists (`/pricing`)               |
| Seasonal rate rules                       | 📋 Planned    |                                            |
| Day-of-week pricing                       | 📋 Planned    |                                            |
| Length-of-stay discounts                  | 📋 Planned    |                                            |
| AI-suggested dynamic pricing              | 🔮 Future     |                                            |

---

## Reports

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Occupancy report                          | 📋 Planned    |                                            |
| Revenue report (daily / monthly)          | 📋 Planned    |                                            |
| Booking source analytics                  | 📋 Planned    |                                            |
| Export to CSV / PDF                       | 📋 Planned    |                                            |
| Custom date range reports                 | 🔮 Future     |                                            |

---

## AI

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| AI receptionist (guest-facing)            | ✅ Done       | External service; feeds leads                |
| Lead capture from AI conversations        | ✅ Done       | `leads` table, `list_hotel_leads` RPC        |
| FAQ / Knowledge base page                 | 📋 Planned    | Nav link exists (`/knowledge`)             |
| AI-suggested responses for staff          | 📋 Planned    |                                            |
| Conversation history viewer               | 📋 Planned    |                                            |
| AI booking assistant (staff-side)         | 🔮 Future     |                                            |
| Demand forecasting                        | 🔮 Future     |                                            |

---

## Settings

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Settings page                             | 📋 Planned    | Nav link exists (`/settings`)              |
| Hotel profile (name, address, timezone)   | 📋 Planned    |                                            |
| User management and roles                 | 📋 Planned    |                                            |
| Notification preferences                  | 📋 Planned    |                                            |
| Branding (logo, colors)                   | 📋 Planned    |                                            |
| API keys for integrations                 | 🔮 Future     |                                            |

---

## Integrations

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Supabase (database + realtime)            | ✅ Done       |                                            |
| WhatsApp / Telegram for AI receptionist   | 📋 Planned    |                                            |
| Booking.com / Airbnb channel sync         | 🔮 Future     |                                            |
| Google Calendar sync                      | 🔮 Future     |                                            |
| Accounting (QuickBooks, Xero)             | 🔮 Future     |                                            |
| Smart lock systems                        | 🔮 Future     |                                            |
| Webhook API for custom integrations       | 🔮 Future     |                                            |

---

## Platform & Infrastructure

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Supabase Auth + RLS                       | ✅ Done (Sprint 1) | Apply RLS migration on Supabase; harden leads RPCs |
| Multi-tenant hotel isolation              | ✅ Done (Sprint 1) | `lib/tenant.ts` + `memberships` + RLS      |
| Error boundaries per route                | 🟡 Partial | `/rooms`, `/bookings`, `/guests`, `/calendar` done; `/` pending |
| Zod form validation                       | ✅ Done (Sprint 3) | `lib/validations/{room,booking}.ts` shared client + server |
| E2E test suite                            | 📋 Planned    |                                            |
| CI/CD pipeline                            | 📋 Planned    |                                            |
| Staging environment                       | 📋 Planned    |                                            |

---

## Release Phases

### Phase 1 — Foundation (Current)
Rooms, Bookings, Calendar, Leads, Dashboard stats, documentation

### Phase 2 — Guest & Operations
Guests page, check-in/out workflow, housekeeping board, lead → booking conversion

### Phase 3 — Revenue
Pricing rules, payments, basic reports

### Phase 4 — AI & Scale
Knowledge base, AI insights, auth/multi-tenant, integrations
