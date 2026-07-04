const BACKOFF_DELAYS_MS = [1000, 2000, 4000, 8000, 16000, 30000] as const;

export type ReconnectBackoff = {
  nextDelay: () => number;
  reset: () => void;
  getAttempt: () => number;
};

export function createReconnectBackoff(): ReconnectBackoff {
  let attempt = 0;

  return {
    nextDelay() {
      const delay = BACKOFF_DELAYS_MS[Math.min(attempt, BACKOFF_DELAYS_MS.length - 1)];
      attempt += 1;
      return delay;
    },
    reset() {
      attempt = 0;
    },
    getAttempt() {
      return attempt;
    },
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
