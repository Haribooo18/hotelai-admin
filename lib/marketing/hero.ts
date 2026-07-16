import { MKT_CTA } from "@/lib/marketing/product-language";

export const HERO_CONTENT = {
  overline: "AI Operating System for Hotels",
  headline: "Everything your hotel needs.",
  headlineAccent: "One operating system.",
  supportingCopy:
    "Run reservations, guest communication, hotel operations, and AI reception from one connected workspace.",
  benefits: ["AI Reception", "Unified Workspace", "Launch in Days"] as const,
  primaryCta: MKT_CTA.startFreeTrial,
  secondaryCta: MKT_CTA.bookDemo,
  screenReaderSummary:
    "Monavel ecosystem: guest channels connect through Monavel to AI Reception, PMS, revenue, knowledge, rooms, automation, analytics, and staff.",
  skipLinkLabel: "Skip to why hotels need Monavel",
  skipLinkTarget: "why-hotels-need",
} as const;
