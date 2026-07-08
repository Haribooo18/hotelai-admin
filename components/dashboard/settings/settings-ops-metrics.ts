import type {
  AIHealthStatus,
  AIObservabilityLog,
  HotelAISettings,
} from "@/types/ai-settings";

import type { AdminLocale } from "@/lib/i18n/locales";
import { DEFAULT_ADMIN_LOCALE } from "@/lib/i18n/locales";
import { getTranslation } from "@/lib/i18n/translations";
import { minutesSince } from "@/lib/dashboard/date";

export type SettingsSection =
  | "ai"
  | "channels"
  | "billing"
  | "team"
  | "security"
  | "integrations";

export type SettingsOpsKpis = {
  aiStatusPercent: number;
  connectedChannels: number;
  activeAutomations: number;
  knowledgeHealthPercent: number;
  lastSyncMinutes: number;
  usageToday: number;
  avgResponseTimeMs: number;
};

export type ChannelStatus = {
  id: string;
  label: string;
  connected: boolean;
  description: string;
};

export type SettingsOperationsSnapshot = {
  recentActivity: AIObservabilityLog[];
  diagnostics: Array<{ label: string; value: string; ok: boolean }>;
  version: string;
  environment: string;
  apiOnline: boolean;
};

export function computeSettingsOpsKpis(
  settings: HotelAISettings,
  health: AIHealthStatus,
  locale: AdminLocale = DEFAULT_ADMIN_LOCALE
): SettingsOpsKpis {
  const aiStatusPercent = !health.configured
    ? 0
    : health.enabled
      ? 100
      : 45;

  const channels = buildChannelStatuses(settings, health, locale);
  const connectedChannels = channels.filter((channel) => channel.connected).length;

  let activeAutomations = 0;
  if (settings.enabled) activeAutomations += 1;
  if (settings.tool_choice !== "none") activeAutomations += 1;
  if (settings.max_tool_rounds > 0) activeAutomations += 1;

  const instructionScore = settings.extra_instructions?.trim().length ?? 0;
  const knowledgeHealthPercent = !health.configured
    ? 0
    : Math.min(
        100,
        40 +
          (settings.enabled ? 25 : 0) +
          (instructionScore > 40 ? 20 : instructionScore > 0 ? 10 : 0) +
          (health.recent_requests > 0 ? 15 : 0)
      );

  return {
    aiStatusPercent,
    connectedChannels,
    activeAutomations,
    knowledgeHealthPercent,
    lastSyncMinutes: minutesSince(settings.updated_at),
    usageToday: health.recent_requests,
    avgResponseTimeMs: health.avg_duration_ms ?? 0,
  };
}

export function buildChannelStatuses(
  settings: HotelAISettings,
  health: AIHealthStatus,
  locale: AdminLocale
): ChannelStatus[] {
  return [
    {
      id: "telegram",
      label: "Telegram",
      connected: health.configured && settings.enabled,
      description: health.configured
        ? getTranslation(locale, "settings.channelsTelegramConnected")
        : getTranslation(locale, "settings.channelsTelegramSetup"),
    },
    {
      id: "website",
      label: "Website",
      connected: health.configured,
      description: health.configured
        ? getTranslation(locale, "settings.channelsWebsiteActive")
        : getTranslation(locale, "settings.channelsWebsiteOpenai"),
    },
    {
      id: "email",
      label: "Email",
      connected: false,
      description: getTranslation(locale, "settings.channelsEmailSoon"),
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      connected: false,
      description: getTranslation(locale, "settings.channelsWhatsappSoon"),
    },
  ];
}

export function buildSettingsOperationsSnapshot(
  health: AIHealthStatus,
  logs: AIObservabilityLog[],
  configured: boolean,
  locale: AdminLocale
): SettingsOperationsSnapshot {
  return {
    recentActivity: logs.slice(0, 6),
    diagnostics: [
      {
        label: getTranslation(locale, "settings.diagOpenai"),
        value: configured
          ? getTranslation(locale, "settings.diagOpenaiConfigured")
          : getTranslation(locale, "settings.diagOpenaiNotConfigured"),
        ok: configured,
      },
      {
        label: getTranslation(locale, "settings.diagAiEnabled"),
        value: health.enabled
          ? getTranslation(locale, "settings.diagYes")
          : getTranslation(locale, "settings.diagNo"),
        ok: health.enabled && configured,
      },
      {
        label: getTranslation(locale, "settings.diagErrors24h"),
        value: String(health.recent_errors),
        ok: health.recent_errors === 0,
      },
      {
        label: getTranslation(locale, "settings.diagAvgLatency"),
        value:
          health.avg_duration_ms != null
            ? `${health.avg_duration_ms} ms`
            : "—",
        ok: (health.avg_duration_ms ?? 0) < 5000,
      },
    ],
    version: "0.1.0",
    environment: "Production",
    apiOnline: configured,
  };
}

export function mapInitialTab(
  tab?: string
): SettingsSection {
  if (tab === "billing") return "billing";
  return "ai";
}
