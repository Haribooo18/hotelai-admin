"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId, requireUser } from "@/lib/tenant";
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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      hotel_id: hotelId,
      guest_name: parsed.data.guest_name,
      guest_email: parsed.data.guest_email || null,
      guest_phone: parsed.data.guest_phone || null,
      channel: parsed.data.channel,
      priority: parsed.data.priority,
      subject: parsed.data.subject || null,
      lead_id: parsed.data.lead_id || null,
      status: "new",
      unread_count: 0,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidateAI(data.id);
  return data.id as string;
}

export async function sendMessage(input: SendMessageInput) {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { conversation_id, body, is_internal } = parsed.data;

  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      hotel_id: hotelId,
      conversation_id,
      role: "staff",
      body,
      is_internal,
    })
    .select("id, created_at")
    .single();

  if (msgError) throw msgError;

  const preview = is_internal ? `[Заметка] ${body}` : body;

  const updatePayload: Record<string, unknown> = {
    last_message_preview: preview.slice(0, 200),
    last_message_at: message.created_at,
  };

  if (!is_internal) {
    updatePayload.status = "waiting_guest";
  }

  const { error: convError } = await supabase
    .from("conversations")
    .update(updatePayload)
    .eq("id", conversation_id)
    .eq("hotel_id", hotelId);

  if (convError) throw convError;

  revalidateAI(conversation_id);
  return message.id as string;
}

export async function markConversationRead(conversationId: string) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("conversations")
    .update({ unread_count: 0 })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);

  if (error) throw error;

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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("conversations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("conversations")
    .update({ priority: parsed.data.priority })
    .eq("id", parsed.data.id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();
  const user = await requireUser();

  const { conversation_id, user_id } = parsed.data;

  await supabase
    .from("conversation_assignments")
    .update({ is_active: false, unassigned_at: new Date().toISOString() })
    .eq("conversation_id", conversation_id)
    .eq("hotel_id", hotelId)
    .eq("is_active", true);

  const { error: assignError } = await supabase
    .from("conversation_assignments")
    .insert({
      hotel_id: hotelId,
      conversation_id,
      user_id,
      assigned_by: user.id,
      is_active: true,
    });

  if (assignError) throw assignError;

  const { error: convError } = await supabase
    .from("conversations")
    .update({ assigned_to: user_id, status: "assigned" })
    .eq("id", conversation_id)
    .eq("hotel_id", hotelId);

  if (convError) throw convError;

  revalidateAI(conversation_id);
}

export async function updateInternalNotes(input: {
  id: string;
  internal_notes: string;
}) {
  const parsed = conversationInternalNotesSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("conversations")
    .update({ internal_notes: parsed.data.internal_notes || null })
    .eq("id", parsed.data.id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase.from("conversation_tags").insert({
    hotel_id: hotelId,
    conversation_id: parsed.data.conversation_id,
    tag: parsed.data.tag,
  });

  if (error) throw error;

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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("conversations")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", parsed.data.id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateAI(parsed.data.id);
}
