export type MessageRole = "guest" | "staff" | "ai" | "system";

export type Message = {
  id: string;
  hotel_id: string;
  conversation_id: string;

  role: MessageRole;
  body: string;
  is_internal: boolean;

  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
};
