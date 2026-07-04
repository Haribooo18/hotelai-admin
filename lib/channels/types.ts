import type { ConversationChannel } from "@/types/conversation";

export type ChannelInboundMessage = {
  channel: ConversationChannel;
  externalChatId: string;
  externalMessageId: string;
  guestName: string;
  guestUsername: string | null;
  body: string;
  metadata: Record<string, unknown>;
};

export type ChannelOutboundMessage = {
  externalChatId: string;
  body: string;
};

export type ChannelContext = {
  hotelId: string;
  hotelName: string;
};
