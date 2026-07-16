export type HeroRuntimeNodeId =
  | "website"
  | "booking-com"
  | "telegram"
  | "whatsapp"
  | "email"
  | "phone"
  | "walk-in"
  | "ai-reception"
  | "pms"
  | "revenue"
  | "rooms"
  | "staff"
  | "analytics"
  | "integrations"
  | "runtime";

export type HeroRuntimePhase =
  | "idle"
  | "sourceActive"
  | "inbound"
  | "runtimeActive"
  | "outbound"
  | "destinationActive"
  | "secondarySync"
  | "settling";

export type HeroRuntimeEntrance =
  | "pending"
  | "runtime"
  | "sources"
  | "destinations"
  | "connectors"
  | "complete";

export type HeroRuntimeMetadataId =
  | "one-workspace"
  | "one-ai"
  | "live-data"
  | "security"
  | "real-time"
  | "automation";

export type HeroRuntimeEvent = {
  id: string;
  sourceId: HeroRuntimeNodeId;
  destinationId: HeroRuntimeNodeId;
  inboundPathId: string;
  outboundPathId: string;
  outcome: string;
  /** Short status inside the source node while active. */
  sourceStatus: string;
  /** Optional quiet secondary destination (~25–35% of events). */
  secondaryId?: HeroRuntimeNodeId;
  /** Existing metadata chip that may briefly acknowledge. */
  metadataId?: HeroRuntimeMetadataId;
};

/**
 * Centralized phase durations in milliseconds.
 * Idle 3.5s · Event ~2.1s (includes secondary window) · Cycle ~5.6s
 */
export const HERO_RUNTIME_TIMING = {
  idle: 3500,
  sourceActive: 180,
  inbound: 400,
  runtimeActive: 240,
  outbound: 400,
  destinationActive: 380,
  secondarySync: 300,
  settling: 200,
} as const;

/** One-shot Hero diagram entrance (ms from timeline start). */
export const HERO_RUNTIME_ENTRANCE = {
  runtimeAt: 300,
  sourcesAt: 700,
  destinationsAt: 1100,
  connectorsAt: 1600,
  firstEventAt: 2100,
} as const;

export const HERO_RUNTIME_EVENT_MS =
  HERO_RUNTIME_TIMING.sourceActive +
  HERO_RUNTIME_TIMING.inbound +
  HERO_RUNTIME_TIMING.runtimeActive +
  HERO_RUNTIME_TIMING.outbound +
  HERO_RUNTIME_TIMING.destinationActive +
  HERO_RUNTIME_TIMING.secondarySync +
  HERO_RUNTIME_TIMING.settling;

export const HERO_RUNTIME_CYCLE_MS =
  HERO_RUNTIME_TIMING.idle + HERO_RUNTIME_EVENT_MS;

export const HERO_RUNTIME_ENTRANCE_MS = HERO_RUNTIME_ENTRANCE.firstEventAt;

/**
 * Deterministic events — order and count preserved from v2.
 * Optional secondary/metadata fields add micro-reactions only.
 */
