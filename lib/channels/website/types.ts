export type WebsiteInboundFrame = {
  type: "guest_message";
  session_id: string;
  message_id: string;
  guest_name: string;
  guest_email?: string | null;
  body: string;
  hotel_id?: string;
};

export type WebsiteOutboundEvent =
  | { type: "ack"; guest_message_id: string; conversation_id: string }
  | { type: "status"; status: "ai_answering" | "tool_calls" }
  | { type: "text_delta"; delta: string }
  | { type: "text_final"; content: string }
  | { type: "done"; message_id: string }
  | { type: "ai_disabled" }
  | { type: "error"; message: string };
