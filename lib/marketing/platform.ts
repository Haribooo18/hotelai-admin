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

export const PLATFORM_SHOWCASE_CONTENT = {
  sectionId: "product",
  headline: "See the product in action",
  headlineAccent: "Eight workspaces — one environment",
  supporting:
    "Switch between reservations, operations, revenue, and guest communication — each workspace reflects live hotel data.",
} as const;

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

export const PLATFORM_DEFAULT_WORKSPACE_ID: PlatformWorkspaceId = "bookings";