export const HERO_RUNTIME_EVENTS: readonly HeroRuntimeEvent[] = [
  {
    id: "booking-to-pms",
    sourceId: "booking-com",
    destinationId: "pms",
    inboundPathId: "path-booking-com",
    outboundPathId: "path-pms",
    outcome: "Booking synced",
    sourceStatus: "New reservation",
    secondaryId: "analytics",
    metadataId: "live-data",
  },
  {
    id: "booking-to-revenue",
    sourceId: "booking-com",
    destinationId: "revenue",
    inboundPathId: "path-booking-com",
    outboundPathId: "path-revenue",
    outcome: "Revenue refreshed",
    sourceStatus: "New reservation",
    metadataId: "live-data",
  },
  {
    id: "telegram-to-reception",
    sourceId: "telegram",
    destinationId: "ai-reception",
    inboundPathId: "path-telegram",
    outboundPathId: "path-ai-reception",
    outcome: "Guest context updated",
    sourceStatus: "Guest message",
    secondaryId: "staff",
    metadataId: "real-time",
  },
  {
    id: "telegram-to-analytics",
    sourceId: "telegram",
    destinationId: "analytics",
    inboundPathId: "path-telegram",
    outboundPathId: "path-analytics",
    outcome: "Knowledge applied",
    sourceStatus: "Guest message",
    metadataId: "one-ai",
  },
  {
    id: "email-to-revenue",
    sourceId: "email",
    destinationId: "revenue",
    inboundPathId: "path-email",
    outboundPathId: "path-revenue",
    outcome: "Revenue refreshed",
    sourceStatus: "Incoming request",
    metadataId: "live-data",
  },
  {
    id: "email-to-analytics",
    sourceId: "email",
    destinationId: "analytics",
    inboundPathId: "path-email",
    outboundPathId: "path-analytics",
    outcome: "Knowledge applied",
    sourceStatus: "Incoming request",
    metadataId: "one-ai",
  },
  {
    id: "website-to-rooms",
    sourceId: "website",
    destinationId: "rooms",
    inboundPathId: "path-website",
    outboundPathId: "path-rooms",
    outcome: "Room assigned",
    sourceStatus: "Incoming request",
    secondaryId: "pms",
    metadataId: "automation",
  },
  {
    id: "website-to-reception",
    sourceId: "website",
    destinationId: "ai-reception",
    inboundPathId: "path-website",
    outboundPathId: "path-ai-reception",
    outcome: "Request routed",
    sourceStatus: "Incoming request",
    metadataId: "automation",
  },
  {
    id: "phone-to-staff",
    sourceId: "phone",
    destinationId: "staff",
    inboundPathId: "path-phone",
    outboundPathId: "path-staff",
    outcome: "Request routed",
    sourceStatus: "Call received",
    metadataId: "real-time",
  },
  {
    id: "phone-to-reception",
    sourceId: "phone",
    destinationId: "ai-reception",
    inboundPathId: "path-phone",
    outboundPathId: "path-ai-reception",
    outcome: "Guest context updated",
    sourceStatus: "Call received",
    metadataId: "real-time",
  },
  {
    id: "walk-in-to-pms",
    sourceId: "walk-in",
    destinationId: "pms",
    inboundPathId: "path-walk-in",
    outboundPathId: "path-pms",
    outcome: "Booking synced",
    sourceStatus: "Incoming request",
    secondaryId: "analytics",
    metadataId: "live-data",
  },
  {
    id: "booking-to-analytics",
    sourceId: "booking-com",
    destinationId: "analytics",
    inboundPathId: "path-booking-com",
    outboundPathId: "path-analytics",
    outcome: "Request routed",
    sourceStatus: "New reservation",
    metadataId: "automation",
  },
  {
    id: "whatsapp-to-reception",
    sourceId: "whatsapp",
    destinationId: "ai-reception",
    inboundPathId: "path-whatsapp",
    outboundPathId: "path-ai-reception",
    outcome: "Guest context updated",
    sourceStatus: "Guest message",
    metadataId: "security",
  },
  {
    id: "walk-in-to-rooms",
    sourceId: "walk-in",
    destinationId: "rooms",
    inboundPathId: "path-walk-in",
    outboundPathId: "path-rooms",
    outcome: "Room assigned",
    sourceStatus: "Incoming request",
    metadataId: "automation",
  },
] as const;

export type HeroRuntimeSnapshot = {
  phase: HeroRuntimePhase;
  eventIndex: number;
  event: HeroRuntimeEvent;
  sourceId: HeroRuntimeNodeId | null;
  destinationId: HeroRuntimeNodeId | null;
  inboundPathId: string | null;
  outboundPathId: string | null;
  outcome: string | null;
  sourceStatus: string | null;
  secondaryId: HeroRuntimeNodeId | null;
  metadataId: HeroRuntimeMetadataId | null;
  entrance: HeroRuntimeEntrance;
  reducedMotion: boolean;
};

const SOURCE_IDS = new Set<HeroRuntimeNodeId>([
  "website",
  "booking-com",
  "telegram",
  "whatsapp",
  "email",
  "phone",
  "walk-in",
]);

