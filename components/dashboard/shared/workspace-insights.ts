import { derivePaymentStatus } from "@/components/dashboard/bookings/booking-ops-metrics";
import type { BookingOpsKpis } from "@/components/dashboard/bookings/booking-ops-metrics";
import type { CalendarOpsKpis } from "@/components/dashboard/calendar/calendar-ops-metrics";
import type { GuestCrmKpis } from "@/components/dashboard/guests/guest-crm-metrics";
import type { KnowledgeOpsKpis } from "@/components/dashboard/knowledge/knowledge-ops-metrics";
import type { AIOpsKpis } from "@/components/dashboard/ai/ai-ops-metrics";
import type { RoomOpsKpis } from "@/components/dashboard/rooms/room-ops-metrics";
import type { SettingsOpsKpis } from "@/components/dashboard/settings/settings-ops-metrics";
import type { AIHealthStatus, HotelAISettings } from "@/types/ai-settings";
import type { Booking } from "@/types/booking";
import { formatRevenueCurrency } from "@/components/dashboard/revenue/revenue-metrics";
import { formatTranslation } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

export type WorkspaceInsight = {
  contextSummaryKey: TranslationPath;
  contextSummaryParams?: Record<string, string | number>;
  aiHintKey?: TranslationPath;
  aiHintParams?: Record<string, string | number>;
};

function countPendingBookings(bookings: Booking[]): number {
  return bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      derivePaymentStatus(booking) === "pending"
  ).length;
}

export function buildBookingsWorkspaceInsight(
  kpis: BookingOpsKpis,
  bookings: Booking[]
): WorkspaceInsight {
  const pending = countPendingBookings(bookings);

  return {
    contextSummaryKey:
      kpis.checkInsToday > 0 || pending > 0
        ? "workspace.bookings.contextSummary"
        : "workspace.bookings.contextSummaryQuiet",
    contextSummaryParams: {
      arrivals: String(kpis.checkInsToday),
      pending: String(pending),
    },
    aiHintKey:
      pending > 0
        ? "workspace.bookings.aiHintPending"
        : "workspace.bookings.aiHintDefault",
    aiHintParams: { count: String(pending) },
  };
}

export function buildGuestsWorkspaceInsight(kpis: GuestCrmKpis): WorkspaceInsight {
  return {
    contextSummaryKey:
      kpis.vip > 0
        ? "workspace.guests.contextSummaryVip"
        : "workspace.guests.contextSummary",
    contextSummaryParams: {
      vip: String(kpis.vip),
      active: String(kpis.activeGuests),
    },
    aiHintKey:
      kpis.vip > 0
        ? "workspace.guests.aiHintVip"
        : "workspace.guests.aiHintDefault",
    aiHintParams: { count: String(kpis.vip) },
  };
}

export function buildCalendarWorkspaceInsight(
  kpis: CalendarOpsKpis
): WorkspaceInsight {
  return {
    contextSummaryKey: "workspace.calendar.contextSummary",
    contextSummaryParams: {
      occupancy: String(kpis.occupancyPercent),
      arrivals: String(kpis.checkInsToday),
    },
    aiHintKey:
      kpis.checkInsToday > 2
        ? "workspace.calendar.aiHintBusy"
        : "workspace.calendar.aiHintDefault",
    aiHintParams: { count: String(kpis.checkInsToday) },
  };
}

export function buildRoomsWorkspaceInsight(kpis: RoomOpsKpis): WorkspaceInsight {
  return {
    contextSummaryKey: "workspace.rooms.contextSummary",
    contextSummaryParams: {
      available: String(kpis.available),
      maintenance: String(kpis.maintenance),
    },
    aiHintKey:
      kpis.maintenance > 0
        ? "workspace.rooms.aiHintMaintenance"
        : "workspace.rooms.aiHintDefault",
    aiHintParams: { count: String(kpis.maintenance) },
  };
}

