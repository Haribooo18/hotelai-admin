import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Building2,
  CalendarDays,
  Check,
  Database,
  Gauge,
  Hotel,
  BedDouble,
  MessageSquareText,
  Minimize2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type AboutPrinciple = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const ABOUT_PAGE_HERO = {
  overline: "About Monavel",
  headline: "Building the operating system for modern hotels.",
  subhead:
    "One connected platform for property operations, guest communication, hotel knowledge, and AI.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const ABOUT_PAGE_MISSION = {
  sectionId: "why-monavel",
  overline: "Why Monavel exists",
  headline: "Hotels should not need ten systems to run one property.",
  paragraphs: [
    "Modern hotels rely on a growing collection of disconnected software. Reservations live in one place, guest communication in another, operational knowledge somewhere else, and daily work moves between documents, chats, and manual processes.",
    "Every system knows only part of the story. Teams lose time switching between tools, reconciling information, and repeating work instead of focusing on guests.",
  ],
  conclusion:
    "Monavel brings operations, knowledge, and AI into one shared workspace, so every team and every workflow can work from the same context.",
  systems: [
    { id: "pms", label: "Property management", icon: Hotel },
    { id: "messaging", label: "Guest messaging", icon: MessageSquareText },
    { id: "knowledge", label: "Hotel knowledge", icon: Database },
    { id: "housekeeping", label: "Housekeeping", icon: BedDouble },
    { id: "calendar", label: "Calendar & operations", icon: CalendarDays },
  ],
  outcomes: [
    {
      id: "context",
      title: "Shared context",
      description: "Every team works from the same operational information.",
    },
    {
      id: "ai",
      title: "One AI",
      description: "AI understands the hotel, not just one isolated application.",
    },
    {
      id: "workspace",
      title: "One workspace",
      description: "Daily work stays connected instead of moving between tabs.",
    },
  ],
} as const;

export const ABOUT_PAGE_VISION = {
  sectionId: "one-workspace",
  overline: "The product vision",
  headline: "One hotel. One workspace. One source of truth.",
  subhead:
    "Monavel is designed as a connected operating layer, not a collection of loosely integrated features.",
  pillars: [
    {
      id: "workspace",
      number: "01",
      title: "One workspace",
      description:
        "Reservations, rooms, guest conversations, tasks, and hotel knowledge stay connected in one product.",
    },
    {
      id: "ai",
      number: "02",
      title: "One AI",
      description:
        "Guest-facing and staff-facing AI use the same approved hotel context, keeping answers and actions consistent.",
    },
    {
      id: "truth",
      number: "03",
      title: "One source of truth",
      description:
        "When operations and communication share data, teams stop resolving conflicts between separate systems.",
    },
  ],
} as const;

export const ABOUT_PAGE_PRINCIPLES = {
  sectionId: "about-principles",
  overline: "Core principles",
  headline: "How we make product decisions.",
  subhead:
    "Four principles guide what we build, what we simplify, and what we deliberately leave out.",
  items: [
    {
      id: "ai-first",
      icon: Bot,
      title: "AI-native, not AI-added",
      description:
        "AI is built into the product architecture so reception, knowledge, and operations can share context from the start.",
    },
    {
      id: "simple-by-default",
      icon: Minimize2,
      title: "Simple by default",
      description:
        "Complex hotel operations deserve clear interfaces and predictable workflows, not feature sprawl.",
    },
    {
      id: "built-for-operators",
      icon: Users,
      title: "Built around real work",
      description:
        "We design for front desk, reservations, housekeeping, and management—the teams operating a hotel every day.",
    },
    {
      id: "continuous-improvement",
      icon: RefreshCw,
      title: "Improve continuously",
      description:
        "We ship in focused increments and refine the product using real workflows, feedback, and measurable outcomes.",
    },
  ] satisfies AboutPrinciple[],
} as const;

export const ABOUT_PAGE_PHILOSOPHY = {
  sectionId: "connected-platform",
  overline: "A connected platform",
  headline: "Replace fragmented workflows, not people.",
  subhead:
    "Monavel connects the operational layers that hotels already depend on and gives teams one place to manage the work.",
  inputs: [
    { id: "property", label: "Property operations", icon: Building2 },
    { id: "guests", label: "Guest communication", icon: MessageSquareText },
    { id: "knowledge", label: "Hotel knowledge", icon: Database },
    { id: "automation", label: "Automation", icon: Sparkles },
  ],
  outputs: [
    { id: "staff", label: "Staff", icon: Users },
    { id: "guests", label: "Guests", icon: Hotel },
    { id: "decisions", label: "Decisions", icon: Gauge },
  ],
  statement: "Everything works from the same hotel context.",
} as const;

export const ABOUT_PAGE_ROADMAP = {
  sectionId: "about-roadmap",
  overline: "Product direction",
  headline: "A deliberate path toward hotel intelligence.",
  subhead:
    "This is our product direction rather than a promise of dates. Each stage deepens the same connected platform.",
  steps: [
    {
      id: "connected-operations",
      label: "Now",
      title: "Connected operations",
      description:
        "Bring core property workflows, guest channels, AI reception, and hotel knowledge into one workspace.",
      status: "current",
    },
    {
      id: "ai-pms",
      label: "Next",
      title: "AI-first PMS",
      description:
        "Deepen AI across daily operations so it can assist teams inside the workflow rather than beside it.",
      status: "planned",
    },
    {
      id: "automation",
      label: "Then",
      title: "Operational automation",
      description:
        "Reduce repetitive coordination and manual follow-up while keeping hotel teams in control.",
      status: "planned",
    },
    {
      id: "intelligence",
      label: "Future",
      title: "Hotel intelligence",
      description:
        "Turn connected operational data into clearer signals, better decisions, and more adaptive guest experiences.",
      status: "planned",
    },
  ],
  closing: {
    icon: Check,
    title: "The direction stays consistent",
    description:
      "Fewer disconnected tools. Better shared context. More time for the guest experience.",
  },
} as const;
