import { handleTelegramWebhook } from "@/lib/channels/telegram/webhook";
import { runApiRoute } from "@/lib/ops/api-route";

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.telegram",
      operation: "webhook",
      endpoint: "/api/channels/telegram/webhook",
    },
    () => handleTelegramWebhook(request)
  );
}
