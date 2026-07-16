import type { ChannelOutboundMessage } from "@/lib/channels/types";

export type TelegramSendResult = {
  ok: boolean;
  messageId?: number;
  error?: string;
};

export function getTelegramBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
}

export async function sendTelegramMessage(
  input: ChannelOutboundMessage,
  botToken: string = getTelegramBotToken() ?? ""
): Promise<TelegramSendResult> {
  if (!botToken) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.externalChatId,
        text: input.body,
      }),
    }
  );

  const payload = (await response.json()) as {
    ok: boolean;
    result?: { message_id: number };
    description?: string;
  };

  if (!response.ok || !payload.ok) {
    return {
      ok: false,
      error: payload.description ?? `HTTP ${response.status}`,
    };
  }

  return {
    ok: true,
    messageId: payload.result?.message_id,
  };
}
