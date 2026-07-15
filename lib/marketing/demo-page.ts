import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarDays,
  LineChart,
  Settings,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type DemoPreviewArea = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  topics: readonly string[];
};

export type DemoAudienceCard = {
  id: string;
  title: string;
  description: string;
};

export const DEMO_PAGE_HERO = {
  overline: "Demo",
  headline: "See Monavel in action.",
  subhead:
    "A personalized walkthrough across operations, AI reception, revenue, and administration.",
  primaryCtaLabel: "Book a demo",
  primaryCtaHref: "#demo-booking",
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const DEMO_PAGE_PREVIEW = {
  sectionId: "demo-preview",
  overline: "What you'll see",
  headline: "A full walkthrough of your hotel workspace.",
  subhead:
    "We tailor the demo to your property type and show how Monavel connects daily operations, guest communication, and team workflows.",
  areas: [
    {
      id: "operations",
      icon: CalendarDays,
      title: "Hotel Operations",
      description:
        "Core PMS workflows your front desk and reservations team use every day.",
      topics: ["Bookings", "Calendar", "Guests", "Rooms"],
    },
    {
      id: "ai-reception",
      icon: Bot,
      title: "AI Reception",
      description:
        "How guest messages flow through AI with your hotel knowledge and team oversight.",
      topics: ["Website Chat", "Telegram", "Knowledge"],
    },
    {
      id: "revenue",
      icon: LineChart,
      title: "Revenue",
      description:
        "Signals and views that support pricing and occupancy decisions inside Monavel.",
      topics: ["Reports", "Recommendations", "Analytics"],
    },
    {
      id: "administration",
      icon: Settings,
      title: "Administration",
      description:
        "How your team configures access, permissions, and hotel settings.",
      topics: ["Users", "Permissions", "Configuration"],
    },
  ] satisfies DemoPreviewArea[],
} as const;

export const DEMO_PAGE_PROCESS = {
  sectionId: "demo-process",
  overline: "How the demo works",
  headline: "Four steps from booking to onboarding.",
  subhead:
    "No scheduling widget — submit the form below and our team confirms a time by email.",
  steps: [
    { id: "book", label: "Book a time" },
    { id: "meet", label: "Meet with Monavel" },
    { id: "workflows", label: "See your workflows" },
    { id: "onboarding", label: "Discuss onboarding" },
  ],
} as const;

export const DEMO_PAGE_AUDIENCE = {
  sectionId: "demo-audience",
  overline: "Who should book a demo",
  headline: "Built for properties at every stage.",
  subhead:
    "Whether you run one hotel or a growing portfolio, we adapt the walkthrough to your operations.",
  cards: [
    {
      id: "independent",
      title: "Independent hotels",
      description:
        "Single-property owners evaluating a modern PMS with AI reception and guest channels in one workspace.",
    },
    {
      id: "groups",
      title: "Hotel groups",
      description:
        "Multi-property teams exploring consistent operations, shared knowledge, and centralized administration.",
    },
    {
      id: "growing",
      title: "Growing properties",
      description:
        "Hotels scaling guest volume who need unified conversations, clearer workflows, and room to expand.",
    },
  ] satisfies DemoAudienceCard[],
} as const;

export const DEMO_PAGE_FORM = {
  sectionId: "demo-booking",
  overline: "Book a demo",
  headline: "Schedule your walkthrough.",
  subhead:
    "Tell us about your hotel and preferred date. Our team will confirm your demo by email — no instant booking or availability calendar.",
  submitLabel: "Book a demo",
  successTitle: "Demo request received.",
  successMessage:
    "Thank you for your interest. Our team will reach out by email to confirm a time for your personalized walkthrough.",
  fields: {
    name: { id: "demo-name", label: "Name", required: true },
    hotel: { id: "demo-hotel", label: "Hotel", required: true },
    email: { id: "demo-email", label: "Email", required: true },
    country: { id: "demo-country", label: "Country", required: true },
    rooms: { id: "demo-rooms", label: "Number of rooms", required: false },
    date: { id: "demo-date", label: "Preferred date", required: false },
    message: { id: "demo-message", label: "Message", required: false },
  },
} as const;

export const DEMO_PAGE_FAQ = {
  sectionId: "demo-faq",
  overline: "FAQ",
  headline: "Before you book.",
  subhead: "Common questions about Monavel product demonstrations.",
  items: [
    {
      question: "How long is the demo?",
      answer:
        "Most demos run 30 to 45 minutes. We can adjust based on your questions and property complexity.",
    },
    {
      question: "Is it personalized?",
      answer:
        "Yes. We walk through workflows relevant to your hotel — operations, AI reception, revenue, and administration.",
    },
    {
      question: "Do I need to prepare anything?",
      answer:
        "No special preparation is required. Sharing your property size and current tools helps us tailor the session.",
    },
    {
      question: "Can my team join?",
      answer:
        "Yes. Front desk, reservations, management, and IT are welcome. Include team details in your message.",
    },
    {
      question: "Is there any obligation?",
      answer:
        "No. The demo is informational. You decide whether to start a trial or discuss next steps afterward.",
    },
    {
      question: "What happens after the demo?",
      answer:
        "We follow up by email with trial options, onboarding guidance, or Enterprise details if relevant to your property.",
    },
  ],
} as const;
