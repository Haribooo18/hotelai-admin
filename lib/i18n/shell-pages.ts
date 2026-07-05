import type { AdminTranslations } from "./translations";

export const SIDEBAR_WIDTH_PX = 252;

export type PageTitleKey = keyof AdminTranslations["pages"];

const PAGE_TITLE_KEYS: Record<string, PageTitleKey> = {
  "/dashboard": "dashboard",
  "/bookings": "reservations",
  "/guests": "guests",
  "/rooms": "rooms",
  "/calendar": "calendar",
  "/rates": "revenue",
  "/knowledge": "reports",
  "/ai": "messages",
  "/settings": "settings",
};

export function resolvePageTitleKey(pathname: string): PageTitleKey {
  const match = Object.entries(PAGE_TITLE_KEYS).find(([href]) =>
    pathname === href || pathname.startsWith(`${href}/`)
  );

  return match?.[1] ?? "dashboard";
}
