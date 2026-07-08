import type { AdminLocale } from "../locales";
import { EN } from "./en";
import { RU } from "./ru";
import type { AdminTranslations, TranslationTree } from "./types";

export type { AdminTranslations, TranslationTree } from "./types";

export const translations: Record<AdminLocale, AdminTranslations> = {
  en: EN,
  uk: EN,
  ru: RU,
  pl: EN,
  de: EN,
};

type NestedKeys<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: NestedKeys<
        T[K],
        Prefix extends "" ? K : `${Prefix}.${K}`
      >;
    }[keyof T & string];

export type TranslationPath = NestedKeys<AdminTranslations>;

export function getTranslation(
  locale: AdminLocale,
  path: TranslationPath
): string {
  const parts = path.split(".");
  let cursor: TranslationTree | string | undefined = translations[locale];

  for (const part of parts) {
    if (!cursor || typeof cursor === "string") break;
    cursor = cursor[part];
  }

  if (typeof cursor === "string") return cursor;
  return getTranslation("en", path);
}

export function formatTranslation(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}
