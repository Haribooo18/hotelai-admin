import { describe, expect, it, vi } from "vitest";

import { ProviderCircuitBreaker, CircuitOpenError } from "@/lib/ai/circuit-breaker";

describe("ProviderCircuitBreaker", () => {
  it("opens after repeated provider outages and recovers", async () => {
    vi.useFakeTimers();

    const breaker = new ProviderCircuitBreaker({
      failureThreshold: 2,
      windowMs: 60_000,
      openDurationMs: 5_000,
    });

    const outage = () =>
      Promise.reject(Object.assign(new Error("503"), { status: 503 }));

    await expect(breaker.execute("openai", outage)).rejects.toMatchObject({
      status: 503,
    });
    await expect(breaker.execute("openai", outage)).rejects.toMatchObject({
      status: 503,
    });

    await expect(breaker.execute("openai", () => Promise.resolve("ok"))).rejects.toBeInstanceOf(
      CircuitOpenError
    );

    vi.advanceTimersByTime(5_000);

    await expect(
      breaker.execute("openai", () => Promise.resolve("recovered"))
    ).resolves.toBe("recovered");

    vi.useRealTimers();
  });

  it("does not open on client errors", async () => {
    const breaker = new ProviderCircuitBreaker({
      failureThreshold: 1,
      windowMs: 60_000,
      openDurationMs: 5_000,
    });

    await expect(
      breaker.execute("openai", () =>
        Promise.reject(Object.assign(new Error("400"), { status: 400 }))
      )
    ).rejects.toMatchObject({ status: 400 });

    await expect(
      breaker.execute("openai", () => Promise.resolve("ok"))
    ).resolves.toBe("ok");
  });
});
