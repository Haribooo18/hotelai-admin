import type { PlatformWorkspaceId } from "@/lib/marketing/platform";

export type ProductMediaType = "placeholder" | "image" | "video" | "interactive";

export type ProductPlaceholderMedia = {
  type: "placeholder";
};

export type ProductImageMedia = {
  type: "image";
  src: string;
};

export type ProductVideoMedia = {
  type: "video";
  src: string;
  poster?: string;
};

export type ProductInteractiveMedia = {
  type: "interactive";
  src: string;
};

export type ProductMedia =
  | ProductPlaceholderMedia
  | ProductImageMedia
  | ProductVideoMedia
  | ProductInteractiveMedia;

export type WorkspacePreviewConfig = {
  workspace: PlatformWorkspaceId;
  title: string;
  productUrl: string;
  alt: string;
  media: ProductMedia;
};

export const PRODUCT_SCREENSHOT_WIDTH = 1280;
export const PRODUCT_SCREENSHOT_HEIGHT = 800;
export const PRODUCT_SCREENSHOT_ASPECT_RATIO = "16 / 10";
