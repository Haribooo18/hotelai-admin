import { describe, expect, it } from "vitest";

import { getErrorStatus, getErrorType, withRetry } from "@/lib/ai/retry";

describe("withRetry", () => {
  it("retries transient HTTP failures with exponential backoff", async () => {
    let attempts = 0;

    const result = await withRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw Object.assign(new Error("503"), { status: 503 });
        }
        return "ok";
      },
      { maxRetries: 3, baseDelayMs: 1 }
    );

    expect(result).toBe("ok");
    expect(attempts).toBe(3);
  });

  it("does not retry client errors", async () => {
    let attempts = 0;

    await expect(
      withRetry(
        async () => {
          attempts += 1;
          throw Object.assign(new Error("400"), { status: 400 });
        },
        { maxRetries: 3, baseDelayMs: 1 }
      )
    ).rejects.toMatchObject({ status: 400 });

    expect(attempts).toBe(1);
  });
});

describe("getErrorType", () => {
  it("maps HTTP status codes", () => {
    expect(getErrorType(Object.assign(new Error("429"), { status: 429 }))).toBe(
      "http_429"
    );
    expect(getErrorStatus(Object.assign(new Error("404"), { status: 404 }))).toBe(
      404
    );
  });
});
