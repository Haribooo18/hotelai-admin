import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarClock,
  LineChart,
  MessageSquare,
} from "lucide-react";

export type AIExperienceCapability = {
  id: string;
  icon: LucideIcon;
  title: string;
  features: readonly string[];
};

export const AI_EXPERIENCE_CONTENT = {
  sectionId: "ai-experience",
  overline: "AI Experience",
  headline: "AI that works before your team asks.",
  subhead:
    "Monavel doesn't just answer guests — it understands context across knowledge, bookings, rooms, and revenue to recommend the next best action for your hotel.",
  previewProductUrl: "app.monavel.com/ai",
  preview: {
    recommendation:
      "Raise weekend rates for Standard rooms by 8%",
    why: "Occupancy is 12% above forecast with eight waitlisted requests for Friday and Saturday arrivals.",
    impact: "+$1,240 projected weekly revenue",
    confidence: "High confidence (87%)",
    label: "AI recommendation preview",
  },
} as const;

export const AI_EXPERIENCE_CAPABILITIES: AIExperienceCapability[] = [
  {
    id: "guest-communication",
    icon: MessageSquare,
    title: "Guest Communication",
    features: ["Website Chat", "Telegram", "Instant replies"],
  },
  {
    id: "knowledge",
    icon: BookOpen,
    title: "Knowledge",
    features: ["Policies", "Hotel information", "Citations"],
  },
  {
    id: "operations",
    icon: CalendarClock,
    title: "Operations",
    features: ["Arrivals", "Housekeeping", "Maintenance"],
  },
  {
    id: "revenue-intelligence",
    icon: LineChart,
    title: "Revenue Intelligence",
    features: ["Demand", "Pricing", "Recommendations"],
  },
];
