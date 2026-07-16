export type RetryOptions = {
  maxRetries: number;
  baseDelayMs?: number;
  signal?: AbortSignal;
  onRetry?: (attempt: number, error: unknown) => void;
};

export class RetryExhaustedError extends Error {
  constructor(
    message: string,
    public readonly lastError: unknown
  ) {
    super(message);
    this.name = "RetryExhaustedError";
  }
}

export function getErrorStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null || !("status" in err)) {
    return undefined;
  }

  const status = (err as { status: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function isRetryable(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status !== undefined) {
    if ([400, 401, 403, 404, 422].includes(status)) return false;
    if ([429, 502, 503, 504].includes(status)) return true;
    return false;
  }

  if (err instanceof Error && err.name === "CircuitOpenError") {
    return false;
  }

  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("504") ||
    msg.includes("econnreset") ||
    msg.includes("fetch failed") ||
    msg.includes("network")
  );
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelayMs = 1000, signal, onRetry } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) {
      throw new Error("Запрос отменён");
    }

    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      if (attempt >= maxRetries || !isRetryable(err)) throw err;
      onRetry?.(attempt + 1, err);
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new RetryExhaustedError("Превышено число повторов", lastError);
}

export function createAbortDeadline(
  timeoutMs: number,
  parent?: AbortSignal
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onParentAbort = () => controller.abort();
  parent?.addEventListener("abort", onParentAbort);

  if (parent?.aborted) {
    controller.abort();
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      parent?.removeEventListener("abort", onParentAbort);
    },
  };
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<T> {
  const deadline = createAbortDeadline(timeoutMs, signal);

  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const onAbort = () => {
        reject(new Error(`Таймаут запроса (${timeoutMs} мс)`));
      };

      if (deadline.signal.aborted) {
        onAbort();
        return;
      }

      deadline.signal.addEventListener("abort", onAbort, { once: true });
    }),
  ]).finally(() => {
    deadline.cleanup();
  });
}

export function getErrorType(err: unknown): string {
  if (err instanceof RetryExhaustedError) return "retry_exhausted";
  if (err instanceof Error && err.name === "CircuitOpenError") {
    return "circuit_open";
  }

  const status = getErrorStatus(err);
  if (status !== undefined) return `http_${status}`;

  if (err instanceof Error) {
    if (err.message.includes("Таймаут")) return "timeout";
    if (err.message.includes("отменён")) return "aborted";
    return err.name || "error";
  }

  return "unknown";
}
