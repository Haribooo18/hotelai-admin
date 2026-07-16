import { describe, expect, it } from "vitest";

import { opsMetrics } from "@/lib/ops/metrics";

describe("opsMetrics", () => {
  it("aggregates api and ai counters", () => {
    opsMetrics.__resetForTests();

    opsMetrics.recordApiRequest("/api/ai/health", "GET");
    opsMetrics.recordApiFailure("/api/ai/health", "GET", "INTERNAL_ERROR");
    opsMetrics.recordAIRequest("openai");
    opsMetrics.recordProviderLatency("openai", 120);
    opsMetrics.recordToolExecution("search_knowledge", 45, true);

    const snapshot = opsMetrics.getSnapshot();

    expect(snapshot.requests.total).toBe(1);
    expect(snapshot.requests.errors).toBe(1);
    expect(snapshot.ai.requests.openai).toBe(1);
    expect(snapshot.latency.provider.openai?.count).toBe(1);
    expect(snapshot.tools.executions.search_knowledge).toBe(1);
  });
});
