import { describe, expect, it } from "vitest";

import {
  PLATFORM_PILLARS,
  PLATFORM_PILLARS_CONTENT,
} from "@/lib/marketing/pillars";

describe("platform pillars content", () => {
  it("defines three pillars", () => {
    expect(PLATFORM_PILLARS).toHaveLength(3);
    expect(PLATFORM_PILLARS.map((pillar) => pillar.id)).toEqual([
      "operations",
      "ai-reception",
      "revenue",
    ]);
  });

  it("includes feature lists and cta links", () => {
    const operations = PLATFORM_PILLARS[0];
    const ai = PLATFORM_PILLARS[1];
    const revenue = PLATFORM_PILLARS[2];

    expect(operations.title).toBe("Run Operations");
    expect(operations.features).toContain("Calendar");
    expect(operations.href).toBe("/#product");

    expect(ai.title).toBe("AI Reception");
    expect(ai.features).toContain("Telegram");
    expect(ai.href).toBe("/ai");

    expect(revenue.title).toBe("Grow Revenue");
    expect(revenue.features).toContain("Analytics");
    expect(revenue.href).toBe("/pricing");
  });

  it("exposes section heading copy", () => {
    expect(PLATFORM_PILLARS_CONTENT.sectionId).toBe("platform-pillars");
    expect(PLATFORM_PILLARS_CONTENT.headline).toContain("Five layers");
  });
});
