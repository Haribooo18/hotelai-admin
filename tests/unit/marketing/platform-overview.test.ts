import { describe, expect, it } from "vitest";

import { PLATFORM_OVERVIEW_CONTENT } from "@/lib/marketing/platform-overview";

describe("platform overview content", () => {
  it("defines architecture section metadata", () => {
    expect(PLATFORM_OVERVIEW_CONTENT.sectionId).toBe("platform-overview");
    expect(PLATFORM_OVERVIEW_CONTENT.headline).toMatch(/channel/i);
  });

  it("points to architecture screenshot", () => {
    expect(PLATFORM_OVERVIEW_CONTENT.screenshotPath).toBe(
      "/marketing/product/architecture/screenshot.svg"
    );
    expect(PLATFORM_OVERVIEW_CONTENT.productUrl).toContain("integrations");
  });
});
