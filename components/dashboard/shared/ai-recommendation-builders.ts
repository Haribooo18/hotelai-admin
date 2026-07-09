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
import { formatCurrency } from "@/lib/dashboard/format";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import { buildDashboardAiInsights } from "@/components/dashboard/home/dashboard-insights";
import type { DashboardAlert, DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics";

import type { AiRecommendation } from "./ai-recommendation-types";

function countPendingBookings(bookings: Booking[]): number {
  return bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      derivePaymentStatus(booking) === "pending"
  ).length;
}

function dismissSecondary(): AiRecommendation["secondaryAction"] {
  return {
    labelKey: "ai.recommendations.actions.dismiss",
    dismiss: true,
  };
}

export function buildBookingsRecommendations(
  kpis: BookingOpsKpis,
  bookings: Booking[]
): AiRecommendation[] {
  const pending = countPendingBookings(bookings);

  if (pending > 0) {
    return [
      {
        id: "bookings-pending-payments",
        priority: "high",
        titleKey: "ai.recommendations.bookings.pendingTitle",
        recommendationKey: "ai.recommendations.bookings.pendingRecommendation",
        recommendationParams: { count: String(pending) },
        whyKey: "ai.recommendations.bookings.pendingWhy",
        whyParams: { count: String(pending) },
        impactKey: "ai.recommendations.bookings.pendingImpact",
        expectedImpactKey: "ai.recommendations.bookings.pendingRevenue",
        expectedImpactParams: {
          amount: formatRevenueCurrency(kpis.revenueTotal * 0.08),
        },
        confidencePercent: 91,
        primaryAction: {
          labelKey: "ai.recommendations.actions.reviewReservations",
          href: "/bookings",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (kpis.checkInsToday > 0) {
    return [
      {
        id: "bookings-arrivals-today",
        priority: "medium",
        titleKey: "ai.recommendations.bookings.arrivalsTitle",
        recommendationKey: "ai.recommendations.bookings.arrivalsRecommendation",
        recommendationParams: { count: String(kpis.checkInsToday) },
        whyKey: "ai.recommendations.bookings.arrivalsWhy",
        whyParams: { count: String(kpis.checkInsToday) },
        impactKey: "ai.recommendations.bookings.arrivalsImpact",
        confidencePercent: 86,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openReservation",
          href: "/bookings",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "bookings-placeholder",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.bookings.placeholderTitle",
      recommendationKey: "ai.recommendations.bookings.placeholderRecommendation",
      whyKey: "ai.recommendations.bookings.placeholderWhy",
      impactKey: "ai.recommendations.bookings.placeholderImpact",
      confidencePercent: 72,
      primaryAction: {
        labelKey: "ai.recommendations.actions.reviewReservations",
        href: "/bookings",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildRevenueRecommendations(
  growthPercent: number,
  occupancyPercent: number,
  periodRevenue: number
): AiRecommendation[] {
  if (growthPercent > 5) {
    const uplift = Math.round(periodRevenue * 0.08);
    return [
      {
        id: "revenue-demand-spike",
        priority: "high",
        titleKey: "ai.recommendations.revenue.demandTitle",
        recommendationKey: "ai.recommendations.revenue.demandRecommendation",
        recommendationParams: { percent: String(growthPercent) },
        whyKey: "ai.recommendations.revenue.demandWhy",
        whyParams: { percent: String(growthPercent) },
        impactKey: "ai.recommendations.revenue.demandImpact",
        expectedImpactKey: "ai.recommendations.revenue.demandRevenue",
        expectedImpactParams: { amount: formatRevenueCurrency(uplift) },
        confidencePercent: 92,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openRevenue",
          href: "/rates",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (occupancyPercent < 45) {
    return [
      {
        id: "revenue-low-occupancy",
        priority: "medium",
        titleKey: "ai.recommendations.revenue.occupancyTitle",
        recommendationKey: "ai.recommendations.revenue.occupancyRecommendation",
        recommendationParams: { percent: String(occupancyPercent) },
        whyKey: "ai.recommendations.revenue.occupancyWhy",
        whyParams: { percent: String(occupancyPercent) },
        impactKey: "ai.recommendations.revenue.occupancyImpact",
        confidencePercent: 84,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openRevenue",
          href: "/rates",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "revenue-weekend-pricing",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.revenue.weekendTitle",
      recommendationKey: "ai.recommendations.revenue.weekendRecommendation",
      recommendationParams: { percent: "8" },
      whyKey: "ai.recommendations.revenue.weekendWhy",
      impactKey: "ai.recommendations.revenue.weekendImpact",
      expectedImpactKey: "ai.recommendations.revenue.weekendRevenue",
      expectedImpactParams: { amount: formatCurrency(1240) },
      confidencePercent: 88,
      primaryAction: {
        labelKey: "ai.recommendations.actions.applyRecommendation",
        href: "/rates",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildGuestsRecommendations(kpis: GuestCrmKpis): AiRecommendation[] {
  if (kpis.vip > 0) {
    return [
      {
        id: "guests-vip-staying",
        priority: "high",
        titleKey: "ai.recommendations.guests.vipTitle",
        recommendationKey: "ai.recommendations.guests.vipRecommendation",
        recommendationParams: { count: String(kpis.vip) },
        whyKey: "ai.recommendations.guests.vipWhy",
        whyParams: { count: String(kpis.vip) },
        impactKey: "ai.recommendations.guests.vipImpact",
        confidencePercent: 93,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openGuest",
          href: "/guests",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (kpis.returning > 0) {
    return [
      {
        id: "guests-returning",
        priority: "medium",
        titleKey: "ai.recommendations.guests.returningTitle",
        recommendationKey: "ai.recommendations.guests.returningRecommendation",
        recommendationParams: { count: String(kpis.returning) },
        whyKey: "ai.recommendations.guests.returningWhy",
        whyParams: { count: String(kpis.returning) },
        impactKey: "ai.recommendations.guests.returningImpact",
        confidencePercent: 81,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openGuest",
          href: "/guests",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "guests-placeholder",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.guests.placeholderTitle",
      recommendationKey: "ai.recommendations.guests.placeholderRecommendation",
      whyKey: "ai.recommendations.guests.placeholderWhy",
      impactKey: "ai.recommendations.guests.placeholderImpact",
      confidencePercent: 70,
      primaryAction: {
        labelKey: "ai.recommendations.actions.openGuest",
        href: "/guests",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildRoomsRecommendations(kpis: RoomOpsKpis): AiRecommendation[] {
  if (kpis.maintenance > 0) {
    return [
      {
        id: "rooms-maintenance",
        priority: "high",
        titleKey: "ai.recommendations.rooms.maintenanceTitle",
        recommendationKey: "ai.recommendations.rooms.maintenanceRecommendation",
        recommendationParams: { count: String(kpis.maintenance) },
        whyKey: "ai.recommendations.rooms.maintenanceWhy",
        whyParams: { count: String(kpis.maintenance) },
        impactKey: "ai.recommendations.rooms.maintenanceImpact",
        confidencePercent: 89,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/rooms",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (kpis.available <= 2 && kpis.total > 0) {
    return [
      {
        id: "rooms-low-availability",
        priority: "medium",
        titleKey: "ai.recommendations.rooms.availabilityTitle",
        recommendationKey: "ai.recommendations.rooms.availabilityRecommendation",
        recommendationParams: { count: String(kpis.available) },
        whyKey: "ai.recommendations.rooms.availabilityWhy",
        whyParams: { count: String(kpis.available) },
        impactKey: "ai.recommendations.rooms.availabilityImpact",
        confidencePercent: 85,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/rooms",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "rooms-placeholder",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.rooms.placeholderTitle",
      recommendationKey: "ai.recommendations.rooms.placeholderRecommendation",
      whyKey: "ai.recommendations.rooms.placeholderWhy",
      impactKey: "ai.recommendations.rooms.placeholderImpact",
      confidencePercent: 74,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/rooms",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildKnowledgeRecommendations(
  kpis: KnowledgeOpsKpis
): AiRecommendation[] {
  if (kpis.aiCoveragePercent < 70) {
    return [
      {
        id: "knowledge-coverage-gap",
        priority: "high",
        titleKey: "ai.recommendations.knowledge.coverageTitle",
        recommendationKey: "ai.recommendations.knowledge.coverageRecommendation",
        recommendationParams: { percent: String(kpis.aiCoveragePercent) },
        whyKey: "ai.recommendations.knowledge.coverageWhy",
        whyParams: { percent: String(kpis.aiCoveragePercent) },
        impactKey: "ai.recommendations.knowledge.coverageImpact",
        confidencePercent: 90,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/knowledge",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (kpis.drafts > 0) {
    return [
      {
        id: "knowledge-missing-articles",
        priority: "medium",
        titleKey: "ai.recommendations.knowledge.missingTitle",
        recommendationKey: "ai.recommendations.knowledge.missingRecommendation",
        recommendationParams: { count: String(kpis.drafts) },
        whyKey: "ai.recommendations.knowledge.missingWhy",
        whyParams: { count: String(kpis.drafts) },
        impactKey: "ai.recommendations.knowledge.missingImpact",
        confidencePercent: 82,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/knowledge",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "knowledge-placeholder",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.knowledge.placeholderTitle",
      recommendationKey: "ai.recommendations.knowledge.placeholderRecommendation",
      whyKey: "ai.recommendations.knowledge.placeholderWhy",
      impactKey: "ai.recommendations.knowledge.placeholderImpact",
      confidencePercent: 76,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/knowledge",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildAiInboxRecommendations(kpis: AIOpsKpis): AiRecommendation[] {
  if (kpis.activeConversations > 0) {
    return [
      {
        id: "ai-unread-conversations",
        priority: "high",
        titleKey: "ai.recommendations.inbox.unreadTitle",
        recommendationKey: "ai.recommendations.inbox.unreadRecommendation",
        recommendationParams: { count: String(kpis.activeConversations) },
        whyKey: "ai.recommendations.inbox.unreadWhy",
        whyParams: { count: String(kpis.activeConversations) },
        impactKey: "ai.recommendations.inbox.unreadImpact",
        confidencePercent: 94,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/ai",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "ai-suggested-replies",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.inbox.suggestedTitle",
      recommendationKey: "ai.recommendations.inbox.suggestedRecommendation",
      whyKey: "ai.recommendations.inbox.suggestedWhy",
      impactKey: "ai.recommendations.inbox.suggestedImpact",
      confidencePercent: 78,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/ai",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildSettingsRecommendations(
  kpis: SettingsOpsKpis,
  health: AIHealthStatus,
  configured: boolean
): AiRecommendation[] {
  if (!configured || kpis.aiStatusPercent < 100) {
    return [
      {
        id: "settings-integration",
        priority: "high",
        titleKey: "ai.recommendations.settings.integrationTitle",
        recommendationKey: "ai.recommendations.settings.integrationRecommendation",
        whyKey: "ai.recommendations.settings.integrationWhy",
        impactKey: "ai.recommendations.settings.integrationImpact",
        confidencePercent: 95,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/settings",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (health.recent_errors > 0) {
    return [
      {
        id: "settings-errors",
        priority: "medium",
        titleKey: "ai.recommendations.settings.errorsTitle",
        recommendationKey: "ai.recommendations.settings.errorsRecommendation",
        recommendationParams: { count: String(health.recent_errors) },
        whyKey: "ai.recommendations.settings.errorsWhy",
        whyParams: { count: String(health.recent_errors) },
        impactKey: "ai.recommendations.settings.errorsImpact",
        confidencePercent: 87,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/settings",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "settings-subscription",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.settings.subscriptionTitle",
      recommendationKey: "ai.recommendations.settings.subscriptionRecommendation",
      whyKey: "ai.recommendations.settings.subscriptionWhy",
      impactKey: "ai.recommendations.settings.subscriptionImpact",
      confidencePercent: 73,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/settings?tab=billing",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildCalendarRecommendations(
  kpis: CalendarOpsKpis
): AiRecommendation[] {
  if (kpis.checkInsToday > 2) {
    return [
      {
        id: "calendar-busy-arrivals",
        priority: "high",
        titleKey: "ai.recommendations.calendar.busyTitle",
        recommendationKey: "ai.recommendations.calendar.busyRecommendation",
        recommendationParams: { count: String(kpis.checkInsToday) },
        whyKey: "ai.recommendations.calendar.busyWhy",
        whyParams: { count: String(kpis.checkInsToday) },
        impactKey: "ai.recommendations.calendar.busyImpact",
        confidencePercent: 88,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/calendar",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "calendar-placeholder",
      priority: "low",
      isPlaceholder: true,
      titleKey: "ai.recommendations.calendar.placeholderTitle",
      recommendationKey: "ai.recommendations.calendar.placeholderRecommendation",
      whyKey: "ai.recommendations.calendar.placeholderWhy",
      impactKey: "ai.recommendations.calendar.placeholderImpact",
      confidencePercent: 71,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/calendar",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildReceptionAiRecommendations(
  settings: HotelAISettings,
  health: AIHealthStatus,
  configured: boolean
): AiRecommendation[] {
  if (!configured) {
    return buildSettingsRecommendations(
      { aiStatusPercent: 0, connectedChannels: 0, activeAutomations: 0, knowledgeHealthPercent: 0, lastSyncMinutes: 0, usageToday: 0, avgResponseTimeMs: 0 },
      health,
      configured
    );
  }

  if (health.recent_errors > 0) {
    return [
      {
        id: "reception-errors",
        priority: "high",
        titleKey: "ai.recommendations.reception.errorsTitle",
        recommendationKey: "ai.recommendations.reception.errorsRecommendation",
        recommendationParams: { count: String(health.recent_errors) },
        whyKey: "ai.recommendations.reception.errorsWhy",
        whyParams: { count: String(health.recent_errors) },
        impactKey: "ai.recommendations.reception.errorsImpact",
        confidencePercent: 91,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/reception-ai",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (!settings.enabled) {
    return [
      {
        id: "reception-disabled",
        priority: "medium",
        titleKey: "ai.recommendations.reception.disabledTitle",
        recommendationKey: "ai.recommendations.reception.disabledRecommendation",
        whyKey: "ai.recommendations.reception.disabledWhy",
        impactKey: "ai.recommendations.reception.disabledImpact",
        confidencePercent: 83,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/reception-ai",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "reception-healthy",
      priority: "low",
      titleKey: "ai.recommendations.reception.healthyTitle",
      recommendationKey: "ai.recommendations.reception.healthyRecommendation",
      whyKey: "ai.recommendations.reception.healthyWhy",
      impactKey: "ai.recommendations.reception.healthyImpact",
      confidencePercent: 80,
      primaryAction: {
        labelKey: "ai.recommendations.actions.review",
        href: "/reception-ai",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}

export function buildDashboardRecommendations(
  metrics: DashboardMetrics,
  alerts: DashboardAlert[],
  leads: Lead[],
  rooms: Room[],
  bookings: Booking[]
): AiRecommendation[] {
  const insight = buildDashboardAiInsights(metrics, alerts, leads, rooms, bookings);
  const newLeads = leads.filter((lead) => lead.status === "new").length;

  if (newLeads > 0) {
    return [
      {
        id: "dashboard-inbox-demand",
        priority: "high",
        titleKey: "ai.recommendations.inbox.unreadTitle",
        recommendationKey: "ai.recommendations.inbox.unreadRecommendation",
        recommendationParams: { count: String(newLeads) },
        whyKey: "ai.recommendations.inbox.unreadWhy",
        whyParams: { count: String(newLeads) },
        impactKey: "ai.recommendations.inbox.unreadImpact",
        confidencePercent: insight.confidencePercent,
        primaryAction: {
          labelKey: "ai.recommendations.actions.review",
          href: "/ai",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  if (metrics.arrivalsToday > 0) {
    return [
      {
        id: "dashboard-arrivals",
        priority: "medium",
        titleKey: "ai.recommendations.bookings.arrivalsTitle",
        recommendationKey: "ai.recommendations.bookings.arrivalsRecommendation",
        recommendationParams: { count: String(metrics.arrivalsToday) },
        whyKey: "ai.recommendations.bookings.arrivalsWhy",
        whyParams: { count: String(metrics.arrivalsToday) },
        impactKey: "ai.recommendations.bookings.arrivalsImpact",
        confidencePercent: insight.confidencePercent,
        primaryAction: {
          labelKey: "ai.recommendations.actions.openReservation",
          href: "/bookings",
        },
        secondaryAction: dismissSecondary(),
      },
    ];
  }

  return [
    {
      id: "dashboard-executive",
      priority: "low",
      isPlaceholder: insight.isPlaceholder,
      titleKey: "ai.recommendations.revenue.weekendTitle",
      recommendationKey: "ai.recommendations.revenue.weekendRecommendation",
      recommendationParams: { percent: "8" },
      whyKey: "ai.recommendations.revenue.weekendWhy",
      impactKey: "ai.recommendations.revenue.weekendImpact",
      expectedImpactKey: "ai.recommendations.revenue.weekendRevenue",
      expectedImpactParams: { amount: formatCurrency(1240) },
      confidencePercent: insight.confidencePercent,
      primaryAction: {
        labelKey: "ai.recommendations.actions.openRevenue",
        href: "/rates",
      },
      secondaryAction: dismissSecondary(),
    },
  ];
}
