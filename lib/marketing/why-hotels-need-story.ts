import type {
  ChannelIconId,
  CommunicationCard,
  HotelDataCard,
  OperationsCard,
  RevenueCard,
} from "@/lib/marketing/why-hotels-need";
import {
  COMMUNICATION_CARD,
  HOTEL_DATA_CARD,
  OPERATIONS_CARD,
  REVENUE_CARD,
} from "@/lib/marketing/why-hotels-need";

/**
 * Story acts:
 * fragmented → propagation → runtime moment → still synchronized → soft crossfade
 */
export type WhyNeedPhase =
  | "fragmented"
  | "propagating"
  | "runtimeMoment"
  | "synchronized"
  | "crossfade";

export type WhyNeedCardId =
  | "communication"
  | "hotel-data"
  | "operations"
  | "revenue";

/** Visual hierarchy roles for the four system cards. */
export type WhyNeedCardRole =
  | "active"
  | "related"
  | "inactive"
  | "isolated"
  | "aligned"
  | "synced"
  | "fading";

/**
 * One shared reservation object referenced by every card in a cycle.
 * Never invent independent guest/room/reservation values per card.
 */
export type SharedGuestIdentity = {
  guestName: string;
  reservationId: string;
  room: string;
  status: string;
  timestamp: string;
};

export const WHY_NEED_TIMING = {
  /** Act 1 — fragmented systems. */
  idle: 2200,
  /** Act 2 — one-at-a-time propagation. Ends at t=4000ms. */
  propagation: 1800,
  /** Act 3 — Runtime Moment: all cards briefly share one reality. */
  runtimeMoment: 280,
  /** Act 4 — hotel simply operating. Completely still. */
  still: 2000,
  /** Soft loop: current reservation fades before the next appears. */
  crossfade: 720,
} as const;

export const WHY_NEED_CYCLE_MS =
  WHY_NEED_TIMING.idle +
  WHY_NEED_TIMING.propagation +
  WHY_NEED_TIMING.runtimeMoment +
  WHY_NEED_TIMING.still +
  WHY_NEED_TIMING.crossfade;

/** Propagation path: Communication → Hotel Data → Operations → Revenue. */
export const WHY_NEED_PROPAGATION_ORDER = [
  "communication",
  "hotel-data",
  "operations",
  "revenue",
] as const satisfies readonly WhyNeedCardId[];

const STEP_MS = WHY_NEED_TIMING.propagation / WHY_NEED_PROPAGATION_ORDER.length;

type GuestEventDef = {
  id: string;
  label: string;
  identity: SharedGuestIdentity;
  channelId: ChannelIconId;
  message: string;
  chip: string;
  hubStatus: string;
  footerLabel: string;
  opsFocus: string;
  opsRoomNote: string;
  opsRoomStatus: string;
  dataActivity: string;
  revenueDemand: string;
  revenueImpact: string;
  summary: string;
};

/**
 * Eight deterministic reservations. Same guest; distinct shared objects per cycle.
 */
