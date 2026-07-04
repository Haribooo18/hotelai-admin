export type RetryOptions = {
  maxRetries: number;
  baseDelayMs?: number;
  signal?: AbortSignal;
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

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("econnreset") ||
    msg.includes("fetch failed")
  );
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelayMs = 1000, signal } = options;
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
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new RetryExhaustedError("Превышено число повторов", lastError);
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<T> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      controller.signal.addEventListener("abort", () => {
        reject(new Error(`Таймаут запроса (${timeoutMs} мс)`));
      });
    }),
  ]).finally(() => {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
  });
}
