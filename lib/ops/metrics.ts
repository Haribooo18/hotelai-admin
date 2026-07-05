type CounterMap = Map<string, number>;
type LatencyBucket = { count: number; totalMs: number; maxMs: number };

const processStartedAt = Date.now();

const apiRequests = new Map<string, CounterMap>();
const apiFailures = new Map<string, CounterMap>();
const aiRequests = new Map<string, number>();
const aiFailures = new Map<string, number>();
const toolExecutions = new Map<string, number>();
const toolFailures = new Map<string, number>();
const rateLimitBlocks = new Map<string, number>();

const providerLatency = new Map<string, LatencyBucket>();
const rpcLatency = new Map<string, LatencyBucket>();
const repositoryLatency = new Map<string, LatencyBucket>();
const streamDuration = new Map<string, LatencyBucket>();
const responseSizes = new Map<string, LatencyBucket>();

let totalApiRequests = 0;
let totalApiFailures = 0;

function bumpCounter(map: Map<string, number>, key: string, delta = 1): void {
  map.set(key, (map.get(key) ?? 0) + delta);
}

function bumpNestedCounter(
  map: Map<string, CounterMap>,
  group: string,
  key: string,
  delta = 1
): void {
  const bucket = map.get(group) ?? new Map<string, number>();
  bucket.set(key, (bucket.get(key) ?? 0) + delta);
  map.set(group, bucket);
}

function recordLatency(map: Map<string, LatencyBucket>, key: string, durationMs: number) {
  const current = map.get(key) ?? { count: 0, totalMs: 0, maxMs: 0 };
  current.count += 1;
  current.totalMs += durationMs;
  current.maxMs = Math.max(current.maxMs, durationMs);
  map.set(key, current);
}

function snapshotLatency(map: Map<string, LatencyBucket>) {
  const snapshot: Record<string, { count: number; avgMs: number; maxMs: number }> =
    {};

  for (const [key, bucket] of map.entries()) {
    snapshot[key] = {
      count: bucket.count,
      avgMs: bucket.count > 0 ? Math.round(bucket.totalMs / bucket.count) : 0,
      maxMs: bucket.maxMs,
    };
  }

  return snapshot;
}

function snapshotCounters(map: Map<string, number>) {
  return Object.fromEntries(map.entries());
}

function snapshotNestedCounters(map: Map<string, CounterMap>) {
  const snapshot: Record<string, Record<string, number>> = {};
  for (const [group, counters] of map.entries()) {
    snapshot[group] = Object.fromEntries(counters.entries());
  }
  return snapshot;
}

export type RateLimitMetricInput = {
  hotelId?: string;
  ip?: string;
  conversationId?: string;
  endpoint: string;
  reason: string;
  retryAfterMs: number;
};

export const opsMetrics = {
  recordApiRequest(endpoint: string, method: string) {
    totalApiRequests += 1;
    bumpNestedCounter(apiRequests, endpoint, method);
  },

  recordApiFailure(endpoint: string, method: string, errorCode: string) {
    totalApiFailures += 1;
    bumpNestedCounter(apiFailures, endpoint, `${method}:${errorCode}`);
  },

  recordAIRequest(provider: string) {
    bumpCounter(aiRequests, provider);
  },

  recordAIFailure(provider: string, errorCode: string) {
    bumpCounter(aiFailures, `${provider}:${errorCode}`);
  },

  recordToolExecution(toolName: string, durationMs: number, ok: boolean) {
    bumpCounter(toolExecutions, toolName);
    if (!ok) bumpCounter(toolFailures, toolName);
    recordLatency(repositoryLatency, `tool:${toolName}`, durationMs);
  },

  recordProviderLatency(provider: string, durationMs: number) {
    recordLatency(providerLatency, provider, durationMs);
  },

  recordRpcLatency(rpcName: string, durationMs: number) {
    recordLatency(rpcLatency, rpcName, durationMs);
  },

  recordRepositoryQuery(input: {
    table: string;
    operation: string;
    durationMs: number;
    rows?: number;
    error?: boolean;
  }) {
    recordLatency(
      repositoryLatency,
      `${input.table}:${input.operation}`,
      input.durationMs
    );

    if (typeof input.rows === "number") {
      recordLatency(responseSizes, `${input.table}:${input.operation}`, input.rows);
    }

    if (input.error) {
      bumpCounter(toolFailures, `repository:${input.table}`);
    }
  },

  recordStreamDuration(channel: string, durationMs: number) {
    recordLatency(streamDuration, channel, durationMs);
  },

  recordRateLimitBlock(input: RateLimitMetricInput) {
    const key = [
      input.endpoint,
      input.reason,
      input.hotelId ?? "-",
      input.ip ?? "-",
      input.conversationId ?? "-",
    ].join("|");

    bumpCounter(rateLimitBlocks, key);
  },

  getSnapshot() {
    return {
      uptimeMs: Date.now() - processStartedAt,
      requests: {
        total: totalApiRequests,
        errors: totalApiFailures,
      },
      api: {
        requests: snapshotNestedCounters(apiRequests),
        failures: snapshotNestedCounters(apiFailures),
      },
      ai: {
        requests: snapshotCounters(aiRequests),
        failures: snapshotCounters(aiFailures),
      },
      tools: {
        executions: snapshotCounters(toolExecutions),
        failures: snapshotCounters(toolFailures),
      },
      rateLimits: snapshotCounters(rateLimitBlocks),
      latency: {
        provider: snapshotLatency(providerLatency),
        rpc: snapshotLatency(rpcLatency),
        repository: snapshotLatency(repositoryLatency),
        stream: snapshotLatency(streamDuration),
        responseSize: snapshotLatency(responseSizes),
      },
    };
  },

  __resetForTests() {
    apiRequests.clear();
    apiFailures.clear();
    aiRequests.clear();
    aiFailures.clear();
    toolExecutions.clear();
    toolFailures.clear();
    rateLimitBlocks.clear();
    providerLatency.clear();
    rpcLatency.clear();
    repositoryLatency.clear();
    streamDuration.clear();
    responseSizes.clear();
    totalApiRequests = 0;
    totalApiFailures = 0;
  },
};
