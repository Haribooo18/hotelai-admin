import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  CalendarDays,
  FileBarChart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import type { TranslationPath } from "@/lib/i18n/translations";

type ShellNavItem = {
  labelKey: TranslationPath;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const SHELL_NAV_ITEMS: ShellNavItem[] = [
  { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { labelKey: "nav.reservations", href: "/bookings", icon: CalendarDays },
  { labelKey: "nav.guests", href: "/guests", icon: Users },
  { labelKey: "nav.rooms", href: "/rooms", icon: BedDouble },
  { labelKey: "nav.calendar", href: "/calendar", icon: Sparkles },
  { labelKey: "nav.revenue", href: "/rates", icon: TrendingUp },
  { labelKey: "nav.reports", href: "/knowledge", icon: FileBarChart },
  { labelKey: "nav.messages", href: "/ai", icon: MessageSquare },
  { labelKey: "nav.settings", href: "/settings", icon: Settings },
];

export function isShellNavActive(
  pathname: string,
  item: ShellNavItem,
  items: ShellNavItem[] = SHELL_NAV_ITEMS
): boolean {
  const pathMatches = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  if (!pathMatches) {
    return false;
  }

  const firstMatch = items.find((candidate) => {
    if (candidate.exact) {
      return pathname === candidate.href;
    }

    return (
      pathname === candidate.href ||
      pathname.startsWith(`${candidate.href}/`)
    );
  });

  return firstMatch?.labelKey === item.labelKey;
}
