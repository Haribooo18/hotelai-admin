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
| Room rows with booking bars               | ✅ Done       | `CalendarGrid`, `CalendarRoomRow`          |
| Week / month navigation                   | ✅ Done       | `CalendarToolbar`, `CalendarHeader`        |
| Booking detail on click                   | 📋 Planned    |                                            |
| Drag-and-drop reschedule                  | 📋 Planned    |                                            |
| Create booking from calendar cell         | 📋 Planned    |                                            |
| Color coding by status                    | 📋 Planned    |                                            |
| Multi-week view                           | 🔮 Future     |                                            |

---

## Guests

| Item                                      | Status        | Notes                                      |
|-------------------------------------------|---------------|--------------------------------------------|
| Guest type definition                     | ✅ Done       | `types/guest.ts`                           |
| Guest service (list)                      | ✅ Done       | `getGuests`                                |
| Create / delete guest mutations           | ✅ Done       | `guests.mutations.ts`                      |
| Guests page UI                            | 📋 Planned    | Route `/guests` not yet created            |
| Guest profile with booking history        | 📋 Planned    |                                            |
| Link booking to guest record              | 📋 Planned    | Bookings use inline guest fields today     |
| Guest search and filters                  | 📋 Planned    |                                            |
| VIP / loyalty tags                        | 🔮 Future     |                                            |

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
| Supabase Auth + RLS                       | 📋 Planned    | Remove hardcoded `hotel_aurora`            |
| Multi-tenant hotel isolation              | 📋 Planned    |                                            |
| Error boundaries per route                | 📋 Planned    |                                            |
| Zod form validation                       | 📋 Planned    |                                            |
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
