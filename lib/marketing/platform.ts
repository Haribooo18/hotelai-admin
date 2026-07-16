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

export const PLATFORM_HOTEL_CONTEXT = {
  hotelLive: "Monavel Grand • Live",
  guestName: "Maria Thompson",
  reservation: "Reservation #48291",
  room: "Room 407",
} as const;

export const PLATFORM_AUTOMATION_READINESS = [
  "12 workflows active",
  "Everything synced",
  "Online",
] as const;

export const PLATFORM_SHOWCASE_CONTENT = {
  sectionId: MARKETING_PRODUCT_SECTION_ID,
  headline: "One Runtime.",
  headlineAccent: "Every operational perspective.",
  supporting: "Every perspective reflects the same live hotel in real time.",
  runtimeStatus: "Online",
  sharedContext: PLATFORM_HOTEL_CONTEXT.hotelLive,
  closingLines: ["One living hotel.", "Different perspectives."] as const,
} as const;

export const PLATFORM_PERSPECTIVES: readonly PlatformPerspective[] = [
  {
    id: "operations",
    label: "Operations Perspective",
    defaultViewId: "dashboard",
    views: [
      { id: "dashboard", label: "Overview" },
      { id: "bookings", label: "Bookings" },
      { id: "guests", label: "Guests" },
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

export const PLATFORM_DEFAULT_PERSPECTIVE_ID: PlatformPerspectiveId =
  "operations";

export const PLATFORM_DEFAULT_WORKSPACE_ID: PlatformWorkspaceId = "dashboard";

export function getPlatformPerspective(
  id: PlatformPerspectiveId
): PlatformPerspective {
  return (
    PLATFORM_PERSPECTIVES.find((perspective) => perspective.id === id) ??
    PLATFORM_PERSPECTIVES[0]
  );
}
