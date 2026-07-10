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
  sectionId: "platform-overview",
  overline: "Platform",
  headline: "Everything your hotel runs on.",
  headlineAccent: "Connected by AI.",
  supporting:
    "One operating system for reception, rooms, revenue, and guest service — without switching between disconnected tools.",
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

export const PLATFORM_DEFAULT_WORKSPACE_ID: PlatformWorkspaceId = "dashboard";
