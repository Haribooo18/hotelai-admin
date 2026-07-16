import {
  DEFAULT_ADMIN_LOCALE,
  isAdminLocale,
  LOCALE_STORAGE_KEY,
  type AdminLocale,
} from "./locales";

export function readAdminLocale(): AdminLocale {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_LOCALE;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && isAdminLocale(stored) ? stored : DEFAULT_ADMIN_LOCALE;
}

export function persistAdminLocale(locale: AdminLocale): void {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
