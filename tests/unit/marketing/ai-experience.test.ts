import { describe, expect, it } from "vitest";

import {
  AI_EXPERIENCE_CAPABILITIES,
  AI_EXPERIENCE_CONTENT,
} from "@/lib/marketing/ai-experience";

describe("ai experience content", () => {
  it("defines four capability cards", () => {
    expect(AI_EXPERIENCE_CAPABILITIES).toHaveLength(4);
    expect(AI_EXPERIENCE_CAPABILITIES.map((item) => item.title)).toEqual([
      "Guest Communication",
      "Knowledge",
      "Operations",
      "Revenue Intelligence",
    ]);
  });

  it("includes preview recommendation metadata", () => {
    expect(AI_EXPERIENCE_CONTENT.preview.recommendation.length).toBeGreaterThan(0);
    expect(AI_EXPERIENCE_CONTENT.preview.why.length).toBeGreaterThan(0);
    expect(AI_EXPERIENCE_CONTENT.preview.impact).toContain("revenue");
    expect(AI_EXPERIENCE_CONTENT.preview.confidence).toContain("confidence");
  });

  it("exposes section heading copy", () => {
    expect(AI_EXPERIENCE_CONTENT.sectionId).toBe("ai-experience");
    expect(AI_EXPERIENCE_CONTENT.headline).toContain(
      "before your team asks"
    );
  });
});
