import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarDays,
  LineChart,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type DemoPreviewArea = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  topics: readonly string[];
};

export const DEMO_PAGE_HERO = {
  overline: "Demo",
  headline: "See how Monavel would run your hotel.",
  subhead:
    "A personalized walkthrough built around the workflows your team uses every day.",
  primaryCtaLabel: "Book a demo",
  primaryCtaHref: "#demo-booking",
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const DEMO_PAGE_PREVIEW = {
  sectionId: "demo-preview",
  overline: "What we'll show",
  headline: "See the Runtime around your hotel.",
  subhead:
    "We focus on the workflows most relevant to your property and team.",
  areas: [
    {
      id: "operations",
      icon: CalendarDays,
      title: "Operations",
      description: "Reservations, rooms, arrivals, and daily hotel activity.",
      topics: ["Bookings", "Calendar", "Rooms"],
    },
    {
      id: "ai-reception",
      icon: Bot,
      title: "AI Reception",
      description: "Guest conversations, knowledge, and human oversight.",
      topics: ["Website Chat", "Telegram", "Knowledge"],
    },
    {
      id: "revenue",
      icon: LineChart,
      title: "Revenue",
      description: "Occupancy signals, recommendations, and performance views.",
      topics: ["Rates", "Reports", "Recommendations"],
    },
  ] satisfies DemoPreviewArea[],
} as const;

export const DEMO_HOTEL_SIZE_OPTIONS = [
  { value: "1-25", label: "1–25 rooms" },
  { value: "26-75", label: "26–75 rooms" },
  { value: "76-150", label: "76–150 rooms" },
  { value: "151+", label: "151+ rooms" },
] as const;

export const DEMO_PAGE_FORM = {
  sectionId: "demo-booking",
  overline: "Book a demo",
  headline: "Schedule your walkthrough.",
  subhead:
    "Tell us the essentials. We will tailor the session to your hotel and confirm a time by email.",
  submitLabel: "Book a demo",
  successTitle: "Demo request received.",
  successMessage:
    "Thank you. Our team will reach out by email to confirm your personalized walkthrough.",
  fields: {
    name: { id: "demo-name", label: "Name", required: true },
    hotel: { id: "demo-hotel", label: "Hotel", required: true },
    email: { id: "demo-email", label: "Email", required: true },
    rooms: { id: "demo-rooms", label: "Hotel size", required: false },
    message: {
      id: "demo-message",
      label: "What should we focus on?",
      required: false,
    },
  },
} as const;

export const DEMO_PAGE_FAQ = {
  sectionId: "demo-faq",
  overline: "FAQ",
  headline: "Before you book.",
  subhead: "Quick answers about the walkthrough.",
  items: [
    {
      question: "How long is the demo?",
      answer:
        "Most walkthroughs run 30 to 45 minutes, depending on your questions.",
    },
    {
      question: "Is it personalized?",
      answer:
        "Yes. We focus on the workflows most relevant to your hotel.",
    },
    {
      question: "Can my team join?",
      answer:
        "Yes. Front desk, reservations, management, and IT are welcome.",
    },
    {
      question: "What happens after the demo?",
      answer:
        "We follow up with the most relevant next step for your property.",
    },
  ],
} as const;