export const WHY_NEED_EVENTS: readonly GuestEventDef[] = [
  {
    id: "invoice",
    label: "Guest requests invoice",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48291",
      room: "407",
      status: "Late check-in",
      timestamp: "23:18",
    },
    channelId: "email",
    message: "Request invoice",
    chip: "Invoice",
    hubStatus: "Understanding guest intent…",
    footerLabel: "Guest profile updated",
    opsFocus: "Ready for check-in",
    opsRoomNote: "Invoice queued for arrival",
    opsRoomStatus: "Ready",
    dataActivity: "Guest profile updated",
    revenueDemand: "Billing request logged",
    revenueImpact: "+$0 hold",
    summary:
      "An invoice request for Maria Thompson reservation 48291 synchronizes across communication, hotel data, operations, and revenue.",
  },
  {
    id: "late-check-in",
    label: "Late check-in",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48302",
      room: "407",
      status: "Late check-in",
      timestamp: "22:41",
    },
    channelId: "whatsapp",
    message: "Arriving after midnight",
    chip: "Late arrival",
    hubStatus: "Late arrival confirmed…",
    footerLabel: "Arrival window updated",
    opsFocus: "Housekeeping assigned",
    opsRoomNote: "Hold room past midnight",
    opsRoomStatus: "Holding",
    dataActivity: "Booking imported",
    revenueDemand: "Late arrival noted",
    revenueImpact: "ADR held",
    summary:
      "A late check-in for reservation 48302 updates Maria Thompson across every hotel system.",
  },
  {
    id: "parking",
    label: "Parking request",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48317",
      room: "407",
      status: "Parking requested",
      timestamp: "21:06",
    },
    channelId: "telegram",
    message: "Need parking",
    chip: "Parking requested",
    hubStatus: "Parking request received…",
    footerLabel: "Guest preference saved",
    opsFocus: "Ready for check-in",
    opsRoomNote: "Parking space reserved",
    opsRoomStatus: "Ready",
    dataActivity: "Room status changed",
    revenueDemand: "Ancillary request",
    revenueImpact: "+$18 parking",
    summary:
      "A parking request for reservation 48317 propagates into one shared guest object.",
  },
  {
    id: "upgrade",
    label: "Room upgrade",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48344",
      room: "412",
      status: "Upgrade requested",
      timestamp: "19:22",
    },
    channelId: "booking",
    message: "Can I upgrade my room?",
    chip: "Upgrade requested",
    hubStatus: "Upgrade request received…",
    footerLabel: "Guest request logged",
    opsFocus: "Room cleaned",
    opsRoomNote: "Suite 412 offered",
    opsRoomStatus: "Preparing",
    dataActivity: "Booking imported",
    revenueDemand: "Upsell opportunity",
    revenueImpact: "+$64 ADR",
    summary:
      "A room upgrade for reservation 48344 updates the same guest, room, and revenue state.",
  },
  {
    id: "transfer",
    label: "Airport transfer",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48361",
      room: "407",
      status: "Transfer requested",
      timestamp: "18:05",
    },
    channelId: "email",
    message: "Need airport transfer",
    chip: "Transfer",
    hubStatus: "Transfer request received…",
    footerLabel: "Guest service queued",
    opsFocus: "Housekeeping assigned",
    opsRoomNote: "Driver assigned 16:40",
    opsRoomStatus: "Ready",
    dataActivity: "Guest profile updated",
    revenueDemand: "Service add-on",
    revenueImpact: "+$42 transfer",
    summary:
      "An airport transfer for reservation 48361 synchronizes guest services across the hotel.",
  },
  {
    id: "breakfast",
    label: "Breakfast request",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48378",
      room: "407",
      status: "Breakfast added",
      timestamp: "07:14",
    },
    channelId: "whatsapp",
    message: "Add breakfast for two",
    chip: "Breakfast",
    hubStatus: "Breakfast request received…",
    footerLabel: "Guest preference saved",
    opsFocus: "Ready for check-in",
    opsRoomNote: "Breakfast package added",
    opsRoomStatus: "Ready",
    dataActivity: "Revenue synced",
    revenueDemand: "F&B attach rate",
    revenueImpact: "+$36 F&B",
    summary:
      "A breakfast request for reservation 48378 updates one shared guest object everywhere.",
  },
  {
    id: "cancellation",
    label: "Cancellation",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48390",
      room: "407",
      status: "Cancellation",
      timestamp: "14:33",
    },
    channelId: "booking",
    message: "Please cancel my stay",
    chip: "Cancellation",
    hubStatus: "Cancellation received…",
    footerLabel: "Guest status updated",
    opsFocus: "Booking confirmed",
    opsRoomNote: "Room 407 released",
    opsRoomStatus: "Vacant",
    dataActivity: "Room status changed",
    revenueDemand: "Inventory freed",
    revenueImpact: "−1 reservation",
    summary:
      "A cancellation for reservation 48390 propagates through every system as one object.",
  },
  {
    id: "early-check-in",
    label: "Early check-in",
    identity: {
      guestName: "Maria Thompson",
      reservationId: "48405",
      room: "407",
      status: "Early check-in",
      timestamp: "09:48",
    },
    channelId: "telegram",
    message: "Can I check in at 11?",
    chip: "Early check-in",
    hubStatus: "Early check-in requested…",
    footerLabel: "Arrival window updated",
    opsFocus: "Room cleaned",
    opsRoomNote: "Priority clean for 11:00",
    opsRoomStatus: "Cleaning",
    dataActivity: "Booking imported",
    revenueDemand: "Early arrival fee",
    revenueImpact: "+$25 early",
    summary:
      "An early check-in for reservation 48405 updates communication, data, operations, and revenue together.",
  },
] as const;

export type WhyNeedStorySnapshot = {
  eventIndex: number;
  eventId: string;
  eventLabel: string;
  phase: WhyNeedPhase;
  activeCard: WhyNeedCardId | null;
  propagationStep: number;
  runtimeMoment: boolean;
  still: boolean;
  identity: SharedGuestIdentity;
  identityOpacity: number;
  identityVisible: boolean;
  cardRoles: Record<WhyNeedCardId, WhyNeedCardRole>;
  communication: CommunicationCard;
  operations: OperationsCard;
  hotelData: HotelDataCard;
  revenue: RevenueCard;
};

