import { describe, expect, it } from "vitest";

import {
  OPERATIONAL_SCENARIO_CONTENT,
  OPERATIONAL_SCENARIO_STEPS,
} from "@/lib/marketing/operational-scenario";

describe("operational scenario content", () => {
  it("defines early check-in workflow", () => {
    expect(OPERATIONAL_SCENARIO_CONTENT.sectionId).toBe("operational-scenario");
    expect(OPERATIONAL_SCENARIO_STEPS[0]?.label).toMatch(/early check-in/i);
    expect(OPERATIONAL_SCENARIO_STEPS.at(-1)?.label).toMatch(/automatically/i);
  });
});
