import { MARKETING_CTA } from "@/lib/marketing/routes";

export type FinalCtaVariant =
  | "default"
  | "pricing"
  | "demo"
  | "contact"
  | "security"
  | "docs"
  | "features"
  | "ai"
  | "integrations"
  | "about";

export type FinalCtaContent = {
  overline?: string;
  headline: string;
  headlineAccent?: string;
  body?: readonly string[];
  statement?: readonly string[];
  lead?: string;
  subhead?: string;
  supporting?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  trustItems: readonly string[];
};

export const FINAL_CTA_SECTION_ID = "final-cta";

const DEFAULT_TRUST_ITEMS = [
  "AI Reception",
  "One Workspace",
  "Guest Communication",
  "Secure cloud platform",
] as const;

export const FINAL_CTA_VARIANTS: Record<FinalCtaVariant, FinalCtaContent> = {
  default: {
    overline: "Why now",
    statement: [
      "Other software solves individual problems.",
      "Monavel connects your entire hotel into one intelligent operating system.",
    ],
    headline: "Hotels already have the tools",
    headlineAccent: "They need one operating system",
    body: [
      "Hotels already pay for PMS, channel managers, messaging platforms and revenue software.",
      "The problem is that these systems never work together.",
      "Monavel connects them into one intelligent operating system that every department shares.",
    ],
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: DEFAULT_TRUST_ITEMS,
  },
  pricing: {
    headline: "Choose a plan and start today",
    subhead:
      "Try Starter or Pro free, then upgrade when your hotel is ready to scale.",
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Starter & Pro trials", "Upgrade anytime", "Enterprise available"],
  },
  demo: {
    headline: "See Monavel with your workflows",
    subhead:
      "Book a personalized walkthrough — we show operations, AI reception, and administration for your property.",
    primaryCtaLabel: "Book your demo",
    primaryCtaHref: "#demo-booking",
    secondaryCtaLabel: "Start free trial",
    secondaryCtaHref: MARKETING_CTA.trial,
    trustItems: ["30–45 minute session", "Personalized walkthrough", "No obligation"],
  },
  contact: {
    headline: "Talk to the Monavel team",
    subhead:
      "Questions about plans, Enterprise, or partnerships — we will point you to the right next step.",
    primaryCtaLabel: "Contact sales",
    primaryCtaHref: "#contact-form",
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Sales & partnerships", "International hotels", "Response by email"],
  },
  security: {
    headline: "Questions about platform security?",
    subhead:
      "Talk to our team about tenant isolation, access control, and how Monavel protects hotel data.",
    primaryCtaLabel: "Talk to our team",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Start free trial",
    secondaryCtaHref: MARKETING_CTA.trial,
    trustItems: ["Tenant isolation", "Role-based access", "Secure infrastructure"],
  },
  docs: {
    headline: "Start building on Monavel",
    subhead:
      "Set up your hotel, connect a channel, and publish knowledge — then evaluate AI reception in your trial.",
    primaryCtaLabel: "Start building",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "View getting started",
    secondaryCtaHref: "/docs/getting-started",
    trustItems: ["Setup guides", "Channel docs", "Billing help"],
  },
  features: {
    headline: "Explore the full platform",
    subhead:
      "Every workspace shares context — start a trial and connect your first guest channel.",
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: DEFAULT_TRUST_ITEMS,
  },
  ai: {
    headline: "Put AI reception to work",
    subhead:
      "Connect Website Chat or Telegram and let Monavel AI answer guests with your hotel knowledge.",
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Knowledge-backed replies", "Human escalation", "Shared inbox"],
  },
  integrations: {
    headline: "Connect your guest channels",
    subhead:
      "Website Chat and Telegram are available now — start a trial and route messages into one inbox.",
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Website Chat", "Telegram", "Knowledge Base"],
  },
  about: {
    headline: "Build on one hotel workspace",
    subhead:
      "Monavel is designed for operators — start a trial or book a demo to see how it fits your property.",
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: "Book a demo",
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: DEFAULT_TRUST_ITEMS,
  },
};

export function getFinalCtaContent(variant: FinalCtaVariant = "default"): FinalCtaContent {
  return FINAL_CTA_VARIANTS[variant];
}

/** @deprecated Use getFinalCtaContent("default") */
export const FINAL_CTA_CONTENT = {
  sectionId: FINAL_CTA_SECTION_ID,
  ...FINAL_CTA_VARIANTS.default,
} as const;

/** @deprecated Use variant trustItems */
export const FINAL_CTA_TRUST_ITEMS = DEFAULT_TRUST_ITEMS;
