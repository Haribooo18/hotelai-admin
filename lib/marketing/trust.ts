import type { LucideIcon } from "lucide-react";
import { Bot, Building2, Rocket, Shield } from "lucide-react";

export type TrustCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type TrustMetric = {
  id: string;
  label: string;
};

export const TRUST_SECTION_CONTENT = {
  sectionId: "trust",
  overline: "Trust",
  headline: "Why trust Monavel?",
  subhead:
    "Monavel is built as a hotel operating platform — with AI woven into operations, security at the foundation, and onboarding designed for real teams.",
  securityLinkLabel: "Learn about our security",
  securityLinkHref: "/security",
} as const;

export const TRUST_CARDS: TrustCard[] = [
  {
    id: "modern-hotels",
    icon: Building2,
    title: "Built for modern hotels",
    description:
      "Designed around how hotels actually run — bookings, guests, rooms, calendar, and revenue in one workspace instead of scattered tools.",
  },
  {
    id: "ai-first",
    icon: Bot,
    title: "AI-first architecture",
    description:
      "AI is embedded across the platform — reception, knowledge, and recommendations share the same context. Not a bolt-on chatbot widget.",
  },
  {
    id: "secure",
    icon: Shield,
    title: "Secure by design",
    description:
      "Tenant isolation keeps each hotel's data separate. Role-based access controls who sees what. Infrastructure is built for secure cloud operations.",
  },
  {
    id: "onboarding",
    icon: Rocket,
    title: "Fast onboarding",
    description:
      "Connect channels, import knowledge, and start testing AI reception in days — not months of custom integration work.",
  },
];

export const TRUST_METRICS: TrustMetric[] = [
  { id: "ai-reception", label: "24/7 AI Reception" },
  { id: "workspace", label: "Unified Workspace" },
  { id: "platform", label: "One Platform" },
  { id: "cloud", label: "Cloud Native" },
];