const DESTINATION_IDS = new Set<HeroRuntimeNodeId>([
  "ai-reception",
  "pms",
  "revenue",
  "rooms",
  "staff",
  "analytics",
  "integrations",
]);

const METADATA_IDS = new Set<HeroRuntimeMetadataId>([
  "one-workspace",
  "one-ai",
  "live-data",
  "security",
  "real-time",
  "automation",
]);

export function entranceFromElapsed(elapsedMs: number): HeroRuntimeEntrance {
  const e = HERO_RUNTIME_ENTRANCE;
  if (elapsedMs < e.runtimeAt) return "pending";
  if (elapsedMs < e.sourcesAt) return "runtime";
  if (elapsedMs < e.destinationsAt) return "sources";
  if (elapsedMs < e.connectorsAt) return "destinations";
  if (elapsedMs < e.firstEventAt) return "connectors";
  return "complete";
}

export function getHeroRuntimeIdleSnapshot(
  eventIndex = 0,
  reducedMotion = false,
  entrance: HeroRuntimeEntrance = "complete"
): HeroRuntimeSnapshot {
  const event = HERO_RUNTIME_EVENTS[eventIndex % HERO_RUNTIME_EVENTS.length]!;
  return {
    phase: "idle",
    eventIndex: eventIndex % HERO_RUNTIME_EVENTS.length,
    event,
    sourceId: null,
    destinationId: null,
    inboundPathId: null,
    outboundPathId: null,
    outcome: null,
    sourceStatus: null,
    secondaryId: null,
    metadataId: null,
    entrance,
    reducedMotion,
  };
}

function phaseFromEventElapsed(eventElapsed: number): HeroRuntimePhase {
  const t = HERO_RUNTIME_TIMING;
  let cursor = 0;

  cursor += t.sourceActive;
  if (eventElapsed < cursor) return "sourceActive";

  cursor += t.inbound;
  if (eventElapsed < cursor) return "inbound";

  cursor += t.runtimeActive;
  if (eventElapsed < cursor) return "runtimeActive";

  cursor += t.outbound;
  if (eventElapsed < cursor) return "outbound";

  cursor += t.destinationActive;
  if (eventElapsed < cursor) return "destinationActive";

  cursor += t.secondarySync;
  if (eventElapsed < cursor) return "secondarySync";

  return "settling";
}

function snapshotForEvent(
  eventElapsed: number,
  eventIndex: number,
  entrance: HeroRuntimeEntrance
): HeroRuntimeSnapshot {
  const event = HERO_RUNTIME_EVENTS[eventIndex % HERO_RUNTIME_EVENTS.length]!;
  const phase = phaseFromEventElapsed(eventElapsed);
  const t = HERO_RUNTIME_TIMING;

  const sourceActive =
    phase === "sourceActive" ||
    phase === "inbound" ||
    phase === "runtimeActive" ||
    phase === "outbound" ||
    phase === "destinationActive";

  const outboundStart =
    t.sourceActive + t.inbound + t.runtimeActive;
  const outboundEnd = outboundStart + t.outbound;
  const outboundHoldEnd = outboundEnd + 120;

  const inboundActive = phase === "inbound";
  const outboundActive =
    phase === "outbound" ||
    (phase === "destinationActive" && eventElapsed < outboundHoldEnd);
  const destinationActive = phase === "destinationActive";
  const secondaryActive =
    phase === "secondarySync" && Boolean(event.secondaryId);

  const metadataActive =
    Boolean(event.metadataId) &&
    (phase === "runtimeActive" ||
      phase === "outbound" ||
      phase === "destinationActive" ||
      phase === "secondarySync");

  return {
    phase,
    eventIndex: eventIndex % HERO_RUNTIME_EVENTS.length,
    event,
    sourceId: sourceActive ? event.sourceId : null,
    destinationId: destinationActive ? event.destinationId : null,
    inboundPathId: inboundActive ? event.inboundPathId : null,
    outboundPathId: outboundActive ? event.outboundPathId : null,
    outcome: phase === "destinationActive" ? event.outcome : null,
    sourceStatus: sourceActive ? event.sourceStatus : null,
    secondaryId: secondaryActive ? event.secondaryId! : null,
    metadataId: metadataActive ? event.metadataId! : null,
    entrance,
    reducedMotion: false,
  };
}

