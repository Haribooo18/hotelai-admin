import { describe, expect, it } from "vitest";

import {
  CHANNEL_FLOW,
  PHILOSOPHY_CONTENT,
  STORYTELLING_CONTENT,
} from "@/lib/marketing/landing-story";

describe("landing story content", () => {
  it("defines storytelling section metadata in English", () => {
    expect(STORYTELLING_CONTENT.sectionId).toBe("connected-intelligence");
    expect(STORYTELLING_CONTENT.overline).toMatch(/how/i);
    expect(STORYTELLING_CONTENT.headline).toMatch(/channel/i);
  });

  it("defines a guest channel flow ending with Guest", () => {
    expect(CHANNEL_FLOW.at(-1)?.label).toBe("Guest");
    expect(CHANNEL_FLOW.length).toBe(6);
    expect(CHANNEL_FLOW.map((step) => step.label)).toContain("AI");
  });

  it("defines philosophy section copy in English", () => {
    expect(PHILOSOPHY_CONTENT.sectionId).toBe("philosophy");
    expect(PHILOSOPHY_CONTENT.headline).toMatch(/disconnected systems/i);
    expect(PHILOSOPHY_CONTENT.lines.length).toBeGreaterThanOrEqual(3);
  });
});
