import type { Booking } from "@/types/booking";
import type { Lead } from "@/types/lead";
import type { Room } from "@/types/room";

import { derivePaymentStatus } from "@/components/dashboard/bookings/booking-ops-metrics";
import {
  buildRoomCardModels,
  computeRoomOpsKpis,
} from "@/components/dashboard/rooms/room-ops-metrics";
import { formatCurrency } from "@/lib/dashboard/format";

import type { DashboardAlert, DashboardMetrics, TrendPoint } from "./dashboard-metrics";

import type { TranslationPath } from "@/lib/i18n/translations";

export type DashboardHeroInsight = {
  isPlaceholder: boolean;
  headlineKey: TranslationPath;
  headlineParams?: Record<string, string | number>;
  recommendationKey: TranslationPath;
  recommendationParams?: Record<string, string | number>;
  revenueImpact: string | null;
};

export type DashboardAiInsight = {
  isPlaceholder: boolean;
  headlineKey: TranslationPath;
  recommendationKeys: TranslationPath[];
  impactKeys: TranslationPath[];
  confidencePercent: number;
};

export type HeroExecutiveStatus = {
  occupancyPercent: number;
  hotelHealthKey: TranslationPath;
  arrivalsToday: number;
  criticalIssues: number;
};

export type TodayOperationMetric = {
  key: string;
  label: TranslationPath;
  value: number;
  href?: string;
  tone: "default" | "warning" | "urgent";
};

function weekendOccupancyForecast(
  occupancyTrend: TrendPoint[],
  currentOccupancy: number
): number {
  if (occupancyTrend.length === 0) return currentOccupancy;
  const peak = Math.max(...occupancyTrend.map((point) => point.value), currentOccupancy);
  return Math.round(peak);
}

function estimateRevenueUplift(revenueMonth: number, percent: number): number {
  if (revenueMonth <= 0) return 0;
  return Math.round((revenueMonth / 30) * 7 * (percent / 100));
}

export function buildDashboardHeroInsight(
  metrics: DashboardMetrics,
  occupancyTrend: TrendPoint[]
): DashboardHeroInsight {
  const forecast = weekendOccupancyForecast(
    occupancyTrend,
    metrics.occupancyPercent
  );
  const hasTrend = occupancyTrend.some((point) => point.value > 0);
  const hasOccupancySignal =
    metrics.occupancyPercent > 0 || hasTrend || metrics.arrivalsToday > 0;

  if (!hasOccupancySignal) {
    return {
      isPlaceholder: true,
      headlineKey: "dashboard.hero.placeholderHeadline",
      recommendationKey: "dashboard.hero.placeholderRecommendation",
      revenueImpact: null,
    };
  }

  const uplift = estimateRevenueUplift(metrics.revenueMonth, 8);

  return {
    isPlaceholder: false,
    headlineKey: "dashboard.hero.occupancyForecast",
    headlineParams: { percent: String(forecast) },
    recommendationKey: "dashboard.hero.priceRecommendation",
    recommendationParams: { percent: "8" },
    revenueImpact: uplift > 0 ? formatCurrency(uplift) : null,
  };
}

export function buildDashboardAiInsights(
  metrics: DashboardMetrics,
  alerts: DashboardAlert[],
  leads: Lead[],
  rooms: Room[],
  bookings: Booking[]
): DashboardAiInsight {
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const roomModels = buildRoomCardModels(rooms, bookings);
  const roomKpis = computeRoomOpsKpis(roomModels);
  const recommendations: TranslationPath[] = [];
  const impacts: TranslationPath[] = [];

  if (newLeads > 0) {
    recommendations.push("dashboard.aiInsights.recommendOtaDemand");
    impacts.push("dashboard.aiInsights.impactHigherOccupancy");
  }

  if (
    metrics.occupancyPercent >= 75 ||
    roomKpis.occupied / Math.max(roomKpis.total, 1) >= 0.75
  ) {
    recommendations.push("dashboard.aiInsights.recommendPricing");
    impacts.push("dashboard.aiInsights.impactHigherRevenue");
  }

  if (newLeads > 0) {
    recommendations.push("dashboard.aiInsights.recommendAutoReplies");
    impacts.push("dashboard.aiInsights.impactFewerUnanswered");
  }

  if (metrics.arrivalsToday > 0) {
    recommendations.push("dashboard.aiInsights.recommendEarlyCheckins");
  }

  const urgentAlert = alerts.find((alert) => alert.severity === "urgent");
  if (urgentAlert) {
    recommendations.unshift("dashboard.aiInsights.recommendInbox");
    impacts.push("dashboard.aiInsights.impactFewerUnanswered");
  }

  if (recommendations.length === 0) {
    return {
      isPlaceholder: true,
      headlineKey: "dashboard.aiInsights.placeholderHeadline",
      recommendationKeys: [
        "dashboard.aiInsights.placeholderRecommendation1",
        "dashboard.aiInsights.placeholderRecommendation2",
      ],
      impactKeys: [
        "dashboard.aiInsights.impactHigherOccupancy",
        "dashboard.aiInsights.impactHigherRevenue",
        "dashboard.aiInsights.impactFewerUnanswered",
      ],
      confidencePercent: 55,
    };
  }

  const uniqueRecommendations = [...new Set(recommendations)].slice(0, 3) as TranslationPath[];
  const uniqueImpacts = [...new Set(impacts)].slice(0, 3) as TranslationPath[];
  const confidencePercent = Math.min(
    95,
    68 +
      (metrics.occupancyPercent > 0 ? 8 : 0) +
      (newLeads > 0 ? 6 : 0) +
      (alerts.length > 0 ? 8 : 0) +
      (metrics.arrivalsToday > 0 ? 5 : 0)
  );

  return {
    isPlaceholder: false,
    headlineKey:
      newLeads > 0
        ? "dashboard.aiInsights.otaDemandHeadline"
        : "dashboard.aiInsights.operationsHeadline",
    recommendationKeys: uniqueRecommendations,
    impactKeys:
      uniqueImpacts.length > 0
        ? uniqueImpacts
        : ["dashboard.aiInsights.impactHigherRevenue"],
    confidencePercent,
  };
}

