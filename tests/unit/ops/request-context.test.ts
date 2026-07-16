import { describe, expect, it } from "vitest";

import {
  createRequestContext,
  generateRequestId,
  getRequestContext,
  patchRequestContext,
  runWithRequestContext,
} from "@/lib/ops/request-context";

describe("request-context", () => {
  it("generates request ids", () => {
    expect(generateRequestId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("reuses incoming request id headers", () => {
    const request = new Request("https://example.com", {
      headers: { "x-request-id": "req-123" },
    });

    expect(createRequestContext(request).requestId).toBe("req-123");
  });

  it("propagates context through async calls", async () => {
    const context = createRequestContext(new Request("https://example.com"), {
      hotelId: "hotel_a",
    });

    await runWithRequestContext(context, async () => {
      patchRequestContext({ conversationId: "conv-1" });
      expect(getRequestContext()?.hotelId).toBe("hotel_a");
      expect(getRequestContext()?.conversationId).toBe("conv-1");
    });
  });
});
