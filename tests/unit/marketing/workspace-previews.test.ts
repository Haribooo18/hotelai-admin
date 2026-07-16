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

const workspaceIds = Object.keys(WORKSPACE_PREVIEW_CONFIG) as Array<
  keyof typeof WORKSPACE_PREVIEW_CONFIG
>;

describe("product assets", () => {
  it("defines canonical directories for all workspaces", () => {
    expect(Object.keys(PRODUCT_WORKSPACE_DIRS)).toHaveLength(8);

    expect(getProductScreenshotPath("dashboard")).toBe(
      "/marketing/product/dashboard/screenshot.svg"
    );
  });

  it("resolves component media for each workspace", () => {
    for (const workspaceId of workspaceIds) {
      const media = resolveWorkspaceMedia(workspaceId);

      expect(media.type).toBe("component");
    }
  });

  it("ships screenshot fallback assets for all workspaces", () => {
    for (const workspaceId of workspaceIds) {
      const src = getProductScreenshotPath(workspaceId);
      const filePath = join(process.cwd(), "public", src);

      expect(existsSync(filePath)).toBe(true);
    }
  });
});

describe("workspace preview config", () => {
  it("defines previews for all eight workspaces", () => {
    expect(Object.keys(WORKSPACE_PREVIEW_CONFIG)).toHaveLength(8);
  });

  it("uses component media for dashboard preview", () => {
    const preview = getWorkspacePreview("dashboard");

    expect(preview.workspace).toBe("dashboard");
    expect(preview.title).toBe("Dashboard");
    expect(preview.productUrl).toBe("monavel.app/dashboard");
    expect(preview.tabTitle).toBe("Monavel Dashboard");
    expect(preview.media.type).toBe("component");
    expect(preview.alt.length).toBeGreaterThan(0);
  });

  it("resolves reception AI preview", () => {
    const preview = getWorkspacePreview("reception-ai");

    expect(preview.workspace).toBe("reception-ai");
    expect(preview.productUrl).toBe("monavel.app/reception-ai");
    expect(preview.tabTitle).toBe("Monavel Reception AI");
    expect(preview.media.type).toBe("component");
    expect(preview.alt.length).toBeGreaterThan(0);
  });
});