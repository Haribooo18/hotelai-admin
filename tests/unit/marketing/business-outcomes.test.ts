import { describe, expect, it } from "vitest";

import {
  BUSINESS_OUTCOMES,
  BUSINESS_OUTCOMES_CONTENT,
} from "@/lib/marketing/business-outcomes";

describe("business outcomes content", () => {
  it("defines outcome-focused benefits", () => {
    expect(BUSINESS_OUTCOMES_CONTENT.headline).toMatch(/Outcomes/i);
    expect(BUSINESS_OUTCOMES).toContain("Unify hotel operations");
    expect(BUSINESS_OUTCOMES.length).toBeGreaterThanOrEqual(6);
  });
});
