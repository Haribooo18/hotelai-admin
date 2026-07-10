import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  getProductScreenshotPath,
  PRODUCT_WORKSPACE_DIRS,
  resolveWorkspaceMedia,
} from "@/lib/marketing/product-assets";
import {
  getWorkspacePreview,
  WORKSPACE_PREVIEW_CONFIG,
} from "@/lib/marketing/workspace-previews";

const workspaceIds = Object.keys(WORKSPACE_PREVIEW_CONFIG);

describe("product assets", () => {
  it("defines canonical directories for all workspaces", () => {
    expect(Object.keys(PRODUCT_WORKSPACE_DIRS)).toHaveLength(8);
    expect(getProductScreenshotPath("dashboard")).toBe(
      "/marketing/product/dashboard/screenshot.svg"
    );
  });

  it("resolves image media for each workspace", () => {
    for (const workspaceId of workspaceIds) {
      const media = resolveWorkspaceMedia(
        workspaceId as keyof typeof WORKSPACE_PREVIEW_CONFIG
      );
      expect(media.type).toBe("image");
      if (media.type === "image") {
        expect(media.src).toContain(`/marketing/product/${workspaceId}/`);
      }
    }
  });

  it("ships screenshot assets for all workspaces", () => {
    for (const workspaceId of workspaceIds) {
      const src = getProductScreenshotPath(
        workspaceId as keyof typeof WORKSPACE_PREVIEW_CONFIG
      );
      const filePath = join(process.cwd(), "public", src);
      expect(existsSync(filePath)).toBe(true);
    }
  });
});

describe("workspace preview config", () => {
  it("defines previews for all eight workspaces", () => {
    expect(Object.keys(WORKSPACE_PREVIEW_CONFIG)).toHaveLength(8);
  });

  it("uses image media for dashboard preview", () => {
    const preview = getWorkspacePreview("dashboard");

    expect(preview.title).toBe("Dashboard");
    expect(preview.productUrl).toBe("app.monavel.com/dashboard");
    expect(preview.media.type).toBe("image");
    if (preview.media.type === "image") {
      expect(preview.media.src).toBe("/marketing/product/dashboard/screenshot.svg");
    }
    expect(preview.alt.length).toBeGreaterThan(0);
  });

  it("resolves reception ai preview", () => {
    const preview = getWorkspacePreview("reception-ai");

    expect(preview.workspace).toBe("reception-ai");
    expect(preview.productUrl).toBe("app.monavel.com/reception-ai");
    if (preview.media.type === "image") {
      expect(preview.media.src).toBe(
        "/marketing/product/reception-ai/screenshot.svg"
      );
    }
  });
});
