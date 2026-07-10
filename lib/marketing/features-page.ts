import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  DoorOpen,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Radio,
  Users,
} from "lucide-react";

import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import { MARKETING_CTA } from "@/lib/marketing/routes";

export const FEATURES_PAGE_HERO = {
  overline: "Platform",
  headline: "Everything your hotel needs.",
  headlineAccent: "One connected platform.",
  subhead:
    "Monavel is a product overview — PMS, AI reception, guest channels, revenue tools, and knowledge in one workspace built for hotel operations.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export type FeaturesPlatformArea = {
  id: string;
  title: string;
  description: string;
};

export const FEATURES_PLATFORM_OVERVIEW = {
  sectionId: "features-platform-overview",
  overline: "Platform overview",
  headline: "Five connected layers.",
  subhead:
    "Each layer shares context with the others — so AI, staff, and guest channels work from the same source of truth.",
  areas: [
    {
      id: "pms",
      title: "PMS",
      description:
        "Bookings, guests, rooms, and calendar in one operating workspace — not a separate system to sync.",
    },
    {
      id: "ai-reception",
      title: "AI Reception",
      description:
        "Embedded AI that answers guests and surfaces recommendations using live hotel context.",
    },
    {
      id: "guest-channels",
      title: "Guest Channels",
      description:
        "Website Chat and Telegram connect to the same inbox and knowledge your team uses daily.",
    },
    {
      id: "revenue",
      title: "Revenue",
      description:
        "Rates, occupancy signals, and revenue views to support pricing decisions inside the platform.",
    },
    {
      id: "knowledge",
      title: "Knowledge",
      description:
        "Hotel policies, FAQs, and local information that power consistent AI and staff responses.",
    },
  ] satisfies FeaturesPlatformArea[],
} as const;

export type FeaturesWorkspace = {
  id: PlatformWorkspaceId;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FEATURES_WORKSPACE_GRID = {
  sectionId: "features-workspaces",
  overline: "Workspaces",
  headline: "Every workspace in Monavel.",
  subhead:
    "Eight focused views for daily hotel work — each connected to the same bookings, guests, and AI context.",
  workspaces: [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Operations overview with key metrics and AI recommendations.",
    },
    {
      id: "bookings",
      icon: CalendarCheck,
      title: "Bookings",
      description: "Reservation list, status filters, and booking detail workflows.",
    },
    {
      id: "guests",
      icon: Users,
      title: "Guests",
      description: "Guest profiles, stay history, and communication context.",
    },
    {
      id: "rooms",
      icon: DoorOpen,
      title: "Rooms",
      description: "Room inventory, status, and maintenance visibility.",
    },
    {
      id: "calendar",
      icon: CalendarDays,
      title: "Calendar",
      description: "Timeline view of occupancy and arrivals across rooms.",
    },
    {
      id: "revenue",
      icon: LineChart,
      title: "Revenue",
      description: "Rate and revenue analytics to support pricing decisions.",
    },
    {
      id: "knowledge",
      icon: BookOpen,
      title: "Knowledge",
      description: "Articles and policies that feed AI reception and staff answers.",
    },
    {
      id: "reception-ai",
      icon: Bot,
      title: "Reception AI",
      description: "Guest conversation inbox across connected channels.",
    },
  ] satisfies FeaturesWorkspace[],
} as const;

export type FeaturesIntegration = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "available" | "planned";
};

export const FEATURES_AI_INTEGRATIONS = {
  sectionId: "features-ai-integrations",
  overline: "AI integrations",
  headline: "Channels that connect to one inbox.",
  subhead:
    "Guest messages flow into Reception AI with shared knowledge — so responses stay consistent across channels.",
  integrations: [
    {
      id: "website-chat",
      icon: MessageSquare,
      title: "Website Chat",
      description:
        "Embed chat on your hotel site. Guest messages route to the Monavel reception inbox.",
      status: "available",
    },
    {
      id: "telegram",
      icon: Radio,
      title: "Telegram",
      description:
        "Connect a Telegram bot for guest messaging with the same AI and knowledge context.",
      status: "available",
    },
    {
      id: "knowledge-base",
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Hotel articles and policies inform AI replies and help staff answer faster.",
      status: "available",
    },
    {
      id: "future",
      icon: Bot,
      title: "Future integrations",
      description:
        "Additional guest channels are planned. New integrations will use the same workspace model.",
      status: "planned",
    },
  ] satisfies FeaturesIntegration[],
} as const;

export const FEATURES_OPERATIONS_WORKFLOW = {
  sectionId: "features-operations-workflow",
  overline: "Operations workflow",
  headline: "From guest message to team action.",
  subhead:
    "A simple loop — guests reach AI, AI uses workspace context, your team steps in when needed.",
  steps: [
    { id: "guest", label: "Guest" },
    { id: "ai", label: "AI" },
    { id: "workspace", label: "Workspace" },
    { id: "team", label: "Team" },
    { id: "guest-return", label: "Guest" },
  ],
} as const;

export type FeaturesBenefit = {
  id: string;
  title: string;
  description: string;
};

export const FEATURES_BENEFITS = {
  sectionId: "features-benefits",
  overline: "Benefits",
  headline: "What a connected platform changes.",
  subhead:
    "Monavel is built to reduce operational friction — not to replace your team, but to give them better context.",
  items: [
    {
      id: "less-manual",
      title: "Less manual work",
      description:
        "Routine guest questions and lookups happen in AI reception instead of repetitive front-desk tasks.",
    },
    {
      id: "faster-responses",
      title: "Faster responses",
      description:
        "Knowledge and booking context are available instantly — for AI and staff in the same workspace.",
    },
    {
      id: "higher-occupancy",
      title: "Higher occupancy",
      description:
        "Calendar and revenue views help teams spot demand patterns and act on pricing opportunities.",
    },
    {
      id: "one-platform",
      title: "One platform",
      description:
        "No switching between a PMS, chat widget, and spreadsheets — operations live in one system.",
    },
  ] satisfies FeaturesBenefit[],
} as const;
