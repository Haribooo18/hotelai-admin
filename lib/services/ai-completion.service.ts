"use server";

import { revalidatePath } from "next/cache";

import { generateAIResponseForHotel } from "@/lib/services/tenant-ai.service";
import { getHotelAISettings } from "@/lib/services/ai-settings.service";
import { getCurrentHotel, getCurrentHotelId } from "@/lib/tenant";
import {
  aiPromptTestSchema,
  guestMessageSchema,
} from "@/lib/validations/ai-settings";

import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { createClient } from "@/lib/supabase/server";

function revalidateAI(conversationId?: string) {
  revalidatePath("/ai");
  if (conversationId) revalidatePath(`/ai?conversation=${conversationId}`);
}

export async function generateAIResponse(conversationId: string) {
  const [hotel, supabase] = await Promise.all([
    getCurrentHotel(),
    createClient(),
  ]);

  revalidateAI(conversationId);

  try {
    const result = await generateAIResponseForHotel(hotel.id, conversationId, {
      supabase,
      hotelName: hotel.name,
      throwIfDisabled: true,
    });

    revalidateAI(conversationId);
    return {
      messageId: result!.messageId,
      content: result!.content,
    };
  } catch (err) {
    revalidateAI(conversationId);
    throw err;
  }
}

export async function sendGuestMessage(input: {
  conversation_id: string;
  body: string;
  trigger_ai?: boolean;
}) {
  const parsed = guestMessageSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();
  const { conversation_id, body, trigger_ai } = parsed.data;

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      hotel_id: hotelId,
      conversation_id,
      role: "guest",
      body,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({
      status: "new",
      last_message_preview: body.slice(0, 200),
      last_message_at: message.created_at,
      unread_count: 1,
    })
    .eq("id", conversation_id)
    .eq("hotel_id", hotelId);

  revalidateAI(conversation_id);

  if (trigger_ai) {
    const settings = await getHotelAISettings();
    if (settings.enabled) {
      return generateAIResponse(conversation_id);
    }
  }

  return { guestMessageId: message.id as string };
}

export async function testAIPrompt(input: {
  message: string;
  guest_name?: string;
  language?: string;
}) {
  const parsed = aiPromptTestSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const [hotel, settings] = await Promise.all([
    getCurrentHotel(),
    getHotelAISettings(),
  ]);

  const now = new Date().toISOString();
  const fakeConversation = {
    id: "00000000-0000-0000-0000-000000000000",
    hotel_id: hotel.id,
    guest_name: parsed.data.guest_name,
    guest_email: null,
    guest_phone: null,
    channel: "website" as const,
    status: "new" as const,
    priority: "normal" as const,
    lead_id: null,
    subject: "Тест промпта",
    last_message_preview: parsed.data.message,
    last_message_at: now,
    unread_count: 0,
    assigned_to: null,
    is_guest_typing: false,
    is_ai_typing: false,
    internal_notes: null,
    deleted_at: null,
    created_at: now,
    updated_at: now,
    tags: [] as string[],
  };

  const messages = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      hotel_id: hotel.id,
      conversation_id: fakeConversation.id,
      role: "guest" as const,
      body: parsed.data.message,
      is_internal: false,
      metadata: {},
      deleted_at: null,
      created_at: now,
    },
  ];

  const result = await aiOrchestrator.run({
    hotel,
    conversation: fakeConversation,
    messages,
    settings,
    retrievalQuery: parsed.data.message,
  });

  return {
    content: result.content,
    usage: result.usage,
    costUsd: result.costUsd,
    model: result.model,
    toolRounds: result.toolRounds,
  };
}
