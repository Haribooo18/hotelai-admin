import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  CalendarCheck,
  LineChart,
  MessageSquare,
  Radio,
  UserRound,
  Users,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export const AI_PAGE_HERO = {
  overline: "Monavel AI",
  headline: "AI that understands your hotel.",
  subhead:
    "Grounded in your knowledge base, reservations, and operational data — not generic chatbot replies.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const AI_PAGE_HOW_IT_WORKS = {
  sectionId: "ai-how-it-works",
  overline: "How AI works",
  headline: "From guest message to contextual reply.",
  subhead:
    "Every response is grounded in your hotel's data — channels, knowledge, and workspace context flow through one AI layer.",
  steps: [
    { id: "guest", label: "Guest" },
    { id: "channel", label: "Channel" },
    { id: "ai", label: "Monavel AI" },
    { id: "context", label: "Knowledge + Reservation Context" },
    { id: "response", label: "Response" },
  ],
} as const;

export type AiPageCapability = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  examples: readonly string[];
};

export const AI_PAGE_CAPABILITIES = {
  sectionId: "ai-capabilities",
  overline: "Capabilities",
  headline: "What Monavel AI helps with.",
  subhead:
    "AI is embedded in the platform — focused on hotel operations, not disconnected general chat.",
  items: [
    {
      id: "guest-communication",
      icon: MessageSquare,
      title: "Guest Communication",
      description:
        "Answer common guest questions using hotel knowledge and stay context.",
      examples: ["Check-in times", "Amenities", "Local directions"],
    },
    {
      id: "reservation-assistance",
      icon: CalendarCheck,
      title: "Reservation Assistance",
      description:
        "Help guests with booking-related questions using reservation data from your workspace.",
      examples: ["Booking status", "Arrival details", "Stay changes"],
    },
    {
      id: "operational-guidance",
      icon: Users,
      title: "Operational Guidance",
      description:
        "Surface operational context to support staff decisions alongside guest-facing replies.",
      examples: ["Arrivals overview", "Room status context", "Handoff notes"],
    },
    {
      id: "revenue-recommendations",
      icon: LineChart,
      title: "Revenue Recommendations",
      description:
        "Highlight demand and pricing signals from revenue views to support team decisions.",
      examples: ["Occupancy signals", "Rate adjustments", "Weekend demand"],
    },
  ] satisfies AiPageCapability[],
} as const;

export const AI_PAGE_KNOWLEDGE_CONTEXT = {
  sectionId: "ai-knowledge-context",
  overline: "Knowledge & Context",
  headline: "Contextual responses, not generic chat.",
  subhead:
    "Monavel AI combines live hotel data before replying — so answers reflect your property, policies, and current operations.",
  sources: [
    {
      id: "knowledge",
      title: "Hotel knowledge base",
      description: "Policies, FAQs, and property information your team maintains.",
    },
    {
      id: "reservations",
      title: "Reservations",
      description: "Booking status and stay details from your PMS workspace.",
    },
    {
      id: "guest-history",
      title: "Guest history",
      description: "Prior conversations and guest profile context where available.",
    },
    {
      id: "operations",
      title: "Internal operations",
      description: "Rooms, calendar, and workspace signals that inform accurate replies.",
    },
  ],
} as const;

export type AiPageChannel = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  status: "available" | "planned";
};

export const AI_PAGE_GUEST_CHANNELS = {
  sectionId: "ai-guest-channels",
  overline: "Guest channels",
  headline: "Where guests reach your AI reception.",
  subhead:
    "Messages from connected channels route into the same Reception AI inbox and knowledge context.",
  channels: [
    {
      id: "website-chat",
      icon: MessageSquare,
      title: "Website Chat",
      description:
        "Embedded chat on your hotel website routes guest messages to Monavel.",
      status: "available",
    },
    {
      id: "telegram",
      icon: Radio,
      title: "Telegram",
      description:
        "Telegram bot integration for guest messaging with shared AI context.",
      status: "available",
    },
    {
      id: "future-channels",
      icon: Bot,
      title: "Additional channels",
      description:
        "More guest channels are planned and will connect to the same inbox model.",
      status: "planned",
    },
  ] satisfies AiPageChannel[],
} as const;

export const AI_PAGE_HUMAN_WORKFLOW = {
  sectionId: "ai-human-workflow",
  overline: "Human + AI workflow",
  headline: "AI handles routine. Staff handles exceptions.",
  subhead:
    "Monavel AI resolves common guest questions automatically. Your team steps in when judgment, empathy, or policy exceptions are needed.",
  aiHandles: [
    "Policy and amenity questions",
    "Booking status lookups",
    "Repeat guest inquiries",
  ],
  staffHandles: [
    "Complex complaints",
    "Special accommodations",
    "High-priority escalations",
  ],
  escalationLabel: "Escalation to staff",
} as const;

export const AI_PAGE_BENEFITS = {
  sectionId: "ai-benefits",
  overline: "Benefits",
  headline: "What contextual AI changes for hotels.",
  subhead:
    "The goal is reliable assistance grounded in your hotel — reducing repetitive work without removing human oversight.",
  items: [
    {
      id: "faster-responses",
      title: "Faster guest responses",
      description:
        "Guests get immediate answers to routine questions across connected channels.",
    },
    {
      id: "reduced-workload",
      title: "Reduced workload",
      description:
        "Front desk and reception spend less time on repetitive messaging tasks.",
    },
    {
      id: "consistent-answers",
      title: "Consistent answers",
      description:
        "Knowledge-backed replies stay aligned with hotel policies and published information.",
    },
    {
      id: "better-experience",
      title: "Better guest experience",
      description:
        "Guests receive accurate, contextual help — with staff available when it matters.",
    },
  ],
} as const;

export const AI_PAGE_CONTEXT_ICONS = {
  knowledge: BookOpen,
  reservations: CalendarCheck,
  "guest-history": UserRound,
  operations: Users,
} as const;