export function buildRevenueWorkspaceInsight(
  periodRevenue: number,
  growthPercent: number
): WorkspaceInsight {
  const growthLabel = `${growthPercent >= 0 ? "+" : ""}${growthPercent}%`;

  return {
    contextSummaryKey:
      growthPercent !== 0
        ? "workspace.revenue.contextSummaryGrowth"
        : "workspace.revenue.contextSummary",
    contextSummaryParams: {
      growth: growthLabel,
      revenue: formatRevenueCurrency(periodRevenue),
    },
    aiHintKey:
      growthPercent > 5
        ? "workspace.revenue.aiHintDemand"
        : "workspace.revenue.aiHintDefault",
  };
}

export function buildKnowledgeWorkspaceInsight(
  kpis: KnowledgeOpsKpis
): WorkspaceInsight {
  return {
    contextSummaryKey: "workspace.knowledge.contextSummary",
    contextSummaryParams: {
      articles: String(kpis.totalArticles),
      categories: String(kpis.categories),
    },
    aiHintKey:
      kpis.aiCoveragePercent < 70
        ? "workspace.knowledge.aiHintCoverage"
        : "workspace.knowledge.aiHintDefault",
    aiHintParams: { percent: String(kpis.aiCoveragePercent) },
  };
}

export function buildAiWorkspaceInsight(kpis: AIOpsKpis): WorkspaceInsight {
  return {
    contextSummaryKey: "workspace.ai.contextSummary",
    contextSummaryParams: {
      active: String(kpis.activeConversations),
      resolved: String(kpis.aiResolvedToday),
    },
    aiHintKey:
      kpis.activeConversations > 0
        ? "workspace.ai.aiHintWaiting"
        : "workspace.ai.aiHintDefault",
    aiHintParams: { count: String(kpis.activeConversations) },
  };
}

export function buildReceptionAiWorkspaceInsight(
  settings: HotelAISettings,
  health: AIHealthStatus,
  configured: boolean
): WorkspaceInsight {
  return {
    contextSummaryKey: configured
      ? settings.enabled
        ? "workspace.receptionAi.contextSummaryActive"
        : "workspace.receptionAi.contextSummaryDisabled"
      : "workspace.receptionAi.contextSummarySetup",
    contextSummaryParams: {
      requests: String(health.recent_requests),
    },
    aiHintKey: configured
      ? health.recent_errors > 0
        ? "workspace.receptionAi.aiHintErrors"
        : "workspace.receptionAi.aiHintDefault"
      : "workspace.receptionAi.aiHintSetup",
    aiHintParams: { count: String(health.recent_errors) },
  };
}

export function buildSettingsWorkspaceInsight(
  kpis: SettingsOpsKpis,
  subscriptionLabel: string
): WorkspaceInsight {
  return {
    contextSummaryKey: "workspace.settings.contextSummary",
    contextSummaryParams: {
      integrations: String(kpis.connectedChannels),
      plan: subscriptionLabel,
    },
    aiHintKey:
      kpis.aiStatusPercent < 100
        ? "workspace.settings.aiHintSetup"
        : "workspace.settings.aiHintDefault",
  };
}

export function formatWorkspaceInsight(
  insight: WorkspaceInsight,
  t: (key: TranslationPath) => string
): { contextSummary: string; aiHint?: string } {
  const contextSummary = formatTranslation(
    t(insight.contextSummaryKey),
    Object.fromEntries(
      Object.entries(insight.contextSummaryParams ?? {}).map(([key, value]) => [
        key,
        String(value),
      ])
    )
  );

  const aiHint = insight.aiHintKey
    ? formatTranslation(
        t(insight.aiHintKey),
        Object.fromEntries(
          Object.entries(insight.aiHintParams ?? {}).map(([key, value]) => [
            key,
            String(value),
          ])
        )
      )
    : undefined;

  return { contextSummary, aiHint };
}
