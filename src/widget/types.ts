export type WidgetTheme = "light" | "dark";
export type WidgetPosition = "left" | "right";

export type WidgetMessageRole = "guest" | "assistant";

export type WidgetMessage = {
  id: string;
  role: WidgetMessageRole;
  content: string;
  timestamp: number;
};

export type WidgetConfig = {
  hotelId: string;
  apiUrl: string;
  theme?: WidgetTheme;
  position?: WidgetPosition;
  primaryColor?: string;
  guestName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: WidgetMessage) => void;
  onError?: (error: string) => void;
};

export type WebsiteInboundPayload = {
  type: "guest_message";
  session_id: string;
  message_id: string;
  guest_name: string;
  guest_email?: string | null;
  body: string;
  hotel_id?: string;
};

export type WebsiteStreamEvent =
  | { type: "ack"; guest_message_id: string; conversation_id: string }
  | { type: "status"; status: "ai_answering" | "tool_calls" }
  | { type: "text_delta"; delta: string }
  | { type: "text_final"; content: string }
  | { type: "done"; message_id: string }
  | { type: "ai_disabled" }
  | { type: "error"; message: string };

export type WidgetEventMap = {
  open: void;
  close: void;
  message: WidgetMessage;
  error: string;
};
