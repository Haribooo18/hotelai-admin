export const WHY_HOTELS_NEED_CONTENT = {
  sectionId: "why-hotels-need",
  headlineLines: ["One Runtime", "Every hotel system"] as const,
  subhead: "Every update becomes shared operational context.",
} as const;

export type ChannelIconId = "whatsapp" | "telegram" | "booking" | "email";

export type CommunicationChannel = {
  id: ChannelIconId;
  label: string;
};

export type CommunicationMessage = {
  time: string;
  channelId: ChannelIconId;
  text: string;
};

export type CommunicationCard = {
  id: "communication";
  title: string;
  channels: readonly CommunicationChannel[];
  messages: readonly CommunicationMessage[];
  hub: string;
  hubStatus: string;
  guestName: string;
  guestStatus: string;
  contextChips: readonly string[];
  footerLabel: string;
  footerTime: string;
  summary: string;
};

export type OperationsStageState = "completed" | "current" | "upcoming";

export type OperationsStage = {
  label: string;
  time: string;
  state: OperationsStageState;
  assigneeInitial?: string;
  assigneeName?: string;
  eta?: string;
};

export type OperationsCard = {
  id: "operations";
  title: string;
  stages: readonly OperationsStage[];
  roomLabel: string;
  roomStatus: string;
  roomNote: string;
  summary: string;
};

export type HotelDataSource = {
  label: string;
  value: string;
};

export type HotelDataMetric = {
  label: string;
  value: string;
  delta: string;
  percent: number;
  visual: "bar" | "spark";
};

export type HotelDataActivity = {
  label: string;
  time: string;
};

export type HotelDataCard = {
  id: "hotel-data";
  title: string;
  sources: readonly HotelDataSource[];
  hub: string;
  hubStatus: string;
  dashboardLabel: string;
  metrics: readonly HotelDataMetric[];
  activityLabel: string;
  activities: readonly HotelDataActivity[];
  footerLabel: string;
  footerTime: string;
  syncLabel: string;
  summary: string;
};

export type RevenueKpi = {
  label: string;
  value: string;
  delta?: string;
  sparkPoints?: readonly number[];
};

export type RevenueCard = {
  id: "revenue";
  title: string;
  kpis: readonly RevenueKpi[];
  recommendationLabel: string;
  adrCurrent: string;
  adrRecommended: string;
  demandLabel: string;
  confidenceLabel: string;
  confidencePercent: number;
  impactLabel: string;
  impactValue: string;
  impactDelta: string;
  chartPoints: readonly number[];
  actionLabel: string;
  actionTimer: string;
  summary: string;
};

export const COMMUNICATION_CARD: CommunicationCard = {
  id: "communication",
  title: "Communication",
  channels: [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "telegram", label: "Telegram" },
    { id: "booking", label: "Booking.com" },
    { id: "email", label: "Email" },
  ],
  messages: [
    { time: "23:12", channelId: "whatsapp", text: "Arriving after midnight" },
    { time: "23:15", channelId: "telegram", text: "Need parking" },
    { time: "23:17", channelId: "booking", text: "Can I check in late?" },
    { time: "23:18", channelId: "email", text: "Request invoice" },
  ],
  hub: "Monavel AI",
  hubStatus: "Understanding guest intent…",
  guestName: "Maria Thompson",
  guestStatus: "VIP",
  contextChips: ["Late arrival", "Parking requested", "Invoice"],
  footerLabel: "Guest profile updated",
  footerTime: "23:18",
  summary:
    "WhatsApp, Telegram, Booking.com, and Email messages from Maria Thompson merge through Monavel AI into one VIP guest profile: late arrival, parking requested, invoice.",
};

export const OPERATIONS_CARD: OperationsCard = {
  id: "operations",
  title: "Operations",
  stages: [
    { label: "Booking confirmed", time: "23:10", state: "completed" },
    {
      label: "Housekeeping assigned",
      time: "23:11",
      state: "completed",
      assigneeInitial: "A",
      assigneeName: "Anna",
      eta: "15m",
    },
    { label: "Room cleaned", time: "23:25", state: "completed" },
    { label: "Room inspected", time: "23:35", state: "completed" },
    { label: "Ready for check-in", time: "23:40", state: "current" },
    { label: "Guest checked in", time: "—", state: "upcoming" },
  ],
  roomLabel: "Room 407",
  roomStatus: "Ready",
  roomNote: "All set for arrival",
  summary:
    "Maria's booking confirmation moves automatically through housekeeping, cleaning, and inspection, and is now ready for check-in in room 407.",
};

export const HOTEL_DATA_CARD: HotelDataCard = {
  id: "hotel-data",
  title: "Hotel Data",
  sources: [
    { label: "PMS", value: "42 bookings" },
    { label: "CRM", value: "84 guests" },
    { label: "Calendar", value: "12 arrivals" },
    { label: "Revenue", value: "$9.2k today" },
  ],
  hub: "Live Hotel Database",
  hubStatus: "All systems synced",
  dashboardLabel: "Dashboard",
  metrics: [
    { label: "Rooms", value: "31/40", delta: "78%", percent: 78, visual: "bar" },
    { label: "Guests", value: "84", delta: "+12%", percent: 62, visual: "spark" },
    { label: "Reservations", value: "42", delta: "+8%", percent: 48, visual: "spark" },
    { label: "Revenue", value: "$9.2k", delta: "+15%", percent: 74, visual: "spark" },
  ],
  activityLabel: "Recent Sync Activity",
  activities: [
    { label: "Guest profile updated", time: "23:41" },
    { label: "Booking imported", time: "23:40" },
    { label: "Revenue synced", time: "23:39" },
    { label: "Room status changed", time: "23:38" },
  ],
  footerLabel: "Last updated",
  footerTime: "23:41:02",
  syncLabel: "Live sync",
  summary:
    "PMS, CRM, calendar, and revenue systems synchronize into one live hotel database, powering a dashboard and recent sync activity for guest profiles, bookings, revenue, and room status.",
};

export const REVENUE_CARD: RevenueCard = {
  id: "revenue",
  title: "Revenue",
  kpis: [
    { label: "Occupancy", value: "84%", delta: "+8%", sparkPoints: [52, 58, 61, 72, 84] },
    { label: "Current ADR", value: "$118" },
    { label: "RevPAR", value: "$99", delta: "+12%", sparkPoints: [68, 72, 78, 88, 99] },
  ],
  recommendationLabel: "AI Pricing Recommendation",
  adrCurrent: "$118",
  adrRecommended: "$134",
  demandLabel: "Demand spike detected",
  confidenceLabel: "Confidence",
  confidencePercent: 98,
  impactLabel: "Projected Revenue Impact",
  impactValue: "+$2,180",
  impactDelta: "+12% vs. current forecast",
  chartPoints: [22, 30, 26, 38, 46, 42, 58, 72, 80],
  actionLabel: "Next pricing cycle",
  actionTimer: "00:59:32",
  summary:
    "84% occupancy and a demand spike trigger an AI pricing recommendation from $118 to $134 with 98% confidence, projecting revenue up $2,180, or 12%.",
};
