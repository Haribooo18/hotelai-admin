import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import type { ProductComponentMedia, ProductImageMedia, ProductMedia } from "@/lib/marketing/product-media";

export const PRODUCT_ASSET_ROOT = "/marketing/product";
export const PRODUCT_SCREENSHOT_FILENAME = "screenshot.svg";

export const PRODUCT_WORKSPACE_DIRS: Record<PlatformWorkspaceId, string> = {
  dashboard: `${PRODUCT_ASSET_ROOT}/dashboard`,
  bookings: `${PRODUCT_ASSET_ROOT}/bookings`,
  guests: `${PRODUCT_ASSET_ROOT}/guests`,
  rooms: `${PRODUCT_ASSET_ROOT}/rooms`,
  calendar: `${PRODUCT_ASSET_ROOT}/calendar`,
  revenue: `${PRODUCT_ASSET_ROOT}/revenue`,
  knowledge: `${PRODUCT_ASSET_ROOT}/knowledge`,
  "reception-ai": `${PRODUCT_ASSET_ROOT}/reception-ai`,
};

export function getProductScreenshotPath(workspace: PlatformWorkspaceId, filename: string = PRODUCT_SCREENSHOT_FILENAME): string {
  return `${PRODUCT_WORKSPACE_DIRS[workspace]}/${filename}`;
}

export function productImageMedia(workspace: PlatformWorkspaceId, filename: string = PRODUCT_SCREENSHOT_FILENAME): ProductImageMedia {
  return { type: "image", src: getProductScreenshotPath(workspace, filename) };
}

export function productComponentMedia(workspace: PlatformWorkspaceId): ProductComponentMedia {
  return { type: "component", component: workspace };
}

export function productPlaceholderMedia(): ProductMedia {
  return { type: "placeholder" };
}

export function resolveWorkspaceMedia(workspace: PlatformWorkspaceId): ProductMedia {
  return productComponentMedia(workspace);
}