/**
 * Pure timeline: entrance once, then first event, then idle↔event cycles.
 */
export function deriveHeroRuntimePlayback(
  elapsedMs: number,
  reducedMotion = false
): HeroRuntimeSnapshot {
  if (reducedMotion) {
    return getHeroRuntimeIdleSnapshot(0, true, "complete");
  }

  const elapsed = Math.max(0, elapsedMs);
  const entrance = entranceFromElapsed(elapsed);

  if (elapsed < HERO_RUNTIME_ENTRANCE_MS) {
    return getHeroRuntimeIdleSnapshot(0, false, entrance);
  }

  const postEntrance = elapsed - HERO_RUNTIME_ENTRANCE_MS;

  if (postEntrance < HERO_RUNTIME_EVENT_MS) {
    return snapshotForEvent(postEntrance, 0, "complete");
  }

  const afterFirst = postEntrance - HERO_RUNTIME_EVENT_MS;
  const cycleIndex = Math.floor(afterFirst / HERO_RUNTIME_CYCLE_MS);
  const within = afterFirst % HERO_RUNTIME_CYCLE_MS;
  const eventIndex = (1 + cycleIndex) % HERO_RUNTIME_EVENTS.length;

  if (within < HERO_RUNTIME_TIMING.idle) {
    return getHeroRuntimeIdleSnapshot(eventIndex, false, "complete");
  }

  return snapshotForEvent(
    within - HERO_RUNTIME_TIMING.idle,
    eventIndex,
    "complete"
  );
}

/** Whether the Runtime node should show acknowledgement emphasis. */
export function isRuntimeHighlighted(phase: HeroRuntimePhase): boolean {
  return (
    phase === "runtimeActive" ||
    phase === "outbound" ||
    phase === "destinationActive"
  );
}

export function heroRuntimeSnapshotsEqual(
  a: HeroRuntimeSnapshot,
  b: HeroRuntimeSnapshot
): boolean {
  return (
    a.phase === b.phase &&
    a.eventIndex === b.eventIndex &&
    a.sourceId === b.sourceId &&
    a.destinationId === b.destinationId &&
    a.inboundPathId === b.inboundPathId &&
    a.outboundPathId === b.outboundPathId &&
    a.outcome === b.outcome &&
    a.sourceStatus === b.sourceStatus &&
    a.secondaryId === b.secondaryId &&
    a.metadataId === b.metadataId &&
    a.entrance === b.entrance &&
    a.reducedMotion === b.reducedMotion
  );
}

export function assertHeroRuntimeEventsValid(): boolean {
  let secondaryCount = 0;

  for (const event of HERO_RUNTIME_EVENTS) {
    if (!SOURCE_IDS.has(event.sourceId)) return false;
    if (!DESTINATION_IDS.has(event.destinationId)) return false;
    if (!event.inboundPathId.startsWith("path-")) return false;
    if (!event.outboundPathId.startsWith("path-")) return false;
    if (!event.outcome.trim()) return false;
    if (!event.sourceStatus.trim()) return false;
    if (event.secondaryId) {
      if (!DESTINATION_IDS.has(event.secondaryId)) return false;
      if (event.secondaryId === event.destinationId) return false;
      secondaryCount += 1;
    }
    if (event.metadataId && !METADATA_IDS.has(event.metadataId)) return false;
  }

  const ratio = secondaryCount / HERO_RUNTIME_EVENTS.length;
  if (ratio < 0.25 || ratio > 0.35) return false;

  return true;
}

/** Path ids used by the diagram connectors (for geometry regression checks). */
export const HERO_RUNTIME_CONNECTOR_PATH_IDS = [
  "path-website",
  "path-booking-com",
  "path-telegram",
  "path-whatsapp",
  "path-email",
  "path-phone",
  "path-walk-in",
  "path-ai-reception",
  "path-pms",
  "path-revenue",
  "path-rooms",
  "path-staff",
  "path-analytics",
  "path-integrations",
] as const;
