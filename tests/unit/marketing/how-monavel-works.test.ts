import { describe, expect, it } from "vitest";

import {
  HOW_MONAVEL_WORKS_CONTENT,
  HOW_MONAVEL_WORKS_STEPS,
} from "@/lib/marketing/how-monavel-works";

describe("how monavel works content", () => {
  it("defines section metadata", () => {
    expect(HOW_MONAVEL_WORKS_CONTENT.sectionId).toBe("how-monavel-works");
    expect(HOW_MONAVEL_WORKS_CONTENT.headline).toMatch(/live operations/i);
  });

  it("defines six onboarding workflow steps", () => {
    expect(HOW_MONAVEL_WORKS_STEPS).toHaveLength(6);
    expect(HOW_MONAVEL_WORKS_STEPS[0]?.label).toBe("Connect PMS");
    expect(HOW_MONAVEL_WORKS_STEPS.at(-1)?.label).toBe("AI continuously improves");
  });
});
