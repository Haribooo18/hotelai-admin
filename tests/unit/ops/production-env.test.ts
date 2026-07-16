import { describe, expect, it } from "vitest";

import {
  collectProductionEnvStatus,
  formatProductionEnvReport,
} from "@/lib/ops/production-env";

describe("collectProductionEnvStatus", () => {
  it("reports required production variables without exposing secrets", () => {
    const statuses = collectProductionEnvStatus("production");
    const lines = formatProductionEnvReport(statuses);

    expect(statuses.some((entry) => entry.name === "NODE_ENV")).toBe(true);
    expect(statuses.some((entry) => entry.name === "SUPABASE_URL")).toBe(true);
    expect(statuses.some((entry) => entry.name === "OPENAI_API_KEY")).toBe(true);
    expect(lines.join("\n")).not.toMatch(/sk-/);
  });
});
