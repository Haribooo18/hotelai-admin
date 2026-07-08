import type { AdminLocale } from "@/lib/i18n/locales";
import type { TranslationPath } from "@/lib/i18n/translations";

const INTL_LOCALES: Record<AdminLocale, string> = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
  de: "de-DE",
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE_FULL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_SHORT_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

export function formatDateFull(value: string): string {
  return DATE_FULL_FORMATTER.format(new Date(value));
}

export function formatDateShort(value: string): string {
  return DATE_SHORT_FORMATTER.format(new Date(value));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getIntlLocale(locale: AdminLocale): string {
  return INTL_LOCALES[locale];
}

export function formatAdminDateShort(date: Date, locale: AdminLocale): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatAdminWeekdayDate(date: Date, locale: AdminLocale): string {
  return date.toLocaleDateString(getIntlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function formatAdminTime(iso: string, locale: AdminLocale): string {
  return new Date(iso).toLocaleString(getIntlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNightsCount(
  count: number,
  t: (path: TranslationPath) => string
): string {
  const rounded = Math.round(count);
  const label = rounded === 1 ? t("common.night") : t("common.nights");
  return `${rounded} ${label}`;
}
