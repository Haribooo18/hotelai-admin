import type {
  WebsiteInboundPayload,
  WebsiteStreamEvent,
  WidgetConfig,
} from "./types";
import { createReconnectBackoff, sleep } from "./reconnect";

const SESSION_STORAGE_PREFIX = "hotelai:widget:session:";

export function getSessionStorageKey(hotelId: string): string {
  return `${SESSION_STORAGE_PREFIX}${hotelId}`;
}

export function getOrCreateSessionId(
  hotelId: string,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage
): string {
  const key = getSessionStorageKey(hotelId);
  const existing = storage.getItem(key)?.trim();
  if (existing) {
    return existing;
  }

  const sessionId = createSessionId();
  storage.setItem(key, sessionId);
  return sessionId;
}

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function buildGuestMessageFrame(
  config: Pick<WidgetConfig, "hotelId" | "guestName">,
  sessionId: string,
  body: string,
  messageId: string = createMessageId()
): WebsiteInboundPayload {
  const trimmedBody = body.trim();
  const guestName = config.guestName?.trim() || "Website Guest";

  return {
    type: "guest_message",
    session_id: sessionId,
    message_id: messageId,
    guest_name: guestName,
    body: trimmedBody,
    hotel_id: config.hotelId,
  };
}

export function normalizeApiUrl(apiUrl: string): string {
  return apiUrl.replace(/\/+$/, "");
}

export function buildStreamUrl(apiUrl: string): string {
  return `${normalizeApiUrl(apiUrl)}/api/channels/website/stream`;
}

export function parseWebsiteStreamEvent(raw: string): WebsiteStreamEvent | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "[DONE]") {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as WebsiteStreamEvent;
    if (typeof parsed !== "object" || parsed === null || !("type" in parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export type ParsedSSEChunk = {
  events: WebsiteStreamEvent[];
  remainder: string;
};

export function parseSSEChunk(buffer: string): ParsedSSEChunk {
  const events: WebsiteStreamEvent[] = [];
  const lines = buffer.split("\n");
  const remainder = lines.pop() ?? "";

  for (const line of lines) {
    if (!line.startsWith("data:")) {
      continue;
    }

    const payload = line.slice(5).trim();
    const event = parseWebsiteStreamEvent(payload);
    if (event) {
      events.push(event);
    }
  }

  return { events, remainder };
}

export type StreamTransportError = {
  message: string;
  status: number;
  retryable: boolean;
};

export function createStreamTransportError(
  message: string,
  status: number
): StreamTransportError {
  return {
    message,
    status,
    retryable: status >= 500 || status === 0,
  };
}

export async function readStreamErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string };
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Fall through to status-based message.
  }

  return `Ошибка подключения (${response.status})`;
}

export type StreamTransportOptions = {
  apiUrl: string;
  frame: WebsiteInboundPayload;
  signal?: AbortSignal;
  onEvent: (event: WebsiteStreamEvent) => void;
  fetchImpl?: typeof fetch;
};

export async function streamGuestMessage(
  options: StreamTransportOptions
): Promise<void> {
  const fetchFn = options.fetchImpl ?? fetch;
  const response = await fetchFn(buildStreamUrl(options.apiUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(options.frame),
    signal: options.signal,
  });

  if (!response.ok) {
    const message = await readStreamErrorMessage(response);
    throw createStreamTransportError(message, response.status);
  }

  if (!response.body) {
    throw createStreamTransportError("Поток ответа недоступен", 0);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parsed = parseSSEChunk(buffer);
    buffer = parsed.remainder;

    for (const event of parsed.events) {
      options.onEvent(event);
    }
  }

  if (buffer.trim()) {
    const parsed = parseSSEChunk(`${buffer}\n`);
    for (const event of parsed.events) {
      options.onEvent(event);
    }
  }
}

export type StreamTransportRetryOptions = StreamTransportOptions & {
  maxAttempts?: number;
  onRetry?: (delayMs: number, attempt: number) => void;
};

export async function streamGuestMessageWithRetry(
  options: StreamTransportRetryOptions
): Promise<void> {
  const backoff = createReconnectBackoff();
  const maxAttempts = options.maxAttempts ?? 6;

  while (true) {
    try {
      await streamGuestMessage(options);
      backoff.reset();
      return;
    } catch (error) {
      if (options.signal?.aborted) {
        throw error;
      }

      const transportError = error as StreamTransportError;
      const retryable =
        typeof transportError.retryable === "boolean"
          ? transportError.retryable
          : false;

      if (!retryable || backoff.getAttempt() >= maxAttempts - 1) {
        throw error;
      }

      const delayMs = backoff.nextDelay();
      options.onRetry?.(delayMs, backoff.getAttempt());
      await sleep(delayMs);
    }
  }
}
