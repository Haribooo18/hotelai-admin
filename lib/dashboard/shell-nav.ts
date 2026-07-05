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

export type ShellNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** When true, only exact pathname match counts as active. */
  exact?: boolean;
};

/** Maps premium shell labels to existing routes (no new routes). */
export const SHELL_NAV_ITEMS: ShellNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Reservations", href: "/bookings", icon: CalendarDays },
  { label: "Guests", href: "/guests", icon: Users },
  { label: "Rooms", href: "/rooms", icon: BedDouble },
  { label: "Calendar", href: "/calendar", icon: Sparkles },
  { label: "Revenue", href: "/rates", icon: TrendingUp },
  { label: "Reports", href: "/knowledge", icon: FileBarChart },
  { label: "Messages", href: "/ai", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
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

  return firstMatch?.label === item.label;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/bookings": "Reservations",
  "/guests": "Guests",
  "/rooms": "Rooms",
  "/calendar": "Calendar",
  "/rates": "Revenue",
  "/knowledge": "Knowledge Base",
  "/ai": "Messages",
  "/settings": "Settings",
};

export function resolveShellPageTitle(pathname: string): string {
  const match = Object.entries(PAGE_TITLES).find(([href]) =>
    pathname === href || pathname.startsWith(`${href}/`)
  );

  return match?.[1] ?? "Dashboard";
}
