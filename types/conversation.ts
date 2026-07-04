export type ConversationStatus =
  | "new"
  | "assigned"
  | "ai_answering"
  | "waiting_guest"
  | "resolved"
  | "archived";

export type ConversationChannel =
  | "website"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "facebook_messenger"
  | "email";

export type ConversationPriority = "low" | "normal" | "high" | "urgent";

export type Conversation = {
  id: string;
  hotel_id: string;

  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;

  channel: ConversationChannel;
  status: ConversationStatus;
  priority: ConversationPriority;

  lead_id: string | null;
  subject: string | null;

  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;

  assigned_to: string | null;
  is_guest_typing: boolean;
  is_ai_typing: boolean;
  internal_notes: string | null;

  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  /** Joined from conversation_tags when fetched as a list item. */
  tags?: string[];
};
