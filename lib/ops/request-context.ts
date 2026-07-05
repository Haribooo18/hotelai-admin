import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export type RequestContext = {
  requestId: string;
  hotelId?: string;
  userId?: string;
  conversationId?: string;
  provider?: string;
  startTime: number;
  module?: string;
  operation?: string;
};

const storage = new AsyncLocalStorage<RequestContext>();

export function generateRequestId(): string {
  return randomUUID();
}

export function resolveRequestId(request: Request): string {
  const header =
    request.headers.get("x-request-id")?.trim() ||
    request.headers.get("x-correlation-id")?.trim();

  return header && header.length > 0 ? header : generateRequestId();
}

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function runWithRequestContext<T>(
  context: RequestContext,
  fn: () => T
): T {
  return storage.run(context, fn);
}

export function patchRequestContext(
  patch: Partial<Omit<RequestContext, "requestId" | "startTime">>
): RequestContext | undefined {
  const current = storage.getStore();
  if (!current) return undefined;

  Object.assign(current, patch);
  return current;
}

export function createRequestContext(
  request: Request,
  init: Partial<Omit<RequestContext, "requestId" | "startTime">> = {}
): RequestContext {
  return {
    requestId: resolveRequestId(request),
    startTime: Date.now(),
    ...init,
  };
}