function buildFragmentedCommunication(event: GuestEventDef): CommunicationCard {
  return {
    ...COMMUNICATION_CARD,
    guestName: "—",
    guestStatus: "Unlinked",
    messages: [
      { time: "20:38", channelId: "booking", text: "Confirm room type" },
      { time: "21:02", channelId: "email", text: "Receipt from last stay" },
    ],
    hubStatus: "Channels disconnected",
    contextChips: ["No shared context"],
    footerLabel: "No sync",
    footerTime: "—",
    summary: event.summary,
  };
}

function buildSyncedCommunication(event: GuestEventDef): CommunicationCard {
  const { identity } = event;
  const supportingMessage =
    event.id === "invoice" || event.id === "late-check-in"
      ? {
          time: "",
          channelId: "whatsapp" as const,
          text: "Arriving after midnight",
        }
      : event.id === "parking" || event.id === "transfer"
        ? {
            time: "",
            channelId: "booking" as const,
            text: "Can I check in late?",
          }
        : {
            time: "",
            channelId: "whatsapp" as const,
            text: "Arriving after midnight",
          };

  return {
    ...COMMUNICATION_CARD,
    guestName: identity.guestName,
    guestStatus: "VIP",
    messages: [
      supportingMessage,
      { time: identity.timestamp, channelId: event.channelId, text: event.message },
    ],
    hubStatus: "Understanding guest context",
    contextChips: [identity.status, event.chip].filter(
      (chip, index, list) => list.indexOf(chip) === index
    ),
    footerLabel: event.footerLabel,
    footerTime: identity.timestamp,
    summary: event.summary,
  };
}

const OPERATIONS_MILESTONES = OPERATIONS_CARD.stages.filter(
  (stage) => stage.label !== "Room inspected"
);

function buildFragmentedOperations(): OperationsCard {
  return {
    ...OPERATIONS_CARD,
    stages: OPERATIONS_MILESTONES.map((stage, index) => {
      if (index <= 1) return { ...stage, state: "completed" as const, time: "" };
      if (index === 2) return { ...stage, state: "current" as const, time: "—" };
      return { ...stage, state: "upcoming" as const, time: "—" };
    }),
    roomLabel: "Room —",
    roomStatus: "Unknown",
    roomNote: "Waiting on other systems",
  };
}

function buildSyncedOperations(event: GuestEventDef): OperationsCard {
  const { identity } = event;
  const focusIndex = Math.max(
    0,
    OPERATIONS_MILESTONES.findIndex((stage) => stage.label === event.opsFocus)
  );

  return {
    ...OPERATIONS_CARD,
    stages: OPERATIONS_MILESTONES.map((stage, index) => {
      if (index < focusIndex) {
        return { ...stage, state: "completed" as const, time: "" };
      }
      if (index === focusIndex) {
        return { ...stage, state: "current" as const, time: identity.timestamp };
      }
      return { ...stage, state: "upcoming" as const, time: "—" };
    }),
    roomLabel: `Room ${identity.room}`,
    roomStatus: event.opsRoomStatus,
    roomNote: event.opsRoomNote,
    summary: event.summary,
  };
}

function buildFragmentedHotelData(): HotelDataCard {
  return {
    ...HOTEL_DATA_CARD,
    hubStatus: "Systems not synced",
    activities: [
      { label: "Stale PMS export", time: "" },
      { label: "CRM pending", time: "" },
      { label: "Calendar offline", time: "" },
    ],
    footerTime: "—",
    syncLabel: "No sync",
  };
}

function buildSyncedHotelData(event: GuestEventDef): HotelDataCard {
  const { identity } = event;
  return {
    ...HOTEL_DATA_CARD,
    hubStatus: "All systems synced",
    activities: [
      { label: `Reservation #${identity.reservationId} synced`, time: "" },
      { label: "Guest profile updated", time: "" },
      { label: `Room ${identity.room} synced`, time: identity.timestamp },
    ],
    footerTime: identity.timestamp,
    syncLabel: "Live sync",
    summary: event.summary,
  };
}

function buildFragmentedRevenue(): RevenueCard {
  return {
    ...REVENUE_CARD,
    kpis: [{ label: "Current ADR", value: REVENUE_CARD.adrCurrent }],
    demandLabel: "No shared demand signal",
    adrRecommended: REVENUE_CARD.adrCurrent,
    confidencePercent: 0,
    impactValue: "—",
    impactDelta: "Waiting on reservation",
    actionTimer: "—",
    chartPoints: [22, 24, 23, 25, 24, 26, 25, 26, 27],
  };
}

