export type {
  ChannelContext,
  ChannelInboundMessage,
  ChannelOutboundMessage,
} from "./types";

export {
  getTelegramBotToken,
  sendTelegramMessage,
  type TelegramSendResult,
} from "./telegram/sender";

export {
  createTelegramConversation,
  findOrCreateTelegramConversation,
  findTelegramConversation,
  getTelegramHotelId,
  getTelegramWebhookSecret,
  handleTelegramWebhook,
  insertTelegramGuestMessage,
  processTelegramUpdate,
  validateWebhookSecret,
} from "./telegram/webhook";

export { parseTelegramUpdate } from "./telegram/parser";

export type { TelegramMessage, TelegramUpdate, TelegramUser } from "./telegram/types";
