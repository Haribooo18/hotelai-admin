"use server";

import { revalidatePath } from "next/cache";

import { createConversationsRepository } from "@/repositories/conversations.repository.server";
import { requireUser } from "@/lib/tenant";
import {
  addConversationTagSchema,
  conversationAssignSchema,
  conversationCreateSchema,
  conversationDeleteSchema,
  conversationInternalNotesSchema,
  conversationUpdatePrioritySchema,
  conversationUpdateStatusSchema,
  sendMessageSchema,
  type ConversationCreateInput,
  type SendMessageInput,
} from "@/lib/validations/ai";
import type { ConversationStatus } from "@/types/conversation";

function revalidateAI(conversationId?: string) {
  revalidatePath("/ai");
  if (conversationId) revalidatePath(`/ai?conversation=${conversationId}`);
}

export async function createConversation(input: ConversationCreateInput) {
  const parsed = conversationCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  const id = await repo.create({
    guest_name: parsed.data.guest_name,
    guest_email: parsed.data.guest_email || null,
    guest_phone: parsed.data.guest_phone || null,
    channel: parsed.data.channel,
    priority: parsed.data.priority,
    subject: parsed.data.subject || null,
    lead_id: parsed.data.lead_id || null,
  });

  revalidateAI(id);
  return id;
}

export async function sendMessage(input: SendMessageInput) {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { conversation_id, body, is_internal } = parsed.data;
  const repo = await createConversationsRepository();

  const message = await repo.sendMessage({
    conversation_id,
    body,
    is_internal,
  });

  const preview = is_internal ? `[Заметка] ${body}` : body;

  const updatePayload: Record<string, unknown> = {
    last_message_preview: preview.slice(0, 200),
    last_message_at: message.created_at,
  };

  if (!is_internal) {
    updatePayload.status = "waiting_guest";
  }

  await repo.update(conversation_id, updatePayload);

  revalidateAI(conversation_id);
  return message.id;
}

export async function markConversationRead(conversationId: string) {
  const repo = await createConversationsRepository();
  await repo.markRead(conversationId);
  revalidateAI(conversationId);
}

export async function updateConversationStatus(input: {
  id: string;
  status: ConversationStatus;
}) {
  const parsed = conversationUpdateStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  await repo.updateStatus(parsed.data.id, parsed.data.status);
  revalidateAI(parsed.data.id);
}

export async function updateConversationPriority(input: {
  id: string;
  priority: "low" | "normal" | "high" | "urgent";
}) {
  const parsed = conversationUpdatePrioritySchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  await repo.updatePriority(parsed.data.id, parsed.data.priority);
  revalidateAI(parsed.data.id);
}

export async function assignConversation(input: {
  conversation_id: string;
  user_id: string;
}) {
  const parsed = conversationAssignSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const user = await requireUser();
  const repo = await createConversationsRepository();

  await repo.assignConversation(
    parsed.data.conversation_id,
    parsed.data.user_id,
    user.id
  );

  revalidateAI(parsed.data.conversation_id);
}

export async function updateInternalNotes(input: {
  id: string;
  internal_notes: string;
}) {
  const parsed = conversationInternalNotesSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  await repo.update(parsed.data.id, {
    internal_notes: parsed.data.internal_notes || null,
  });

  revalidateAI(parsed.data.id);
}

export async function addConversationTag(input: {
  conversation_id: string;
  tag: string;
}) {
  const parsed = addConversationTagSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  await repo.addTag(parsed.data.conversation_id, parsed.data.tag);
  revalidateAI(parsed.data.conversation_id);
}

export async function archiveConversation(id: string) {
  return updateConversationStatus({ id, status: "archived" });
}

export async function deleteConversation(id: string) {
  const parsed = conversationDeleteSchema.safeParse({ id });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const repo = await createConversationsRepository();
  await repo.delete(parsed.data.id);
  revalidateAI(parsed.data.id);
}