function buildSyncedRevenue(event: GuestEventDef): RevenueCard {
  const { identity } = event;
  return {
    ...REVENUE_CARD,
    kpis: [{ label: "Current ADR", value: REVENUE_CARD.adrCurrent }],
    demandLabel: event.revenueDemand,
    confidencePercent: 0,
    impactValue: event.revenueImpact,
    impactDelta: `Reservation #${identity.reservationId}`,
    actionLabel: "Reservation context",
    actionTimer: `Room ${identity.room}`,
    summary: event.summary,
  };
}

function rolesForPhase(
  phase: WhyNeedPhase,
  activeCard: WhyNeedCardId | null,
  step: number
): Record<WhyNeedCardId, WhyNeedCardRole> {
  if (phase === "fragmented") {
    return {
      communication: "isolated",
      "hotel-data": "isolated",
      operations: "isolated",
      revenue: "isolated",
    };
  }

  if (phase === "runtimeMoment") {
    return {
      communication: "aligned",
      "hotel-data": "aligned",
      operations: "aligned",
      revenue: "aligned",
    };
  }

  if (phase === "synchronized") {
    return {
      communication: "synced",
      "hotel-data": "synced",
      operations: "synced",
      revenue: "synced",
    };
  }

  if (phase === "crossfade") {
    return {
      communication: "fading",
      "hotel-data": "fading",
      operations: "fading",
      revenue: "fading",
    };
  }

  const roles: Record<WhyNeedCardId, WhyNeedCardRole> = {
    communication: "inactive",
    "hotel-data": "inactive",
    operations: "inactive",
    revenue: "inactive",
  };

  for (let index = 0; index < WHY_NEED_PROPAGATION_ORDER.length; index += 1) {
    const cardId = WHY_NEED_PROPAGATION_ORDER[index];
    if (!cardId) continue;
    if (index === step) {
      roles[cardId] = "active";
    } else if (index < step) {
      roles[cardId] = "related";
    }
  }

  if (activeCard) {
    roles[activeCard] = "active";
  }

  return roles;
}

function viewsForEvent(
  event: GuestEventDef,
  phase: WhyNeedPhase,
  step: number
): Pick<
  WhyNeedStorySnapshot,
  "communication" | "operations" | "hotelData" | "revenue"
> {
  const fragmented = {
    communication: buildFragmentedCommunication(event),
    operations: buildFragmentedOperations(),
    hotelData: buildFragmentedHotelData(),
    revenue: buildFragmentedRevenue(),
  };

  const synced = {
    communication: buildSyncedCommunication(event),
    operations: buildSyncedOperations(event),
    hotelData: buildSyncedHotelData(event),
    revenue: buildSyncedRevenue(event),
  };

  if (phase === "fragmented") return fragmented;
  if (
    phase === "synchronized" ||
    phase === "runtimeMoment" ||
    phase === "crossfade"
  ) {
    return synced;
  }

  return {
    communication: step >= 0 ? synced.communication : fragmented.communication,
    hotelData: step >= 1 ? synced.hotelData : fragmented.hotelData,
    operations: step >= 2 ? synced.operations : fragmented.operations,
    revenue: step >= 3 ? synced.revenue : fragmented.revenue,
  };
}

function identityPresence(
  phase: WhyNeedPhase,
  step: number,
  crossfadeProgress: number
): { identityVisible: boolean; identityOpacity: number } {
  if (phase === "fragmented") {
    return { identityVisible: false, identityOpacity: 0 };
  }
  if (phase === "propagating") {
    const opacity = Math.min(1, 0.45 + (step + 1) * 0.14);
    return { identityVisible: true, identityOpacity: opacity };
  }
  if (phase === "runtimeMoment" || phase === "synchronized") {
    return { identityVisible: true, identityOpacity: 1 };
  }
  // crossfade: fade shared reservation out before the next cycle
  const stepped = Math.round(Math.max(0, 1 - crossfadeProgress) * 20) / 20;
  return {
    identityVisible: stepped > 0,
    identityOpacity: stepped,
  };
}

export function getWhyNeedEventCount(): number {
  return WHY_NEED_EVENTS.length;
}

