import { MARKETING_CTA } from "@/lib/marketing/routes";

export const FINAL_CTA_CONTENT = {
  sectionId: "final-cta",
  headline: "Ready to modernize your hotel?",
  subhead:
    "Monavel combines PMS, AI reception, guest communication, and daily operations in one platform — so your team runs the hotel from a single workspace.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const FINAL_CTA_TRUST_ITEMS = [
  "No self-hosting",
  "AI Reception",
  "Telegram & Website Chat",
  "Secure cloud platform",
] as const;
