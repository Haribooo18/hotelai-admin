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
    "Monavel dashboard with operations overview and AI recommendations"
  ),
  bookings: preview(
    "bookings",
    "Bookings",
    "/bookings",
    "Monavel bookings workspace with reservation list and status filters"
  ),
  guests: preview(
    "guests",
    "Guests",
    "/guests",
    "Monavel guests workspace with CRM profiles and guest history"
  ),
  rooms: preview(
    "rooms",
    "Rooms",
    "/rooms",
    "Monavel rooms workspace with room status and maintenance overview"
  ),
  calendar: preview(
    "calendar",
    "Calendar",
    "/calendar",
    "Monavel calendar workspace with booking timeline"
  ),
  revenue: preview(
    "revenue",
    "Revenue",
    "/rates",
    "Monavel revenue workspace with analytics and trend comparison"
  ),
  knowledge: preview(
    "knowledge",
    "Knowledge",
    "/knowledge",
    "Monavel knowledge base workspace with articles for AI context"
  ),
  "reception-ai": preview(
    "reception-ai",
    "Reception AI",
    "/reception-ai",
    "Monavel reception AI workspace with guest conversation inbox"
  ),
};

export function getWorkspacePreview(
  workspaceId: PlatformWorkspaceId = PLATFORM_DEFAULT_WORKSPACE_ID
): WorkspacePreviewConfig {
  return WORKSPACE_PREVIEW_CONFIG[workspaceId];
}
