import {
  createConversationsRepository,
  type ConversationFilters,
} from "@/repositories/conversations.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { Lead } from "@/types/lead";

export type { ConversationFilters };

export async function getConversations(
  filters: ConversationFilters = {}
): Promise<Conversation[]> {
  const ctx = await getRepositoryContext();
  return createConversationsRepository(ctx).getAll(filters);
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const ctx = await getRepositoryContext();
  return createConversationsRepository(ctx).getById(id);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const ctx = await getRepositoryContext();
  return createConversationsRepository(ctx).getMessages(conversationId);
}

/** Fetches a linked lead when conversation.lead_id is set. */
export async function getLinkedLead(leadId: string): Promise<Lead | null> {
  const ctx = await getRepositoryContext();
  return createConversationsRepository(ctx).getLinkedLead(leadId);
}

export async function getUnreadConversationCount(): Promise<number> {
  const ctx = await getRepositoryContext();
  return createConversationsRepository(ctx).getUnreadCount();
}
