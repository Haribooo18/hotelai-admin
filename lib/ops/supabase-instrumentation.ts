import type { SupabaseClient } from "@supabase/supabase-js";

import { opsMetrics } from "./metrics";

type Thenable = {
  then: (
    onFulfilled?: ((value: unknown) => unknown) | null,
    onRejected?: ((reason: unknown) => unknown) | null
  ) => Promise<unknown>;
};

function isThenable(value: unknown): value is Thenable {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Thenable).then === "function"
  );
}

function instrumentThenable(
  target: Thenable,
  meta: { table: string; operation: string }
): Thenable {
  return new Proxy(target, {
    get(object, prop, receiver) {
      if (prop === "then") {
        return (
          onFulfilled?: ((value: unknown) => unknown) | null,
          onRejected?: ((reason: unknown) => unknown) | null
        ) => {
          const start = Date.now();

          return Promise.prototype.then.call(
            object,
            (result: { data?: unknown; error?: unknown }) => {
              const durationMs = Date.now() - start;
              const rows = Array.isArray(result?.data)
                ? result.data.length
                : result?.data
                  ? 1
                  : 0;

              opsMetrics.recordRepositoryQuery({
                table: meta.table,
                operation: meta.operation,
                durationMs,
                rows,
                error: Boolean(result?.error),
              });

              return onFulfilled ? onFulfilled(result) : result;
            },
            onRejected
          );
        };
      }

      const value = Reflect.get(object, prop, receiver);

      if (typeof value === "function") {
        return (...args: unknown[]) => {
          const next = value.apply(object, args);
          if (isThenable(next)) {
            return instrumentThenable(next, {
              table: meta.table,
              operation: String(prop),
            });
          }
          return next;
        };
      }

      return value;
    },
  });
}

function wrapQueryBuilder(builder: unknown, table: string) {
  if (!builder || typeof builder !== "object") return builder;

  return new Proxy(builder as object, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "function") {
        return (...args: unknown[]) => {
          const next = value.apply(target, args);
          if (isThenable(next)) {
            return instrumentThenable(next, {
              table,
              operation: String(prop),
            });
          }
          if (next && typeof next === "object") {
            return wrapQueryBuilder(next, table);
          }
          return next;
        };
      }

      return value;
    },
  });
}

export function instrumentSupabaseClient(client: SupabaseClient): SupabaseClient {
  const originalFrom = client.from.bind(client);
  const originalRpc = client.rpc.bind(client);

  return Object.assign(client, {
    from(table: string) {
      return wrapQueryBuilder(originalFrom(table), table);
    },
    rpc(fn: string, args?: Record<string, unknown>, options?: { head?: boolean; get?: boolean; count?: "exact" | "planned" | "estimated" }) {
      const start = Date.now();
      const result = originalRpc(fn, args, options);

      if (!isThenable(result)) {
        return result;
      }

      return Promise.prototype.then.call(
        result,
        (value: { data?: unknown; error?: unknown }) => {
          opsMetrics.recordRpcLatency(fn, Date.now() - start);
          opsMetrics.recordRepositoryQuery({
            table: fn,
            operation: "rpc",
            durationMs: Date.now() - start,
            rows: Array.isArray(value?.data)
              ? value.data.length
              : value?.data
                ? 1
                : 0,
            error: Boolean(value?.error),
          });
          return value;
        }
      );
    },
  });
}
