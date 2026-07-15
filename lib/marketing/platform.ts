import { MARKETING_PRODUCT_SECTION_ID } from "@/lib/marketing/routes";

export type PlatformWorkspaceId =
  | "dashboard"
  | "bookings"
  | "guests"
  | "rooms"
  | "calendar"
  | "revenue"
  | "knowledge"
  | "reception-ai";

export type PlatformWorkspace = {
  id: PlatformWorkspaceId;
  label: string;
};

export type PlatformPerspectiveId =
  | "guest"
  | "operations"
  | "revenue"
  | "knowledge"
  | "automation";

export type PlatformPerspectiveView = {
  id: PlatformWorkspaceId;
  label: string;
};

export type PlatformPerspective = {
  id: PlatformPerspectiveId;
  label: string;
  defaultViewId: PlatformWorkspaceId;
  views: readonly PlatformPerspectiveView[];
};

/** Existing flat workspace list — preserved for shared product previews elsewhere. */
export const PLATFORM_WORKSPACES: PlatformWorkspace[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "bookings", label: "Bookings" },
  { id: "guests", label: "Guests" },
  { id: "rooms", label: "Rooms" },
  { id: "calendar", label: "Calendar" },
  { id: "revenue", label: "Revenue" },
  { id: "knowledge", label: "Knowledge" },
  { id: "reception-ai", label: "Reception AI" },
];

/**
 * Persistent hotel identity — same living hotel across every perspective.
 * Aligns with shared reservation context used elsewhere on the homepage.
 */
export const PLATFORM_HOTEL_CONTEXT = {
  hotelLive: "Monavel Grand • Live",
  guestName: "Maria Thompson",
  reservation: "Reservation #48291",
  room: "Room 407",
} as const;

/** Automation perspective: operational readiness, not a workflow editor. */
export const PLATFORM_AUTOMATION_READINESS = [
  "12 workflows active",
  "Everything synced",
  "Online",
] as const;

export const PLATFORM_SHOWCASE_CONTENT = {
  sectionId: MARKETING_PRODUCT_SECTION_ID,
  headline: "One Runtime.",
  headlineAccent: "Every operational perspective.",
  supporting:
    "Every perspective reflects the same live hotel in real time.",
  runtimeStatus: "Online",
  sharedContext: PLATFORM_HOTEL_CONTEXT.hotelLive,
  closingLines: ["One living hotel.", "Different perspectives."] as const,
} as const;

/**
 * Homepage Product Showcase grouping.
 * Maps existing product screenshots into five operational perspectives.
 */
export const PLATFORM_PERSPECTIVES: readonly PlatformPerspective[] = [
  {
    id: "guest",
    label: "Guest Perspective",
    defaultViewId: "bookings",
    views: [
      { id: "bookings", label: "Bookings" },
      { id: "guests", label: "Guests" },
      { id: "reception-ai", label: "Reception" },
    ],
  },
  {
    id: "operations",
    label: "Operations Perspective",
    defaultViewId: "dashboard",
    views: [
      { id: "dashboard", label: "Overview" },
      { id: "rooms", label: "Rooms" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  {
    id: "revenue",
    label: "Revenue Perspective",
    defaultViewId: "revenue",
    views: [{ id: "revenue", label: "Revenue" }],
  },
  {
    id: "knowledge",
    label: "Knowledge Perspective",
    defaultViewId: "knowledge",
    views: [{ id: "knowledge", label: "Knowledge" }],
  },
  {
    id: "automation",
    label: "Automation Perspective",
    defaultViewId: "reception-ai",
    views: [{ id: "reception-ai", label: "Live operations" }],
  },
] as const;

export const PLATFORM_DEFAULT_PERSPECTIVE_ID: PlatformPerspectiveId = "guest";

/** @deprecated Prefer perspective defaults; kept for shared preview consumers. */
export const PLATFORM_DEFAULT_WORKSPACE_ID: PlatformWorkspaceId = "bookings";

export function getPlatformPerspective(
  id: PlatformPerspectiveId
): PlatformPerspective {
  const perspective = PLATFORM_PERSPECTIVES.find((item) => item.id === id);
  if (!perspective) {
    return PLATFORM_PERSPECTIVES[0];
  }
  return perspective;
}
