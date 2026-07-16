import { describe, expect, it } from "vitest";

import { createReconnectBackoff } from "@/src/widget/reconnect";

describe("widget reconnect backoff", () => {
  it("uses exponential delays up to 30 seconds", () => {
    const backoff = createReconnectBackoff();

    expect(backoff.nextDelay()).toBe(1000);
    expect(backoff.nextDelay()).toBe(2000);
    expect(backoff.nextDelay()).toBe(4000);
    expect(backoff.nextDelay()).toBe(8000);
    expect(backoff.nextDelay()).toBe(16000);
    expect(backoff.nextDelay()).toBe(30000);
    expect(backoff.nextDelay()).toBe(30000);
  });

  it("resets after successful connection", () => {
    const backoff = createReconnectBackoff();
    backoff.nextDelay();
    backoff.nextDelay();
    backoff.reset();

    expect(backoff.nextDelay()).toBe(1000);
    expect(backoff.getAttempt()).toBe(1);
  });
});
