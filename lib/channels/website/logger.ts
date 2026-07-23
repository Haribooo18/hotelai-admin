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

export const PUBLIC_WEBSITE_ERROR_MESSAGE =
  "Секунду — у меня небольшая техническая заминка. Администратор уже уведомлён и скоро подключится к диалогу.";