function snapshotFor(
  event: GuestEventDef,
  eventIndex: number,
  phase: WhyNeedPhase,
  activeCard: WhyNeedCardId | null,
  step: number,
  crossfadeProgress = 0
): WhyNeedStorySnapshot {
  const views = viewsForEvent(event, phase, step);
  const presence = identityPresence(phase, step, crossfadeProgress);
  return {
    eventIndex,
    eventId: event.id,
    eventLabel: event.label,
    phase,
    activeCard,
    propagationStep: step,
    runtimeMoment: phase === "runtimeMoment",
    still: phase === "synchronized",
    identity: event.identity,
    identityOpacity: presence.identityOpacity,
    identityVisible: presence.identityVisible,
    cardRoles: rolesForPhase(phase, activeCard, step),
    ...views,
  };
}

export function getWhyNeedStaticSnapshot(
  eventIndex = 0
): WhyNeedStorySnapshot {
  const index =
    ((eventIndex % WHY_NEED_EVENTS.length) + WHY_NEED_EVENTS.length) %
    WHY_NEED_EVENTS.length;
  const event = WHY_NEED_EVENTS[index] ?? WHY_NEED_EVENTS[0];
  if (!event) {
    throw new Error("WHY_NEED_EVENTS is empty");
  }
  return snapshotFor(event, index, "synchronized", null, -1);
}

/**
 * Pure timeline: maps elapsed ms to one deterministic story cycle.
 */
export function deriveWhyNeedStory(elapsedMs: number): WhyNeedStorySnapshot {
  const safeElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const cycleIndex = Math.floor(safeElapsed / WHY_NEED_CYCLE_MS);
  const t = safeElapsed % WHY_NEED_CYCLE_MS;
  const eventIndex = cycleIndex % WHY_NEED_EVENTS.length;
  const event = WHY_NEED_EVENTS[eventIndex] ?? WHY_NEED_EVENTS[0];
  if (!event) {
    throw new Error("WHY_NEED_EVENTS is empty");
  }

  const propEnd = WHY_NEED_TIMING.idle + WHY_NEED_TIMING.propagation;
  const momentEnd = propEnd + WHY_NEED_TIMING.runtimeMoment;
  const stillEnd = momentEnd + WHY_NEED_TIMING.still;

  if (t < WHY_NEED_TIMING.idle) {
    return snapshotFor(event, eventIndex, "fragmented", null, -1);
  }

  if (t < propEnd) {
    const local = t - WHY_NEED_TIMING.idle;
    const step = Math.min(
      WHY_NEED_PROPAGATION_ORDER.length - 1,
      Math.floor(local / STEP_MS)
    );
    const activeCard = WHY_NEED_PROPAGATION_ORDER[step] ?? "communication";
    return snapshotFor(event, eventIndex, "propagating", activeCard, step);
  }

  if (t < momentEnd) {
    return snapshotFor(event, eventIndex, "runtimeMoment", null, 3);
  }

  if (t < stillEnd) {
    return snapshotFor(event, eventIndex, "synchronized", null, -1);
  }

  const crossfadeProgress =
    (t - stillEnd) / Math.max(1, WHY_NEED_TIMING.crossfade);
  return snapshotFor(
    event,
    eventIndex,
    "crossfade",
    null,
    -1,
    Math.min(1, crossfadeProgress)
  );
}

export function whyNeedSnapshotsEqual(
  a: WhyNeedStorySnapshot,
  b: WhyNeedStorySnapshot
): boolean {
  return (
    a.eventIndex === b.eventIndex &&
    a.eventId === b.eventId &&
    a.phase === b.phase &&
    a.activeCard === b.activeCard &&
    a.propagationStep === b.propagationStep &&
    a.runtimeMoment === b.runtimeMoment &&
    a.still === b.still &&
    a.identity.reservationId === b.identity.reservationId &&
    a.identity.timestamp === b.identity.timestamp &&
    a.identityOpacity === b.identityOpacity &&
    a.identityVisible === b.identityVisible &&
    a.communication.hubStatus === b.communication.hubStatus &&
    a.communication.footerTime === b.communication.footerTime &&
    a.communication.messages[a.communication.messages.length - 1]?.text ===
      b.communication.messages[b.communication.messages.length - 1]?.text &&
    a.operations.roomLabel === b.operations.roomLabel &&
    a.operations.roomNote === b.operations.roomNote &&
    a.operations.roomStatus === b.operations.roomStatus &&
    a.hotelData.hubStatus === b.hotelData.hubStatus &&
    a.hotelData.footerTime === b.hotelData.footerTime &&
    a.revenue.demandLabel === b.revenue.demandLabel &&
    a.revenue.impactValue === b.revenue.impactValue &&
    a.cardRoles.communication === b.cardRoles.communication &&
    a.cardRoles["hotel-data"] === b.cardRoles["hotel-data"] &&
    a.cardRoles.operations === b.cardRoles.operations &&
    a.cardRoles.revenue === b.cardRoles.revenue
  );
}
