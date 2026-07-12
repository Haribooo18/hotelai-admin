import type { LucideIcon } from "lucide-react";
import { Bot, Layers3, TrendingUp } from "lucide-react";

export type PlatformPillar = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: readonly string[];
  href: string;
  ctaLabel: string;
};

export const PLATFORM_PILLARS_CONTENT = {
  sectionId: "platform-pillars",
  overline: "Five connected layers",
  headline: "One platform. Five layers.",
  subhead:
    "Operations, guest communication, knowledge, revenue, and automation — connected in a single operating environment.",
} as const;

export const PLATFORM_PILLARS: PlatformPillar[] = [
  {
    id: "operations",
    icon: Layers3,
    title: "Run Operations",
    description: "One connected operating system.",
    features: ["Calendar", "Bookings", "Guests", "Rooms"],
    href: "/#product",
    ctaLabel: "Learn more",
  },
  {
    id: "ai-reception",
    icon: Bot,
    title: "AI Reception",
    description: "24/7 guest communication powered by AI.",
    features: ["Website Chat", "Telegram", "Knowledge"],
    href: "/ai",
    ctaLabel: "Learn more",
  },
  {
    id: "revenue",
    icon: TrendingUp,
    title: "Grow Revenue",
    description: "Pricing optimization and revenue intelligence.",
    features: ["Revenue", "Analytics", "Recommendations", "Pricing optimization"],
    href: "/pricing",
    ctaLabel: "Learn more",
  },
];
