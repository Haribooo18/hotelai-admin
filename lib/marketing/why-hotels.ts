import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Database,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export type WhyHotelsCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const WHY_HOTELS_CONTENT = {
  sectionId: "why-hotels-choose",
  overline: "Why hotels choose Monavel",
  headline: "Why hotels choose Monavel.",
  subhead:
    "Independent hotels and growing properties switch to Monavel to replace fragmented tools with one operating system.",
} as const;

export const WHY_HOTELS_CARDS: WhyHotelsCard[] = [
  {
    id: "save-time",
    icon: Clock,
    title: "Save staff time",
    description:
      "AI handles routine guest questions and operational tasks so your team focuses on high-value service.",
  },
  {
    id: "guest-experience",
    icon: Sparkles,
    title: "Better guest experience",
    description:
      "Guests get instant, accurate answers across every channel — with context from your live hotel data.",
  },
  {
    id: "revenue",
    icon: TrendingUp,
    title: "Increase revenue",
    description:
      "Revenue intelligence surfaces pricing opportunities based on occupancy, demand, and booking patterns.",
  },
  {
    id: "source-of-truth",
    icon: Database,
    title: "One source of truth",
    description:
      "Bookings, rooms, guests, and knowledge stay synchronized — no more conflicting data across systems.",
  },
  {
    id: "security",
    icon: Shield,
    title: "Enterprise security",
    description:
      "Tenant isolation, role-based access, and secure cloud infrastructure built for hotel operations.",
  },
  {
    id: "onboarding",
    icon: Rocket,
    title: "Fast onboarding",
    description:
      "Connect your channels, import hotel data, and go live in days — not months of system integration.",
  },
];
