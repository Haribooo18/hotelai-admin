import { MKT_CTA } from "@/lib/marketing/product-language";
import { MARKETING_CTA } from "@/lib/marketing/routes";

export type FinalCtaVariant =
  | "default"
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
  trustItems?: readonly string[];
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
    headline: "Your hotel already has software.",
    headlineAccent: "Now give it one Runtime.",
    body: [
      "Launch in days.",
      "Works with your existing PMS.",
      "Guided onboarding from day one.",
    ],
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.bookDemo,
    secondaryCtaHref: MARKETING_CTA.demo,
  },
  demo: {
    headline: "See Monavel with your workflows",
    subhead:
      "Book a personalized walkthrough — we show operations, AI reception, and administration for your property.",
    primaryCtaLabel: MKT_CTA.bookDemo,
    primaryCtaHref: "#demo-booking",
    secondaryCtaLabel: MKT_CTA.startFreeTrial,
    secondaryCtaHref: MARKETING_CTA.trial,
    trustItems: ["30–45 minute session", "Personalized walkthrough", "No obligation"],
  },
  contact: {
    headline: "Talk to the Monavel team",
    subhead:
      "Questions about plans, Enterprise, or partnerships — we will point you to the right next step.",
    primaryCtaLabel: MKT_CTA.contactSales,
    primaryCtaHref: "#contact-form",
    secondaryCtaLabel: MKT_CTA.bookDemo,
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Sales & partnerships", "International hotels", "Response by email"],
  },
  security: {
    headline: "Questions about platform security?",
    subhead:
      "Talk to our team about tenant isolation, access control, and how Monavel protects hotel data.",
    primaryCtaLabel: MKT_CTA.contactSales,
    primaryCtaHref: "/contact",
    secondaryCtaLabel: MKT_CTA.startFreeTrial,
    secondaryCtaHref: MARKETING_CTA.trial,
    trustItems: ["Tenant isolation", "Role-based access", "Secure infrastructure"],
  },
  docs: {
    headline: "Build on Monavel",
    subhead:
      "Set up your hotel, connect a channel, and publish knowledge — then evaluate AI reception in your trial.",
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.exploreDocs,
    secondaryCtaHref: "/docs/getting-started",
    trustItems: ["Setup guides", "Channel docs", "Billing help"],
  },
  features: {
    headline: "Explore the full platform",
    subhead:
      "Every workspace shares context — start a trial and connect your first guest channel.",
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.bookDemo,
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: DEFAULT_TRUST_ITEMS,
  },
  ai: {
    headline: "Your next guest should never have to wait.",
    body: [
      "Protect every conversation.",
      "Protect every booking.",
      "Protect your reputation.",
    ],
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.bookDemo,
    secondaryCtaHref: MARKETING_CTA.demo,
  },
  integrations: {
    headline: "Connect your guest channels",
    subhead:
      "Website Chat and Telegram are available now — start a trial and route messages into one inbox.",
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.bookDemo,
    secondaryCtaHref: MARKETING_CTA.demo,
    trustItems: ["Website Chat", "Telegram", "Knowledge Base"],
  },
  about: {
    headline: "Build on one hotel workspace",
    subhead:
      "Monavel is designed for operators — start a trial or book a demo to see how it fits your property.",
    primaryCtaLabel: MKT_CTA.startFreeTrial,
    primaryCtaHref: MARKETING_CTA.trial,
    secondaryCtaLabel: MKT_CTA.bookDemo,
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
