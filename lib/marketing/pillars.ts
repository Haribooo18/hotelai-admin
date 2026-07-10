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
  overline: "Platform pillars",
  headline: "One platform. Three pillars.",
  subhead:
    "Monavel connects hotel operations, guest communication, and revenue growth in a single system.",
} as const;

export const PLATFORM_PILLARS: PlatformPillar[] = [
  {
    id: "operations",
    icon: Layers3,
    title: "Run Operations",
    description: "One connected operating system.",
    features: ["Calendar", "Bookings", "Guests", "Rooms"],
    href: "/features",
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
