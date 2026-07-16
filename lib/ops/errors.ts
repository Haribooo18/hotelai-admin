export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "PROVIDER_ERROR"
  | "TIMEOUT_ERROR"
  | "RATE_LIMIT_ERROR"
  | "NETWORK_ERROR"
  | "REPOSITORY_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
    public readonly status: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Не авторизован") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Недостаточно прав") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "PROVIDER_ERROR", 503, details);
    this.name = "ProviderError";
  }
}

export class TimeoutError extends AppError {
  constructor(message = "Превышено время ожидания") {
    super(message, "TIMEOUT_ERROR", 504);
    this.name = "TimeoutError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, retryAfterMs?: number) {
    super(message, "RATE_LIMIT_ERROR", 429, {
      retryAfterMs,
    });
    this.name = "RateLimitError";
  }
}

export class NetworkError extends AppError {
  constructor(message = "Сетевая ошибка") {
    super(message, "NETWORK_ERROR", 502);
    this.name = "NetworkError";
  }
}

export class RepositoryError extends AppError {
  constructor(
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message, "REPOSITORY_ERROR", 503, details);
    this.name = "RepositoryError";
  }
}

export class InternalError extends AppError {
  constructor(message = "Внутренняя ошибка сервера") {
    super(message, "INTERNAL_ERROR", 500);
    this.name = "InternalError";
  }
}

function getErrorStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null || !("status" in err)) {
    return undefined;
  }

  const status = (err as { status: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Error) {
    if (err.name === "CircuitOpenError") {
      return new ProviderError(
        "AI-сервис временно недоступен. Повторите позже."
      );
    }

    const message = err.message;

    if (message.includes("Не авторизован")) {
      return new AuthenticationError(message);
    }

    if (message.includes("Превышен лимит")) {
      return new RateLimitError(message);
    }

    if (message.includes("Таймаут") || message.includes("timeout")) {
      return new TimeoutError(message);
    }

    if (message.includes("Запрос отменён")) {
      return new TimeoutError(message);
    }

    if (/^\w+: /.test(message) && message.includes("permission denied")) {
      return new RepositoryError(message);
    }

    if (/^\w+: /.test(message)) {
      return new RepositoryError(message);
    }

    if (message.includes("fetch failed") || message.includes("ECONNRESET")) {
      return new NetworkError(message);
    }

    const status = getErrorStatus(err);
    if (status === 429) {
      return new RateLimitError(message);
    }

    if (status === 401) {
      return new AuthenticationError(message);
    }

    if (status === 403) {
      return new AuthorizationError(message);
    }

    if (status === 400 || status === 422) {
      return new ValidationError(message);
    }

    if (status === 503 || status === 502 || status === 504) {
      return new ProviderError(message);
    }

    if (message.includes("OpenAI") || message.includes("AI-провайдер")) {
      return new ProviderError(message);
    }
  }

  return new InternalError();
}

export function errorToJson(error: AppError) {
  return {
    error: error.message,
    code: error.code,
    ...(error.details ?? {}),
  };
}

export function getFriendlyUnavailableMessage(code: AppErrorCode): string | null {
  switch (code) {
    case "PROVIDER_ERROR":
    case "TIMEOUT_ERROR":
    case "NETWORK_ERROR":
      return "AI-сервис временно недоступен. Попробуйте позже или свяжитесь с ресепшном.";
    default:
      return null;
  }
}
