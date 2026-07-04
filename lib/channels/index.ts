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

export {
  cleanupWebsiteStream,
  findOrCreateWebsiteConversation,
  findWebsiteConversation,
  getWebsiteHotelId,
  handleWebsiteStream,
  processWebsiteGuestMessage,
  registerWebsiteConnection,
} from "./website/stream";

export { parseWebsiteInboundFrame, toChannelInboundMessage } from "./website/parser";

export {
  mapOrchestratorEventToWebsite,
  serializeWebsiteEvent,
  type WebsiteSendFn,
} from "./website/sender";

export type {
  WebsiteInboundFrame,
  WebsiteOutboundEvent,
} from "./website/types";
