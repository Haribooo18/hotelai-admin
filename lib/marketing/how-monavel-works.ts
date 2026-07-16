export type AiWorkspaceState =
  | "understanding"
  | "decision"
  | "execution"
  | "completed";

export type SystemNodeStatus = "pending" | "processing" | "completed";

export type HotelSystemNode = {
  id: string;
  name: string;
  outcome: string;
  time: string;
  status: SystemNodeStatus;
};

export const HOW_MONAVEL_WORKS_CONTENT = {
  sectionId: "how-monavel-works",
  headlineLines: ["One request", "Entire hotel ready"] as const,
  subhead:
    "One guest request. The Runtime builds one operational understanding. Every connected system stays aligned.",
  runtimeSupport:
    "Built from live reservations, hotel operations, business rules, and connected systems.",
  defaultAiState: "completed" as AiWorkspaceState,
} as const;

export const GUEST_REQUEST = {
  guestName: "Maria Thompson",
  channel: "Email",
  time: "23:18",
  message: "Request invoice",
  contextNotes: [
    "Late arrival",
    "Parking requested",
    "Invoice requested",
  ] as const,
  summary:
    "Guest request from Maria Thompson via Email: Request invoice.",
} as const;

/** Guest context signals — shared across Runtime panels. */
export const AI_DETECTED = [
  "Late arrival",
  "Parking requested",
  "Invoice requested",
] as const;

/** Runtime understanding steps — one operational understanding. */
export const AI_OPERATION_PLAN = [
  "Understanding guest context",
  "Building one operational understanding",
  "One operational understanding established",
] as const;

export const AI_WORKSPACE = {
  title: "Monavel AI",
  guestLabel: "Guest",
  guestName: "Maria Thompson",
  room: "Room 407",
  contextLabel: "Guest Context",
  runtimeLabel: "Runtime",
  readyLabel: "Status",
  runtimeLine: "Understanding guest context",
  detectedLabel: "Guest Context",
  planLabel: "Runtime",
  statusLabel: "Status",
  states: {
    understanding: {
      label: "Understanding",
      footer: "Understanding guest context",
      statusLine: "Understanding guest context",
      needs: [
        "Reservation found",
        "Late arrival detected",
        "Parking requested",
        "Invoice requested",
      ] as const,
    },
    decision: {
      label: "Understanding",
      footer: "One operational understanding established",
      statusLine: "One operational understanding established",
      operationLabel: "Runtime",
      reasoning: [
        "Reservation located",
        "Late-arrival policy applies",
        "Parking available",
        "Invoice requested",
        "Operational understanding ready",
      ] as const,
      actions: [
        "Understanding guest context",
        "Building one operational understanding",
        "One operational understanding established",
        "Hotel systems ready to align",
      ] as const,
    },
    execution: {
      label: "Syncing",
      footer: "Hotel systems syncing",
      statusLine: "Hotel systems syncing",
      progress: "One operational understanding established",
      currentTarget: "Hotel",
      planReference: "Shared reservation context",
      status: "Hotel systems syncing",
    },
    completed: {
      label: "Live",
      footer: "Everything ready for arrival",
      reservation: "Reservation located",
      executedLabel: "Runtime",
      executed: [
        "Guest context synced",
        "Hotel systems aligned",
        "Reservation aware",
      ] as const,
      title: "Everything ready for arrival",
      line: "Guest context synced",
    },
  },
} as const;

export const HOTEL_SYSTEMS: readonly HotelSystemNode[] = [
  {
    id: "pms",
    name: "PMS",
    outcome: "Updated",
    time: "23:18:02",
    status: "completed",
  },
  {
    id: "housekeeping",
    name: "Housekeeping",
    outcome: "Scheduled",
    time: "23:18:03",
    status: "completed",
  },
  {
    id: "parking",
    name: "Parking",
    outcome: "Booked",
    time: "23:18:04",
    status: "completed",
  },
  {
    id: "front-desk",
    name: "Front Desk",
    outcome: "Prepared",
    time: "23:18:04",
    status: "completed",
  },
  {
    id: "crm",
    name: "CRM",
    outcome: "Guest enriched",
    time: "23:18:05",
    status: "completed",
  },
  {
    id: "revenue",
    name: "Revenue",
    outcome: "Aware",
    time: "23:18:06",
    status: "completed",
  },
] as const;

export const UNIFIED_GUEST_CONTEXT = {
  guestName: "Maria Thompson",
  status: "VIP",
  room: "Room 407",
  roomState: "Ready",
  chips: ["Late arrival", "Parking booked", "Invoice ready"] as const,
  syncLabel: "Guest context synced",
  support: "Everything ready for arrival",
  summary:
    "Unified guest context for Maria Thompson: VIP, Room 407 Ready, late arrival, parking booked, invoice ready.",
} as const;

export const GUEST_REPLY = {
  to: "Maria Thompson",
  channel: "Email",
  subject: "Arrival confirmed",
  bodyLines: [
    "Late arrival noted.",
    "Parking booked.",
    "Invoice ready at check-in.",
  ] as const,
  status: "Delivered",
  time: "23:18",
  summary:
    "Outbound email to Maria Thompson confirming late arrival, parking, and invoice readiness.",
} as const;

export const OPERATION_SUMMARY = {
  title: "Everything ready for arrival",
  line: "Every system aligned · Guest informed · No manual coordination",
  duration: "8 seconds",
} as const;

export const AI_WORKSPACE_STATES: readonly AiWorkspaceState[] = [
  "understanding",
  "decision",
  "execution",
  "completed",
] as const;
