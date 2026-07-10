import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Globe,
  Layers3,
  Mail,
  MessageSquare,
  Radio,
  Share2,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type IntegrationStatus = "available" | "planned";

export type IntegrationItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  status: IntegrationStatus;
};

export const INTEGRATIONS_PAGE_HERO = {
  overline: "Integrations",
  headline: "Connect every guest conversation.",
  subhead:
    "Monavel connects guest channels into one unified workspace — so messages, knowledge, and hotel operations stay in sync.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const INTEGRATIONS_PAGE_AVAILABLE = {
  sectionId: "integrations-available",
  overline: "Available integrations",
  headline: "Connect guests today.",
  subhead:
    "These integrations are available now and route into the same Monavel Reception AI inbox and knowledge context.",
  items: [
    {
      id: "website-chat",
      icon: MessageSquare,
      title: "Website Chat",
      description:
        "Embed chat on your hotel website. Guest messages flow into Monavel Reception AI.",
      status: "available",
    },
    {
      id: "telegram",
      icon: Radio,
      title: "Telegram",
      description:
        "Connect a Telegram bot for guest messaging with shared AI and knowledge context.",
      status: "available",
    },
    {
      id: "knowledge-base",
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Hotel articles and policies power consistent AI replies across connected channels.",
      status: "available",
    },
  ] satisfies IntegrationItem[],
} as const;

export const INTEGRATIONS_PAGE_GUEST_COMMUNICATION = {
  sectionId: "integrations-guest-communication",
  overline: "Guest communication",
  headline: "One path from guest to team.",
  subhead:
    "Guest messages from connected channels route through Monavel AI into your workspace — where your team can step in when needed.",
  steps: [
    { id: "guest", label: "Guest" },
    { id: "channels", label: "Website Chat / Telegram" },
    { id: "ai", label: "Monavel AI" },
    { id: "workspace", label: "Workspace" },
    { id: "team", label: "Hotel Team" },
  ],
} as const;

export const INTEGRATIONS_PAGE_FUTURE = {
  sectionId: "integrations-future",
  overline: "Future integrations",
  headline: "More channels on the roadmap.",
  subhead:
    "These integrations are planned and not available yet. They will connect to the same workspace model when released.",
  items: [
    {
      id: "whatsapp",
      icon: MessageSquare,
      title: "WhatsApp",
      description:
        "Planned guest messaging channel connected to the Monavel reception inbox.",
      status: "planned",
    },
    {
      id: "email",
      icon: Mail,
      title: "Email",
      description:
        "Planned email channel for guest inquiries routed into the workspace.",
      status: "planned",
    },
    {
      id: "booking-com",
      icon: Globe,
      title: "Booking.com",
      description:
        "Planned connectivity for guest communication workflows — not available today.",
      status: "planned",
    },
    {
      id: "airbnb",
      icon: Building2,
      title: "Airbnb",
      description:
        "Planned channel integration for short-stay guest messaging workflows.",
      status: "planned",
    },
    {
      id: "channel-manager",
      icon: Share2,
      title: "Channel Manager",
      description:
        "Planned integrations with channel management systems for operational context.",
      status: "planned",
    },
    {
      id: "pms",
      icon: Layers3,
      title: "PMS integrations",
      description:
        "Planned connections with external PMS platforms where hotels need hybrid workflows.",
      status: "planned",
    },
  ] satisfies IntegrationItem[],
} as const;

export const INTEGRATIONS_PAGE_ARCHITECTURE = {
  sectionId: "integrations-architecture",
  overline: "Integration architecture",
  headline: "How channels connect.",
  subhead:
    "A conceptual view of how guest channels, AI, knowledge, and staff work together inside Monavel.",
  steps: [
    { id: "channels", label: "Guest Channels" },
    { id: "ai", label: "Monavel AI" },
    { id: "knowledge", label: "Knowledge" },
    { id: "workspace", label: "Workspace" },
    { id: "staff", label: "Staff" },
  ],
} as const;

export const INTEGRATIONS_PAGE_BENEFITS = {
  sectionId: "integrations-benefits",
  overline: "Benefits",
  headline: "Why connect channels in one platform.",
  subhead:
    "Integrations are designed to reduce tool switching — not to promise channels that are not live yet.",
  items: [
    {
      id: "unified",
      title: "Unified conversations",
      description:
        "Guest messages from connected channels appear in one reception workspace.",
    },
    {
      id: "less-switching",
      title: "Less switching between tools",
      description:
        "Teams respond from Monavel instead of monitoring separate inboxes and widgets.",
    },
    {
      id: "shared-knowledge",
      title: "Shared knowledge",
      description:
        "Knowledge base content informs AI and staff replies across connected channels.",
    },
    {
      id: "scalable",
      title: "Scalable architecture",
      description:
        "New channels can be added to the same model as the platform expands.",
    },
  ],
} as const;

export const INTEGRATION_STATUS_LABELS = {
  available: "Available",
  planned: "Planned",
} as const satisfies Record<IntegrationStatus, string>;
