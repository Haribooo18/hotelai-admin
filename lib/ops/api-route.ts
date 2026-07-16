import {
  errorToJson,
  getFriendlyUnavailableMessage,
  normalizeError,
} from "./errors";
import { opsLogger } from "./logger";
import { opsMetrics } from "./metrics";
import {
  createRequestContext,
  patchRequestContext,
  runWithRequestContext,
} from "./request-context";

export type ApiRouteOptions = {
  module: string;
  operation: string;
  endpoint: string;
  method?: string;
  hotelId?: string;
  userId?: string;
  conversationId?: string;
  provider?: string;
  /** When true, provider failures return a friendly payload instead of 500. */
  gracefulAiFailure?: boolean;
};

export async function runApiRoute(
  request: Request,
  options: ApiRouteOptions,
  handler: () => Promise<Response>
): Promise<Response> {
  const method = options.method ?? request.method;
  const context = createRequestContext(request, {
    module: options.module,
    operation: options.operation,
    hotelId: options.hotelId,
    userId: options.userId,
    conversationId: options.conversationId,
    provider: options.provider,
  });

  return runWithRequestContext(context, async () => {
    opsMetrics.recordApiRequest(options.endpoint, method);
    const start = Date.now();

    try {
      const response = await handler();
      const durationMs = Date.now() - start;

      opsLogger.info({
        module: options.module,
        operation: options.operation,
        message: "api.request.completed",
        durationMs,
      });

      const headers = new Headers(response.headers);
      headers.set("x-request-id", context.requestId);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (err) {
      const durationMs = Date.now() - start;
      const normalized = normalizeError(err);

      opsMetrics.recordApiFailure(
        options.endpoint,
        method,
        normalized.code
      );

      opsLogger.error({
        module: options.module,
        operation: options.operation,
        message: normalized.message,
        durationMs,
        errorCode: normalized.code,
      });

      const friendly = options.gracefulAiFailure
        ? getFriendlyUnavailableMessage(normalized.code)
        : null;

      const headers = new Headers({
        "Content-Type": "application/json",
        "x-request-id": context.requestId,
      });

      if (normalized.code === "RATE_LIMIT_ERROR" && normalized.details?.retryAfterMs) {
        headers.set(
          "Retry-After",
          String(Math.ceil(Number(normalized.details.retryAfterMs) / 1000))
        );
      }

      return Response.json(
        friendly
          ? { error: friendly, code: normalized.code, unavailable: true }
          : errorToJson(normalized),
        { status: normalized.status, headers }
      );
    }
  });
}

export function bindApiContext(
  patch: Parameters<typeof patchRequestContext>[0]
): void {
  patchRequestContext(patch);
}
