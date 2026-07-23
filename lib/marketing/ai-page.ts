import { MKT_CTA } from "@/lib/marketing/product-language";
import { MARKETING_CTA } from "@/lib/marketing/routes";

export type AiHeroConversation = {
  id: string;
  guest: string;
  reply: string;
  replyMeta: string;
  outcome: string;
  revenue?: string;
};

export const AI_PAGE_HERO = {
  headline: "Your hotel never sleeps.",
  headlineAccent: "Neither does your reception.",
  lines: [
    "Every guest answered.",
    "Every booking protected.",
    "24 hours a day.",
  ] as const,
  conversations: [
    {
      id: "c1",
      guest: "Any chance of a room upgrade?",
      reply: "Upgrade confirmed.",
      replyMeta: "8 sec",
      outcome: "Reservation confirmed",
      revenue: "+$42",
    },
    {
      id: "c2",
      guest: "Do you have airport transfers?",
      reply: "Transfer booked.",
      replyMeta: "8 sec",
      outcome: "Transfer booked",
      revenue: "+$58",
    },
    {
      id: "c3",
      guest: "Can I check in around midnight?",
      reply: "Late check-in approved.",
      replyMeta: "8 sec",
      outcome: "Late check-in approved",
      revenue: "+$186",
    },
  ] satisfies AiHeroConversation[],
  liveEvents: [
    { id: "book-1", kind: "booking", label: "Reservation confirmed", detail: "+$186" },
    { id: "tr-1", kind: "booking", label: "Transfer booked", detail: "+$58" },
    { id: "late-1", kind: "message", label: "Late check-in", detail: "Approved" },
    { id: "inv-1", kind: "status", label: "Invoice", detail: "Delivered" },
    { id: "rev-1", kind: "status", label: "Review", detail: "Scheduled" },
    { id: "up-1", kind: "revenue", label: "Upgrade", detail: "+$42" },
    { id: "spa-1", kind: "booking", label: "Spa", detail: "Booked" },
    { id: "taxi-1", kind: "message", label: "Taxi", detail: "Booked" },
  ] as const,
} as const;

export type AiNightEvent = {
  id: string;
  time: string;
  request: string;
  result: string;
  money?: string;
};

export const AI_PAGE_NIGHT = {
  sectionId: "ai-while-you-sleep",
  headline: "Overnight, nothing is missed.",
  events: [
    {
      id: "reservation",
      time: "01:18",
      request: "Reservation",
      result: "+$186",
      money: "+$186",
    },
    {
      id: "transfer",
      time: "01:52",
      request: "Airport transfer",
      result: "+$58",
      money: "+$58",
    },
    {
      id: "breakfast",
      time: "02:20",
      request: "Breakfast",
      result: "Booked",
    },
    {
      id: "late-check-in",
      time: "03:34",
      request: "Late check-in",
      result: "Approved",
    },
    {
      id: "spa",
      time: "04:11",
      request: "Spa",
      result: "Booked",
    },
    {
      id: "wakeup",
      time: "04:48",
      request: "Wake-up call",
      result: "Scheduled",
    },
    {
      id: "taxi",
      time: "05:12",
      request: "Taxi",
      result: "Booked",
    },
    {
      id: "invoice",
      time: "05:44",
      request: "Invoice",
      result: "Delivered",
    },
    {
      id: "review",
      time: "06:03",
      request: "Review",
      result: "Scheduled",
    },
  ] satisfies AiNightEvent[],
  summary: {
    title: "Tonight",
    stats: [
      { label: "Guests", value: "63" },
      { label: "Response Time", value: "8 sec" },
      { label: "Revenue", value: "$1,428" },
      { label: "Uptime", value: "99.8%" },
      { label: "Missed", value: "0" },
    ] as const,
  },
} as const;

export type AiStoryStep = {
  kind: "guest" | "wait" | "ai" | "action" | "outcome";
  role?: string;
  text: string;
  elapsed?: string;
  money?: string;
  tone?: "wait" | "loss" | "gain" | "action";
};

export type AiStorySummary = {
  responseValue: string;
  responseLabel: string;
  outcomeValue: string;
  revenueValue: string;
  revenueLabel: string;
};

