"use client";

import { useSyncExternalStore } from "react";

export type MockHotelRuntimeEventType =
  | "message"
  | "knowledge"
  | "upsell"
  | "booking"
  | "payment"
  | "room"
  | "housekeeping"
  | "sync";

export type MockHotelRuntimePhase =
  | "detecting"
  | "thinking"
  | "acting"
  | "completed";

export type MockHotelRuntimeState = {
  tick: number;
  phase: MockHotelRuntimePhase;
  story: {
    title: string;
    summary: string;
    step: number;
    totalSteps: number;
  };
  hotel: {
    name: string;
    rooms: number;
    occupancy: number;
  };
  guest: {
    name: string;
    room: string;
    reservation: string;
    channel: string;
  };
  metrics: {
    aiResolutionRate: number;
    revenueToday: number;
    guestRating: number;
    openTasks: number;
  };
  previousMetrics: {
    aiResolutionRate: number;
    revenueToday: number;
    guestRating: number;
    openTasks: number;
  };
  revenue: {
    today: number;
    delta: number;
    forecast: number;
  };
  booking: {
    status: "Pending" | "Confirmed" | "Checked in";
    dates: string;
    amount: number;
    isNew: boolean;
  };
  room: {
    number: string;
    status: "Ready" | "Occupied" | "Cleaning" | "Maintenance";
    previousStatus: "Ready" | "Occupied" | "Cleaning" | "Maintenance";
  };
  calendar: {
    startDay: number;
    nights: number;
    highlighted: boolean;
  };
  knowledge: {
    activeArticle: string;
    matched: boolean;
    usedJustNow: boolean;
  };
  ai: {
    statusLabel: string;
    actionLabel: string;
    actionDetail: string;
    completedSteps: number;
    totalSteps: number;
    responseTimeSeconds: number;
  };
  event: {
    id: string;
    type: MockHotelRuntimeEventType;
    title: string;
    detail: string;
    amount?: number;
    status: "detected" | "processing" | "completed";
  };
};

