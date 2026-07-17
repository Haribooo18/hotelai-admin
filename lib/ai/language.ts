import type { Message } from "@/types/message";

const SUPPORTED_LANGUAGES = ["ru", "uk", "en", "de", "fr", "es", "it", "pl", "tr"] as const;
export type SupportedAILanguage = (typeof SUPPORTED_LANGUAGES)[number];

const CYRILLIC_UKRAINIAN = /[іїєґ]/i;
const CYRILLIC = /[а-яё]/i;
const LATIN = /[a-z]/i;

const KEYWORDS: Record<SupportedAILanguage, RegExp[]> = {
  ru: [/\b(здравствуйте|спасибо|номер|бронирован|отель|можно|нужно|хочу)\b/i],
  uk: [/\b(добрий|дякую|номер|бронюван|готель|можна|потрібно|хочу)\b/i],
  en: [/\b(hello|thanks|room|booking|hotel|available|please|need|want)\b/i],
  de: [/\b(hallo|danke|zimmer|buchung|hotel|verfügbar|bitte)\b/i],
  fr: [/\b(bonjour|merci|chambre|réservation|hôtel|disponible|s'il vous plaît)\b/i],
  es: [/\b(hola|gracias|habitación|reserva|hotel|disponible|por favor)\b/i],
  it: [/\b(ciao|grazie|camera|prenotazione|hotel|disponibile|per favore)\b/i],
  pl: [/\b(cześć|dziękuję|pokój|rezerwacja|hotel|dostępny|proszę)\b/i],
  tr: [/\b(merhaba|teşekkür|oda|rezervasyon|otel|müsait|lütfen)\b/i],
};

export function normalizeLanguage(value?: string | null): SupportedAILanguage {
  const normalized = value?.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(normalized as SupportedAILanguage)
    ? (normalized as SupportedAILanguage)
    : "ru";
}

export function detectLanguage(text: string, fallback = "ru"): SupportedAILanguage {
  const sample = text.trim().slice(0, 2_000);
  if (!sample) return normalizeLanguage(fallback);
  if (CYRILLIC_UKRAINIAN.test(sample)) return "uk";

  let best: SupportedAILanguage | null = null;
  let bestScore = 0;
  for (const language of SUPPORTED_LANGUAGES) {
    const score = KEYWORDS[language].reduce(
      (total, pattern) => total + (pattern.test(sample) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      best = language;
      bestScore = score;
    }
  }
  if (best) return best;
  if (CYRILLIC.test(sample)) return "ru";
  if (LATIN.test(sample)) return normalizeLanguage(fallback) === "ru" ? "en" : normalizeLanguage(fallback);
  return normalizeLanguage(fallback);
}

export function resolveConversationLanguage(
  messages: Message[],
  fallback?: string | null,
): SupportedAILanguage {
  const latestGuest = [...messages]
    .reverse()
    .find((message) => message.role === "guest" && !message.is_internal && !message.deleted_at);
  return detectLanguage(latestGuest?.body ?? "", fallback ?? "ru");
}

export function languageDisplayName(language: string): string {
  const labels: Record<SupportedAILanguage, string> = {
    ru: "русский",
    uk: "украинский",
    en: "English",
    de: "Deutsch",
    fr: "français",
    es: "español",
    it: "italiano",
    pl: "polski",
    tr: "Türkçe",
  };
  return labels[normalizeLanguage(language)];
}