export const AI_PAGE_COMPARE = {
  sectionId: "ai-every-second",
  headline: "Every second matters.",
  subtitle: "Slow replies lose bookings.\nFast replies protect revenue.",
  exampleLabel: "Illustrative example, not measured data",
  without: {
    label: "Without Monavel",
    steps: [
      {
        kind: "guest",
        role: "Guest",
        text: "Can I check in late?",
      },
      {
        kind: "wait",
        text: "No reply",
        elapsed: "12 min",
        tone: "wait",
      },
      {
        kind: "wait",
        text: "Still waiting",
        elapsed: "34 min",
        tone: "wait",
      },
      {
        kind: "wait",
        text: "Opens another channel",
        tone: "wait",
      },
      {
        kind: "outcome",
        text: "Reservation lost",
        money: "−$186",
        tone: "loss",
      },
    ] satisfies AiStoryStep[],
    summary: {
      responseValue: "45 min",
      responseLabel: "Response time",
      outcomeValue: "Guest lost",
      revenueValue: "−$186",
      revenueLabel: "Revenue",
    } satisfies AiStorySummary,
  },
  withMonavel: {
    label: "With Monavel",
    steps: [
      {
        kind: "guest",
        role: "Guest",
        text: "Can I check in late?",
      },
      {
        kind: "ai",
        text: "AI replies",
        elapsed: "8 sec",
        tone: "action",
      },
      {
        kind: "action",
        text: "Late check-in approved",
        tone: "action",
      },
      {
        kind: "outcome",
        text: "Guest retained",
        money: "+$186",
        tone: "gain",
      },
    ] satisfies AiStoryStep[],
    summary: {
      responseValue: "8 sec",
      responseLabel: "Response time",
      outcomeValue: "Guest retained",
      revenueValue: "+$186",
      revenueLabel: "Revenue",
    } satisfies AiStorySummary,
  },
} as const;

export type AiConversationItem = {
  id: string;
  request: string;
  detail: string;
  emphasis?: "money" | "default";
};

export const AI_PAGE_CONVERSATIONS = {
  sectionId: "ai-conversations",
  headline: "Every request handled.",
  items: [
    { id: "breakfast", request: "Breakfast", detail: "Booked" },
    { id: "airport", request: "Airport transfer", detail: "+$58", emphasis: "money" },
    { id: "upgrade", request: "Upgrade", detail: "+$42", emphasis: "money" },
    { id: "invoice", request: "Invoice", detail: "Delivered" },
    { id: "restaurant", request: "Restaurant", detail: "Booked" },
    { id: "taxi", request: "Taxi", detail: "Booked" },
    { id: "laundry", request: "Laundry", detail: "Scheduled" },
    { id: "spa", request: "Spa", detail: "Booked" },
    { id: "directions", request: "Directions", detail: "Delivered" },
    { id: "late", request: "Late check-in", detail: "Approved" },
    { id: "wifi", request: "Wi-Fi", detail: "Delivered" },
    { id: "wakeup", request: "Wake-up call", detail: "Scheduled" },
    { id: "parking", request: "Parking", detail: "Booked" },
    { id: "extra-night", request: "Extra night", detail: "+$210", emphasis: "money" },
    { id: "review", request: "Review", detail: "Scheduled" },
    { id: "lost", request: "Lost & Found", detail: "Scheduled" },
  ] satisfies AiConversationItem[],
} as const;

export type AiStatusMetric = {
  id: string;
  label: string;
  value: string;
  numeric?: number;
  format?: "currency";
};

export type AiStatusSystem = {
  id: string;
  label: string;
  state: string;
};

export const AI_PAGE_STATUS = {
  sectionId: "ai-always-online",
  headline: "Everything stays connected.",
  systems: [
    { id: "reception", label: "Reception", state: "Online" },
    { id: "knowledge", label: "Knowledge Base", state: "Synced" },
    { id: "reservations", label: "Reservations", state: "Connected" },
    { id: "booking", label: "Booking.com", state: "Connected" },
    { id: "airbnb", label: "Airbnb", state: "Connected" },
    { id: "website", label: "Website", state: "Connected" },
    { id: "whatsapp", label: "WhatsApp", state: "Connected" },
    { id: "telegram", label: "Telegram", state: "Connected" },
    { id: "email", label: "Email", state: "Connected" },
  ] satisfies AiStatusSystem[],
  metrics: [
    { id: "online", label: "AI Reception", value: "24/7" },
    { id: "response", label: "Response Time", value: "8 sec" },
    { id: "uptime", label: "Uptime", value: "99.8%" },
    {
      id: "revenue",
      label: "Revenue",
      value: "$1,428",
      numeric: 1428,
      format: "currency",
    },
  ] satisfies AiStatusMetric[],
} as const;

export const AI_PAGE_CTA = {
  sectionId: "ai-closing",
  beats: ["One guest.", "One reply.", "One booking."] as const,
  headline: "Start today.",
  body: "Protect every booking from the first message.",
  actions: [
    "Breakfast booked",
    "Invoice delivered",
    "Upgrade confirmed",
    "Taxi booked",
    "Late check-in approved",
    "Reservation confirmed",
    "Airport transfer booked",
    "Wake-up call scheduled",
    "Review scheduled",
  ] as const,
  primaryCtaLabel: MKT_CTA.startFreeTrial,
  primaryCtaHref: MARKETING_CTA.trial,
} as const;
