import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import { PLATFORM_DEFAULT_WORKSPACE_ID } from "@/lib/marketing/platform";
import { resolveWorkspaceMedia } from "@/lib/marketing/product-assets";
import type { WorkspacePreviewConfig } from "@/lib/marketing/product-media";

const preview = (
  workspace: PlatformWorkspaceId,
  title: string,
  path: string,
  alt: string
): WorkspacePreviewConfig => ({
  workspace,
  title,
  productUrl: `app.monavel.com${path}`,
  alt,
  media: resolveWorkspaceMedia(workspace),
});

export const WORKSPACE_PREVIEW_CONFIG: Record<
  PlatformWorkspaceId,
  WorkspacePreviewConfig
> = {
  dashboard: preview(
    "dashboard",
    "Dashboard",
    "/dashboard",
    "Operations overview of Monavel Grand — live hotel status and recommendations"
  ),
  bookings: preview(
    "bookings",
    "Bookings",
    "/bookings",
    "Guest reservations at Monavel Grand including Maria Thompson reservation 48291"
  ),
  guests: preview(
    "guests",
    "Guests",
    "/guests",
    "Guest profiles for Monavel Grand with Maria Thompson stay context"
  ),
  rooms: preview(
    "rooms",
    "Rooms",
    "/rooms",
    "Room status at Monavel Grand including Room 407"
  ),
  calendar: preview(
    "calendar",
    "Calendar",
    "/calendar",
    "Stay calendar for Monavel Grand with live booking timeline"
  ),
  revenue: preview(
    "revenue",
    "Revenue",
    "/rates",
    "Revenue perspective on the same live Monavel Grand hotel"
  ),
  knowledge: preview(
    "knowledge",
    "Knowledge",
    "/knowledge",
    "Hotel knowledge supporting the same live Monavel Grand operations"
  ),
  "reception-ai": preview(
    "reception-ai",
    "Reception",
    "/reception-ai",
    "Live guest communication for Monavel Grand — hotel already operating"
  ),
};

export function getWorkspacePreview(
  workspaceId: PlatformWorkspaceId = PLATFORM_DEFAULT_WORKSPACE_ID
): WorkspacePreviewConfig {
  return WORKSPACE_PREVIEW_CONFIG[workspaceId];
}
