import { handleTelegramWebhook } from "@/lib/channels/telegram/webhook";

export async function POST(request: Request) {
  return handleTelegramWebhook(request);
}
