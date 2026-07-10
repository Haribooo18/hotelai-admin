import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Minimize2,
  RefreshCw,
  Users,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type AboutPrinciple = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type AboutPhilosophyItem = {
  id: string;
  title: string;
  description: string;
};

export const ABOUT_PAGE_HERO = {
  overline: "About",
  headline: "Building the future operating system for hotels.",
  subhead:
    "Simplifying hotel operations — PMS, AI reception, guest communication, and workflows in one platform.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const ABOUT_PAGE_MISSION = {
  sectionId: "about-mission",
  overline: "Mission",
  headline: "Less complexity for hotel teams.",
  body:
    "Hotels run on too many disconnected tools. Monavel reduces that burden so staff focus on guests.",
} as const;

export const ABOUT_PAGE_VISION = {
  sectionId: "about-vision",
  overline: "Vision",
  headline: "One intelligent workspace for every hotel.",
  body:
    "Hotels should operate from one workspace — operations, AI, guest channels, and knowledge sharing context.",
} as const;

export const ABOUT_PAGE_PRINCIPLES = {
  sectionId: "about-principles",
  overline: "Core principles",
  headline: "How we build Monavel.",
  subhead:
    "These principles guide product decisions — from daily workflows to how AI fits into hotel operations.",
  items: [
    {
      id: "ai-first",
      icon: Bot,
      title: "AI-first",
      description:
        "AI is embedded in the product — not bolted on. Reception, knowledge, and operations share context from the start.",
    },
    {
      id: "simple-by-default",
      icon: Minimize2,
      title: "Simple by default",
      description:
        "Complex hotel operations deserve clear interfaces. We prioritize straightforward workflows over feature sprawl.",
    },
    {
      id: "built-for-operators",
      icon: Users,
      title: "Built for operators",
      description:
        "Monavel is designed for front desk, reservations, and management — the people who run hotels every day.",
    },
    {
      id: "continuous-improvement",
      icon: RefreshCw,
      title: "Continuous improvement",
      description:
        "We ship iteratively and refine based on real hotel workflows — not hypothetical feature lists.",
    },
  ] satisfies AboutPrinciple[],
} as const;

export const ABOUT_PAGE_PHILOSOPHY = {
  sectionId: "about-philosophy",
  overline: "Why Monavel",
  headline: "Product philosophy, not marketing hype.",
  subhead:
    "Monavel is built around a simple idea: hotel teams need one place to work — with AI and data that stay in sync.",
  items: [
    {
      id: "workspace",
      title: "One workspace",
      description:
        "Bookings, guests, rooms, calendar, AI reception, and knowledge live together — not across separate products.",
    },
    {
      id: "ai",
      title: "One AI",
      description:
        "Guest-facing AI and staff tools draw from the same hotel context — so answers stay consistent across channels.",
    },
    {
      id: "truth",
      title: "One source of truth",
      description:
        "When operations and guest communication share data, teams stop reconciling conflicting information between tools.",
    },
  ] satisfies AboutPhilosophyItem[],
} as const;

export const ABOUT_PAGE_ROADMAP = {
  sectionId: "about-roadmap",
  overline: "Roadmap",
  headline: "Where we are headed.",
  subhead:
    "A directional view of Monavel's product path — no dates, no guarantees on timing, and no features presented as already available.",
  steps: [
    {
      id: "today",
      label: "Today",
      description: "PMS, AI reception, guest channels, and knowledge in one workspace.",
    },
    {
      id: "ai-pms",
      label: "AI-first PMS",
      description: "Deepening AI across operations — not a separate layer on legacy tools.",
    },
    {
      id: "automation",
      label: "Automation",
      description: "Reducing repetitive tasks so staff focus on guest experience.",
    },
    {
      id: "intelligence",
      label: "Hotel intelligence",
      description: "Better signals from operations data to support decisions.",
    },
    {
      id: "future",
      label: "Future platform",
      description: "Expanding the connected workspace as hotels and channels evolve.",
    },
  ],
} as const;
