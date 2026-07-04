type WebsiteWidgetLogMeta = Record<string, string | number | boolean | null | undefined>;

export function logWebsiteWidget(
  event:
    | "connection_start"
    | "connection_end"
    | "disconnect"
    | "rate_limited"
    | "invalid_hotel"
    | "invalid_origin",
  meta: WebsiteWidgetLogMeta = {}
): void {
  console.info("[HotelAI widget]", event, meta);
}

export function toPublicWebsiteErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === "AI_DISABLED") {
    return "AI-ресепшн недоступен";
  }

  return "Ошибка обработки";
}
