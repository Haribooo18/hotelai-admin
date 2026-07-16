import { getErrorStatus } from "./retry";

export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitOpenError";
  }
}

type CircuitState = "closed" | "open" | "half_open";

type CircuitBreakerOptions = {
  failureThreshold: number;
  windowMs: number;
  openDurationMs: number;
};

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  windowMs: 60_000,
  openDurationMs: 30_000,
};

function isProviderOutage(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status !== undefined) {
    return status === 429 || status === 502 || status === 503 || status === 504;
  }

  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("econnreset") ||
    msg.includes("fetch failed") ||
    msg.includes("network")
  );
}

export class ProviderCircuitBreaker {
  private state: CircuitState = "closed";
  private failureTimestamps: number[] = [];
  private openedAt = 0;

  constructor(private readonly options: CircuitBreakerOptions = DEFAULT_OPTIONS) {}

  async execute<T>(provider: string, fn: () => Promise<T>): Promise<T> {
    void provider;
    this.refreshState();

    if (this.state === "open") {
      throw new CircuitOpenError(
        "AI-сервис временно недоступен. Повторите позже."
      );
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      if (isProviderOutage(err)) {
        this.onFailure();
      }
      throw err;
    }
  }

  private refreshState(): void {
    const now = Date.now();
    this.failureTimestamps = this.failureTimestamps.filter(
      (ts) => now - ts <= this.options.windowMs
    );

    if (this.state === "open" && now - this.openedAt >= this.options.openDurationMs) {
      this.state = "half_open";
    }
  }

  private onSuccess(): void {
    this.failureTimestamps = [];
    this.state = "closed";
  }

  private onFailure(): void {
    const now = Date.now();
    this.failureTimestamps.push(now);

    if (
      this.state === "half_open" ||
      this.failureTimestamps.length >= this.options.failureThreshold
    ) {
      this.state = "open";
      this.openedAt = now;
    }
  }
}

export const providerCircuitBreaker = new ProviderCircuitBreaker();
