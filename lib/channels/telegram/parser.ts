import type { ChannelInboundMessage } from "@/lib/channels/types";

import type { TelegramUpdate } from "./types";

export function parseTelegramUpdate(
  update: TelegramUpdate
): ChannelInboundMessage | null {
  const message = update.message ?? update.edited_message;
  if (!message?.text?.trim()) {
    return null;
  }

  const from = message.from;
  if (!from || from.is_bot) {
    return null;
  }

  const guestName = [from.first_name, from.last_name].filter(Boolean).join(" ");

  return {
    channel: "telegram",
    externalChatId: String(message.chat.id),
    externalMessageId: String(message.message_id),
    guestName: guestName || from.username || `Telegram ${from.id}`,
    guestUsername: from.username ?? null,
    body: message.text.trim(),
    metadata: {
      telegram: {
        update_id: update.update_id,
        chat_id: message.chat.id,
        message_id: message.message_id,
        user_id: from.id,
        username: from.username ?? null,
      },
    },
  };
}
