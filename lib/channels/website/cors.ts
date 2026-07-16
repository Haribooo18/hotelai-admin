const LOCAL_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(?::\d+)?$/,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
];

export type OriginDecision =
  | { allowed: true; origin: string | null }
  | { allowed: false; origin: string };

export function parseWebsiteWidgetAllowedOrigins(
  raw: string | undefined = process.env.WEBSITE_WIDGET_ALLOWED_ORIGINS
): string[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isLocalDevelopmentOrigin(origin: string): boolean {
  return LOCAL_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchAllowedOrigin(origin: string, pattern: string): boolean {
  if (origin === pattern) {
    return true;
  }

  if (!pattern.includes("*")) {
    return false;
  }

  const regex = new RegExp(
    `^${escapeRegex(pattern).replace(/\\\*/g, "[^/]+")}$`,
    "i"
  );
  return regex.test(origin);
}

export function evaluateWebsiteWidgetOrigin(
  originHeader: string | null,
  options?: {
    allowedOrigins?: string[];
    nodeEnv?: string;
  }
): OriginDecision {
  const allowedOrigins =
    options?.allowedOrigins ?? parseWebsiteWidgetAllowedOrigins();
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV ?? "production";

  if (!originHeader) {
    return { allowed: true, origin: null };
  }

  const origin = originHeader.trim();
  if (!origin) {
    return { allowed: true, origin: null };
  }

  if (nodeEnv === "development" && isLocalDevelopmentOrigin(origin)) {
    return { allowed: true, origin };
  }

  if (allowedOrigins.length === 0) {
    return { allowed: false, origin };
  }

  const allowed = allowedOrigins.some((pattern) =>
    matchAllowedOrigin(origin, pattern)
  );

  return allowed ? { allowed: true, origin } : { allowed: false, origin };
}

export function buildWebsiteWidgetCorsHeaders(
  origin: string | null
): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}
