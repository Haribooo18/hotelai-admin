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
  { label: "Панель", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Бронирования", href: "/bookings", icon: CalendarDays },
  { label: "Гости", href: "/guests", icon: Users },
  { label: "Номера", href: "/rooms", icon: BedDouble },
  { label: "Календарь", href: "/calendar", icon: Sparkles },
  { label: "Доход", href: "/bookings", icon: TrendingUp },
  { label: "Отчёты", href: "/knowledge", icon: FileBarChart },
  { label: "Сообщения", href: "/ai", icon: MessageSquare },
  { label: "Настройки", href: "/settings", icon: Settings },
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
  "/dashboard": "Панель",
  "/bookings": "Бронирования",
  "/guests": "Гости",
  "/rooms": "Номера",
  "/calendar": "Календарь",
  "/rates": "Цены",
  "/knowledge": "База знаний",
  "/ai": "Сообщения",
  "/settings": "Настройки",
};

export function resolveShellPageTitle(pathname: string): string {
  const match = Object.entries(PAGE_TITLES).find(([href]) =>
    pathname === href || pathname.startsWith(`${href}/`)
  );

  return match?.[1] ?? "Панель";
}
