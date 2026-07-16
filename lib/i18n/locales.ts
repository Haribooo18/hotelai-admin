export const ADMIN_LOCALES = ["en", "uk", "ru", "pl", "de"] as const;

export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const DEFAULT_ADMIN_LOCALE: AdminLocale = "en";

export const LOCALE_STORAGE_KEY = "monavel-admin-locale";

export const LOCALE_LABELS: Record<AdminLocale, string> = {
  en: "English",
  uk: "Ukrainian",
  ru: "Russian",
  pl: "Polish",
  de: "German",
};

export function isAdminLocale(value: string): value is AdminLocale {
  return (ADMIN_LOCALES as readonly string[]).includes(value);
}