export function buildHeroExecutiveStatus(
  metrics: DashboardMetrics,
  alerts: DashboardAlert[],
  leads: Lead[],
  bookings: Booking[]
): HeroExecutiveStatus {
  const unreadMessages = leads.filter((lead) => lead.status === "new").length;
  const paymentIssues = bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      derivePaymentStatus(booking) === "pending"
  ).length;
  const alertIssues = alerts.filter(
    (alert) => alert.severity === "urgent" || alert.severity === "warning"
  ).length;
  const criticalIssues = alertIssues + paymentIssues + unreadMessages;

  let hotelHealthKey: TranslationPath = "dashboard.hero.healthGood";
  if (alerts.some((alert) => alert.severity === "urgent") || paymentIssues > 0) {
    hotelHealthKey = "dashboard.hero.healthCritical";
  } else if (criticalIssues > 0 || metrics.departuresToday > 3) {
    hotelHealthKey = "dashboard.hero.healthAttention";
  }

  return {
    occupancyPercent: metrics.occupancyPercent,
    hotelHealthKey,
    arrivalsToday: metrics.arrivalsToday,
    criticalIssues,
  };
}

export function buildTodayOperations(
  metrics: DashboardMetrics,
  leads: Lead[],
  rooms: Room[],
  bookings: Booking[]
): TodayOperationMetric[] {
  const roomModels = buildRoomCardModels(rooms, bookings);
  const roomKpis = computeRoomOpsKpis(roomModels);
  const unreadMessages = leads.filter((lead) => lead.status === "new").length;
  const paymentIssues = bookings.filter(
    (booking) =>
      booking.status !== "cancelled" &&
      derivePaymentStatus(booking) === "pending"
  ).length;
  const housekeeping = metrics.departuresToday + roomKpis.cleaning;

  return [
    {
      key: "arrivals",
      label: "dashboard.todayOps.arrivals",
      value: metrics.arrivalsToday,
      href: "/bookings",
      tone: metrics.arrivalsToday > 0 ? "default" : "default",
    },
    {
      key: "departures",
      label: "dashboard.todayOps.departures",
      value: metrics.departuresToday,
      href: "/calendar",
      tone: metrics.departuresToday > 0 ? "warning" : "default",
    },
    {
      key: "housekeeping",
      label: "dashboard.todayOps.housekeeping",
      value: housekeeping,
      href: "/rooms",
      tone: housekeeping > 0 ? "warning" : "default",
    },
    {
      key: "maintenance",
      label: "dashboard.todayOps.maintenance",
      value: roomKpis.maintenance,
      href: "/rooms",
      tone: roomKpis.maintenance > 0 ? "warning" : "default",
    },
    {
      key: "messages",
      label: "dashboard.todayOps.unreadMessages",
      value: unreadMessages,
      href: "/ai",
      tone: unreadMessages > 0 ? "urgent" : "default",
    },
    {
      key: "payments",
      label: "dashboard.todayOps.paymentIssues",
      value: paymentIssues,
      href: "/bookings",
      tone: paymentIssues > 0 ? "urgent" : "default",
    },
  ];
}

export function buildKpiTrendSeries(
  points: TrendPoint[] | undefined
): number[] {
  if (!points || points.length === 0) return [];
  return points.map((point) => point.value);
}

export function buildKpiTrendDelta(
  points: TrendPoint[] | undefined
): { direction: "up" | "down" | "flat"; percentLabel: string } | null {
  if (!points || points.length < 2) return null;

  const current = points[points.length - 1]?.value ?? 0;
  const previous = points[points.length - 2]?.value ?? 0;

  if (Math.abs(current - previous) < 0.01) {
    return { direction: "flat", percentLabel: "0%" };
  }

  if (previous === 0) {
    return current > 0
      ? { direction: "up", percentLabel: "+100%" }
      : { direction: "flat", percentLabel: "0%" };
  }

  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.abs(delta) < 10 ? delta.toFixed(1) : String(Math.round(delta));

  return {
    direction: delta > 0 ? "up" : "down",
    percentLabel: `${delta > 0 ? "+" : ""}${rounded}%`,
  };
}
