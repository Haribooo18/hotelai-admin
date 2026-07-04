# HotelAI — Product Vision

## Mission

HotelAI is a **commercial SaaS Property Management System (PMS)** that helps independent hotels and small hospitality groups run daily operations with less manual work — and with an AI receptionist that never sleeps.

We believe small hotels deserve enterprise-grade tooling without enterprise complexity or cost.

---

## Vision

**One platform where hotel staff manage everything — and AI handles the rest.**

HotelAI combines traditional PMS capabilities (rooms, bookings, guests, housekeeping, payments) with an intelligent AI layer that answers guest inquiries, captures leads, and assists staff in real time.

The admin panel (`hotelai-admin`) is the **command center** for hotel owners and front-desk staff. The AI receptionist is the **guest-facing front door** that feeds leads and bookings into the same system.

---

## Target Users

| Persona            | Needs                                                |
|--------------------|------------------------------------------------------|
| Hotel Owner        | Revenue overview, occupancy, pricing, reports        |
| Front Desk Manager | Bookings, check-in/out, guest records, calendar      |
| Housekeeping Lead  | Room status, cleaning schedules, maintenance flags   |
| Revenue Manager    | Dynamic pricing, channel rates, forecasting        |

---

## Core Value Propositions

### 1. AI-First Guest Communication

- 24/7 AI receptionist handles inquiries in natural language
- Incoming requests become **leads** in the admin dashboard automatically
- Staff convert leads to confirmed bookings in one click
- FAQ / knowledge base powers consistent AI responses

### 2. Unified Operations

- Single source of truth for rooms, availability, bookings, and guests
- Visual calendar for occupancy planning
- Real-time updates when new leads or bookings arrive

### 3. Built for Small Hotels

- Fast setup — no 6-month implementation
- Modern, dark-themed UI designed for daily use
- Affordable SaaS pricing (per-property subscription)
- Multi-property support planned for hotel groups

### 4. Data-Driven Decisions

- Dashboard KPIs: occupancy, revenue, booking volume
- Reports and analytics (roadmap)
- Pricing intelligence powered by demand signals (roadmap)

---

## Product Pillars

```
┌─────────────────────────────────────────────────────────┐
│                      HotelAI PMS                        │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  Operations │   Revenue   │  Guest CRM  │  AI Layer     │
│  Rooms      │  Pricing    │  Guests     │  Receptionist │
│  Bookings   │  Payments   │  Leads      │  Knowledge    │
│  Calendar   │  Reports    │  History    │  Automation   │
│  Housekeep. │  Integrations│ Loyalty    │  Insights     │
└─────────────┴─────────────┴─────────────┴───────────────┘
```

---

## Current Product State (Admin Panel)

### Live Features

- **Leads Dashboard** — view, search, filter, and update incoming guest inquiries
- **Bookings** — create, edit, delete reservations with room conflict detection
- **Rooms** — CRUD room inventory with type, capacity, and price
- **Calendar** — visual room-by-room booking timeline
- **Dashboard Stats** — occupancy, revenue, room and booking counts
- **Realtime** — toast notifications on new leads

### Workspace Model

Each hotel is a **workspace** (e.g. Aurora Hotel / `hotel_aurora`). All data is tenant-scoped. The sidebar shows the active workspace; switching properties is a future capability.

---

## AI Receptionist Role

The AI receptionist is not a chatbot bolt-on — it is a **core product surface**:

1. Guest messages the hotel (web, WhatsApp, etc. — integrations roadmap)
2. AI answers using hotel FAQ and live availability
3. If booking intent detected → creates a **lead** with guest details, dates, room preference
4. Staff sees lead in admin → contacts guest → confirms → creates **booking**

This closed loop is HotelAI's primary differentiator vs. legacy PMS tools.

---

## Design Principles

| Principle              | Description                                           |
|------------------------|-------------------------------------------------------|
| Speed over ceremony    | Common tasks (new booking, check-in) in ≤ 3 clicks      |
| Dark-first UI          | Reduced eye strain for staff working long shifts      |
| Mobile-aware           | Responsive layouts; full mobile admin is roadmap      |
| Russian-first UI       | Primary locale is Russian; i18n planned               |
| Fail gracefully        | Clear error messages; never silent failures           |

---

## Competitive Positioning

| Legacy PMS            | HotelAI                                      |
|-----------------------|----------------------------------------------|
| Complex onboarding    | Minutes to first booking                     |
| No AI                 | Native AI receptionist                       |
| Expensive per-seat    | Per-property SaaS pricing                    |
| Dated UI              | Modern React admin                           |
| Siloed channels       | Unified leads → bookings pipeline            |

---

## Success Metrics

| Metric                         | Target (Year 1)        |
|--------------------------------|------------------------|
| Lead-to-booking conversion     | > 30%                  |
| AI inquiry resolution rate     | > 70% without staff    |
| Admin daily active usage       | > 80% of subscribed hotels |
| Booking creation time          | < 60 seconds           |
| System uptime                  | 99.9%                  |

---

## Long-Term Product Direction

1. **Full PMS** — housekeeping, payments, pricing, reports
2. **Channel manager** — OTA integrations (Booking.com, Airbnb)
3. **Guest portal** — self-service check-in, upsells
4. **AI insights** — demand forecasting, pricing recommendations
5. **Multi-property** — hotel group dashboard with consolidated reporting
6. **Marketplace** — third-party integrations (POS, accounting, locks)

HotelAI aims to be the operating system for modern independent hospitality.
