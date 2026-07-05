import {
  createConversationsRepository,
  type ConversationFilters,
} from "@/repositories/conversations.repository.server";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { Lead } from "@/types/lead";

export type { ConversationFilters };

export async function getConversations(
  filters: ConversationFilters = {}
): Promise<Conversation[]> {
  const repo = await createConversationsRepository();
  return repo.getAll(filters);
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const repo = await createConversationsRepository();
  return repo.getById(id);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const repo = await createConversationsRepository();
  return repo.getMessages(conversationId);
}

/** Fetches a linked lead when conversation.lead_id is set. */
export async function getLinkedLead(leadId: string): Promise<Lead | null> {
  const repo = await createConversationsRepository();
  return repo.getLinkedLead(leadId);
}

export async function getUnreadConversationCount(): Promise<number> {
  const repo = await createConversationsRepository();
  return repo.getUnreadCount();
}
