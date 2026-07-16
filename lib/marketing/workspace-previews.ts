import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import { PLATFORM_DEFAULT_WORKSPACE_ID } from "@/lib/marketing/platform";
import { resolveWorkspaceMedia } from "@/lib/marketing/product-assets";
import type { WorkspacePreviewConfig } from "@/lib/marketing/product-media";
import { SITE_NAME } from "@/lib/marketing/site";

const preview = (
  workspace: PlatformWorkspaceId,
  title: string,
  path: string,
  alt: string,
  tabTitle: string
): WorkspacePreviewConfig => ({
  workspace,
  title,
  tabTitle,
  productUrl: `monavel.app${path}`,
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
    "Operations overview of Monavel Grand — live hotel status and recommendations",
    `${SITE_NAME} Dashboard`
  ),
  bookings: preview(
    "bookings",
    "Bookings",
    "/bookings",
    "Guest reservations at Monavel Grand including Maria Thompson reservation 48291",
    `${SITE_NAME} Bookings`
  ),
  guests: preview(
    "guests",
    "Guests",
    "/guests",
    "Guest profiles for Monavel Grand with Maria Thompson stay context",
    `${SITE_NAME} Guests`
  ),
  rooms: preview(
    "rooms",
    "Rooms",
    "/rooms",
    "Room status at Monavel Grand including Room 407",
    `${SITE_NAME} Rooms`
  ),
  calendar: preview(
    "calendar",
    "Calendar",
    "/calendar",
    "Stay calendar for Monavel Grand with live booking timeline",
    `${SITE_NAME} Calendar`
  ),
  revenue: preview(
    "revenue",
    "Revenue",
    "/rates",
    "Revenue perspective on the same live Monavel Grand hotel",
    `${SITE_NAME} Revenue`
  ),
  knowledge: preview(
    "knowledge",
    "Knowledge",
    "/knowledge",
    "Hotel knowledge supporting the same live Monavel Grand operations",
    `${SITE_NAME} Knowledge`
  ),
  "reception-ai": preview(
    "reception-ai",
    "Reception",
    "/reception-ai",
    "Live guest communication for Monavel Grand — hotel already operating",
    `${SITE_NAME} Reception AI`
  ),
};

export function getWorkspacePreview(
  workspaceId: PlatformWorkspaceId = PLATFORM_DEFAULT_WORKSPACE_ID
): WorkspacePreviewConfig {
  return WORKSPACE_PREVIEW_CONFIG[workspaceId];
}