const FRAMES: readonly MockHotelRuntimeState[] = [
  {
    tick: 0,
    phase: "detecting",
    story: {
      title: "Early check-in request",
      summary: "AI resolves a guest request and creates incremental revenue.",
      step: 1,
      totalSteps: 4,
    },
    hotel: { name: "Monavel Grand", rooms: 24, occupancy: 83 },
    guest: {
      name: "Maria Thompson",
      room: "Deluxe 407",
      reservation: "48291",
      channel: "WhatsApp",
    },
    metrics: {
      aiResolutionRate: 94,
      revenueToday: 8400,
      guestRating: 4.8,
      openTasks: 12,
    },
    previousMetrics: {
      aiResolutionRate: 94,
      revenueToday: 8400,
      guestRating: 4.8,
      openTasks: 12,
    },
    revenue: { today: 8400, delta: 0, forecast: 16420 },
    booking: {
      status: "Confirmed",
      dates: "15–18 Jul",
      amount: 840,
      isNew: false,
    },
    room: {
      number: "407",
      status: "Ready",
      previousStatus: "Ready",
    },
    calendar: {
      startDay: 2,
      nights: 4,
      highlighted: true,
    },
    knowledge: {
      activeArticle: "Early check-in policy",
      matched: false,
      usedJustNow: false,
    },
    ai: {
      statusLabel: "Request detected",
      actionLabel: "Reading guest request",
      actionDetail: "Early check-in request received via WhatsApp",
      completedSteps: 0,
      totalSteps: 3,
      responseTimeSeconds: 0,
    },
    event: {
      id: "guest-message-48291",
      type: "message",
      title: "Guest question detected",
      detail: "WhatsApp · early check-in request",
      status: "detected",
    },
  },
  {
    tick: 1,
    phase: "thinking",
    story: {
      title: "Early check-in request",
      summary: "AI resolves a guest request and creates incremental revenue.",
      step: 2,
      totalSteps: 4,
    },
    hotel: { name: "Monavel Grand", rooms: 24, occupancy: 83 },
    guest: {
      name: "Maria Thompson",
      room: "Deluxe 407",
      reservation: "48291",
      channel: "WhatsApp",
    },
    metrics: {
      aiResolutionRate: 95,
      revenueToday: 8400,
      guestRating: 4.8,
      openTasks: 11,
    },
    previousMetrics: {
      aiResolutionRate: 94,
      revenueToday: 8400,
      guestRating: 4.8,
      openTasks: 12,
    },
    revenue: { today: 8400, delta: 0, forecast: 16420 },
    booking: {
      status: "Confirmed",
      dates: "15–18 Jul",
      amount: 840,
      isNew: false,
    },
    room: {
      number: "407",
      status: "Ready",
      previousStatus: "Ready",
    },
    calendar: {
      startDay: 2,
      nights: 4,
      highlighted: true,
    },
    knowledge: {
      activeArticle: "Early check-in policy",
      matched: true,
      usedJustNow: true,
    },
    ai: {
      statusLabel: "AI thinking",
      actionLabel: "Knowledge matched",
      actionDetail: "Policy, room readiness, and guest preference checked",
      completedSteps: 1,
      totalSteps: 3,
      responseTimeSeconds: 4,
    },
    event: {
      id: "knowledge-match-48291",
      type: "knowledge",
      title: "Hotel knowledge matched",
      detail: "Policy · availability · guest preference",
      status: "processing",
    },
  },
  {
    tick: 2,
    phase: "acting",
    story: {
      title: "Early check-in request",
      summary: "AI resolves a guest request and creates incremental revenue.",
      step: 3,
      totalSteps: 4,
    },
    hotel: { name: "Monavel Grand", rooms: 24, occupancy: 83 },
    guest: {
      name: "Maria Thompson",
      room: "Deluxe 407",
      reservation: "48291",
      channel: "WhatsApp",
    },
    metrics: {
      aiResolutionRate: 95,
      revenueToday: 8438,
      guestRating: 4.8,
      openTasks: 10,
    },
    previousMetrics: {
      aiResolutionRate: 95,
      revenueToday: 8400,
      guestRating: 4.8,
      openTasks: 11,
    },
    revenue: { today: 8438, delta: 38, forecast: 16458 },
    booking: {
      status: "Confirmed",
      dates: "15–18 Jul",
      amount: 878,
      isNew: false,
    },
    room: {
      number: "407",
      status: "Ready",
      previousStatus: "Ready",
    },
    calendar: {
      startDay: 2,
      nights: 4,
      highlighted: true,
    },
    knowledge: {
      activeArticle: "Late checkout pricing",
      matched: true,
      usedJustNow: true,
    },
    ai: {
      statusLabel: "AI acting",
      actionLabel: "Offer accepted",
      actionDetail: "Guaranteed early access added to reservation",
      completedSteps: 2,
      totalSteps: 3,
      responseTimeSeconds: 9,
    },
    event: {
      id: "upsell-48291",
      type: "upsell",
      title: "Early access accepted",
      detail: "Maria Thompson · Room 407",
      amount: 38,
      status: "processing",
    },
  },
  {
    tick: 3,
    phase: "completed",
    story: {
      title: "Early check-in request",
      summary: "AI resolves a guest request and creates incremental revenue.",
      step: 4,
      totalSteps: 4,
    },
    hotel: { name: "Monavel Grand", rooms: 24, occupancy: 87 },
    guest: {
      name: "Maria Thompson",
      room: "Deluxe 407",
      reservation: "48291",
      channel: "WhatsApp",
    },
    metrics: {
      aiResolutionRate: 96,
      revenueToday: 8438,
      guestRating: 4.9,
      openTasks: 9,
    },
    previousMetrics: {
      aiResolutionRate: 95,
      revenueToday: 8438,
      guestRating: 4.8,
      openTasks: 10,
    },
    revenue: { today: 8438, delta: 38, forecast: 16458 },
    booking: {
      status: "Checked in",
      dates: "15–18 Jul",
      amount: 878,
      isNew: false,
    },
    room: {
      number: "407",
      status: "Occupied",
      previousStatus: "Ready",
    },
    calendar: {
      startDay: 2,
      nights: 4,
      highlighted: true,
    },
    knowledge: {
      activeArticle: "Early check-in policy",
      matched: true,
      usedJustNow: false,
    },
    ai: {
      statusLabel: "Completed",
      actionLabel: "Stay updated",
      actionDetail: "PMS synchronized and guest notified",
      completedSteps: 3,
      totalSteps: 3,
      responseTimeSeconds: 14,
    },
    event: {
      id: "check-in-48291",
      type: "sync",
      title: "Guest checked in",
      detail: "Room 407 · PMS synchronized",
      status: "completed",
    },
  },
];

const FRAME_INTERVAL_MS = 2700;

let frameIndex = 0;
let state = FRAMES[0];
let intervalId: number | null = null;
let isPaused = false;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function advanceRuntime() {
  if (isPaused) return;

  frameIndex = (frameIndex + 1) % FRAMES.length;
  state = FRAMES[frameIndex] ?? FRAMES[0];
  emitChange();
}

function startRuntime() {
  if (typeof window === "undefined" || intervalId !== null) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  intervalId = window.setInterval(advanceRuntime, FRAME_INTERVAL_MS);
}

function stopRuntime() {
  if (intervalId === null) return;

  window.clearInterval(intervalId);
  intervalId = null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    startRuntime();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      stopRuntime();
    }
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return FRAMES[0];
}

export function useMockHotelRuntime(): MockHotelRuntimeState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setMockHotelRuntimePaused(paused: boolean): void {
  isPaused = paused;
}

export function formatMockRevenue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getMockMetricDirection(
  current: number,
  previous: number
): "up" | "down" | "stable" {
  if (current > previous) return "up";
  if (current < previous) return "down";

  return "stable";
}
