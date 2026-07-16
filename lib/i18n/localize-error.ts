import type { AdminLocale } from "./locales";
import { getTranslation, type TranslationPath } from "./translations";

const ERROR_MESSAGE_MAP: Record<string, TranslationPath> = {
  "Некорректные данные": "errors.invalidData",
  "Invalid data": "errors.invalidData",
  "Гость не найден": "errors.guestNotFound",
  "Guest not found": "errors.guestNotFound",
  "Статья не найдена": "errors.articleNotFound",
  "Article not found": "errors.articleNotFound",
  "AI-ресепшн отключён в настройках отеля.": "errors.aiDisabled",
  "AI receptionist is disabled in hotel settings.": "errors.aiDisabled",
  "Диалог не найден": "errors.dialogNotFound",
  "Conversation not found": "errors.dialogNotFound",
  "Нельзя объединить гостя с самим собой": "errors.mergeSelf",
  "Cannot merge a guest with themselves": "errors.mergeSelf",
};

export function localizeError(
  locale: AdminLocale,
  message: string | undefined | null
): string {
  if (!message) {
    return getTranslation(locale, "errors.genericLoad");
  }

  const key = ERROR_MESSAGE_MAP[message.trim()];
  if (key) {
    return getTranslation(locale, key);
  }

  return message;
}

export function localizeErrorWithT(
  t: (path: TranslationPath) => string,
  message: string | undefined | null
): string {
  if (!message) {
    return t("errors.genericLoad");
  }

  const key = ERROR_MESSAGE_MAP[message.trim()];
  if (key) {
    return t(key);
  }

  return message;
}
