import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";

import type { CurrentHotel } from "@/lib/tenant";

export const TEST_HOTEL: CurrentHotel = {
  id: "hotel_test",
  name: "Test Hotel",
};

export function makeConversation(
  overrides: Partial<Conversation> = {}
): Conversation {
  const now = "2026-07-04T12:00:00.000Z";
  return {
    id: "conv-1",
    hotel_id: TEST_HOTEL.id,
    guest_name: "Иван Тестов",
    guest_email: "ivan@test.com",
    guest_phone: null,
    channel: "website",
    status: "new",
    priority: "normal",
    lead_id: null,
    subject: "Вопрос",
    last_message_preview: "Привет",
    last_message_at: now,
    unread_count: 0,
    assigned_to: null,
    is_guest_typing: false,
    is_ai_typing: false,
    internal_notes: null,
    deleted_at: null,
    created_at: now,
    updated_at: now,
    tags: [],
    ...overrides,
  };
}

export function makeMessage(
  overrides: Partial<Message> & Pick<Message, "role" | "body">
): Message {
  return {
    id: "msg-1",
    hotel_id: TEST_HOTEL.id,
    conversation_id: "conv-1",
    is_internal: false,
    metadata: {},
    deleted_at: null,
    created_at: "2026-07-04T12:00:00.000Z",
    ...overrides,
  };
}
