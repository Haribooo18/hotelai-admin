import { getRequestContext } from "./request-context";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = {
  module: string;
  operation: string;
  message: string;
  durationMs?: number;
  errorCode?: string;
  hotelId?: string;
  conversationId?: string;
  requestId?: string;
  details?: Record<string, unknown>;
};

const SECRET_PATTERNS = [
  /sk-[a-z0-9_-]+/gi,
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /api[_-]?key["']?\s*[:=]\s*["']?[A-Za-z0-9._-]+/gi,
  /SUPABASE_SERVICE_ROLE_KEY["']?\s*[:=]\s*["']?[A-Za-z0-9._-]+/gi,
];

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return SECRET_PATTERNS.reduce(
      (acc, pattern) => acc.replace(pattern, "[redacted]"),
      value
    );
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (/secret|token|password|authorization|api_key/i.test(key)) {
        sanitized[key] = "[redacted]";
      } else {
        sanitized[key] = sanitizeValue(nested);
      }
    }
    return sanitized;
  }

  return value;
}

function writeLog(level: LogLevel, fields: LogFields): void {
  const ctx = getRequestContext();

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    requestId: fields.requestId ?? ctx?.requestId,
    hotelId: fields.hotelId ?? ctx?.hotelId,
    conversationId: fields.conversationId ?? ctx?.conversationId,
    module: fields.module,
    operation: fields.operation,
    durationMs: fields.durationMs,
    errorCode: fields.errorCode,
    message: sanitizeValue(fields.message),
    details: fields.details ? sanitizeValue(fields.details) : undefined,
  };

  const line = JSON.stringify(payload);

  switch (level) {
    case "debug":
      console.debug(line);
      break;
    case "info":
      console.info(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
}

export const opsLogger = {
  debug(fields: LogFields) {
    writeLog("debug", fields);
  },
  info(fields: LogFields) {
    writeLog("info", fields);
  },
  warn(fields: LogFields) {
    writeLog("warn", fields);
  },
  error(fields: LogFields) {
    writeLog("error", fields);
  },
};
