import { streamAIResponseForHotel } from "@/lib/services/tenant-ai.service";
import type { ChannelInboundMessage } from "@/lib/channels/types";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Conversation } from "@/types/conversation";

import { logWebsiteWidget, toPublicWebsiteErrorMessage } from "./logger";
import { parseWebsiteInboundFrame, toChannelInboundMessage } from "./parser";
import {
  mapOrchestratorEventToWebsite,
  sendWebsiteError,
  type WebsiteSendFn,
} from "./sender";
import type { WebsiteInboundFrame } from "./types";

export type WebsiteConnectionState = {
  sessionId: string;
  hotelId: string;
  conversationId: string | null;
  abortController: AbortController | null;
};

const connections = new Map<string, WebsiteConnectionState>();

export function getWebsiteHotelId(): string {
  return (
    process.env.WEBSITE_CHAT_HOTEL_ID?.trim() ||
    process.env.DEFAULT_HOTEL_ID ||
    "hotel_aurora"
  );
}

export function registerWebsiteConnection(
  sessionId: string,
  hotelId: string = getWebsiteHotelId()
): WebsiteConnectionState {
  const existing = connections.get(sessionId);
  if (existing) {
    return existing;
  }

  const state: WebsiteConnectionState = {
    sessionId,
    hotelId,
    conversationId: null,
    abortController: null,
  };
  connections.set(sessionId, state);
  return state;
}

export function getWebsiteConnection(
  sessionId: string
): WebsiteConnectionState | undefined {
  return connections.get(sessionId);
}

export async function cleanupWebsiteStream(sessionId: string): Promise<void> {
  const state = connections.get(sessionId);
  if (!state) return;

  state.abortController?.abort();

  if (state.conversationId) {
    const supabase = createAdminClient();
    await supabase
      .from("conversations")
      .update({ is_ai_typing: false })
      .eq("id", state.conversationId)
      .eq("hotel_id", state.hotelId);
  }

  connections.delete(sessionId);
}

export async function findWebsiteConversation(
  hotelId: string,
  sessionId: string
): Promise<Conversation | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("hotel_id", hotelId)
    .eq("channel", "website")
    .eq("guest_phone", sessionId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return (data as Conversation | null) ?? null;
}

export async function createWebsiteConversation(
  hotelId: string,
  inbound: ChannelInboundMessage
): Promise<Conversation> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const guestEmail =
    typeof inbound.metadata.website === "object" &&
    inbound.metadata.website !== null &&
    "guest_email" in inbound.metadata.website
      ? (inbound.metadata.website as { guest_email?: string | null })
          .guest_email
      : null;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      hotel_id: hotelId,
      guest_name: inbound.guestName,
      guest_email: guestEmail,
      guest_phone: inbound.externalChatId,
      channel: "website",
      status: "new",
      priority: "normal",
      subject: "Website Chat",
      unread_count: 0,
      last_message_preview: inbound.body.slice(0, 200),
      last_message_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Conversation;
}

export async function findOrCreateWebsiteConversation(
  hotelId: string,
  inbound: ChannelInboundMessage
): Promise<{ conversation: Conversation; created: boolean }> {
  const existing = await findWebsiteConversation(hotelId, inbound.externalChatId);
  if (existing) {
    return { conversation: existing, created: false };
  }

  const conversation = await createWebsiteConversation(hotelId, inbound);
  return { conversation, created: true };
}

export async function insertWebsiteGuestMessage(
  hotelId: string,
  conversationId: string,
  inbound: ChannelInboundMessage
): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      hotel_id: hotelId,
      conversation_id: conversationId,
      role: "guest",
      body: inbound.body,
      metadata: inbound.metadata,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({
      status: "new",
      guest_name: inbound.guestName,
      last_message_preview: inbound.body.slice(0, 200),
      last_message_at: data.created_at,
      unread_count: 1,
    })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);

  return data.id as string;
}

export async function processWebsiteGuestMessage(
  frame: WebsiteInboundFrame,
  send: WebsiteSendFn,
  signal?: AbortSignal
): Promise<void> {
  const hotelId = frame.hotel_id?.trim();
  if (!hotelId) {
    sendWebsiteError(send, "hotel_id is required");
    return;
  }

  const inbound = toChannelInboundMessage(frame);

  const connection = registerWebsiteConnection(frame.session_id, hotelId);
  connection.abortController?.abort();
  connection.abortController = new AbortController();

  const combinedSignal = signal
    ? AbortSignal.any([signal, connection.abortController.signal])
    : connection.abortController.signal;

  const { conversation } = await findOrCreateWebsiteConversation(hotelId, inbound);
  connection.conversationId = conversation.id;

  const guestMessageId = await insertWebsiteGuestMessage(
    hotelId,
    conversation.id,
    inbound
  );

  send({
    type: "ack",
    guest_message_id: guestMessageId,
    conversation_id: conversation.id,
  });

  let streamed = false;

  for await (const event of streamAIResponseForHotel(
    hotelId,
    conversation.id,
    { signal: combinedSignal }
  )) {
    streamed = true;
    const mapped = mapOrchestratorEventToWebsite(event);
    if (mapped) {
      send(mapped);
    }
  }

  if (!streamed) {
    send({ type: "ai_disabled" });
  }
}

export async function handleWebsiteStream(
  raw: unknown,
  send: WebsiteSendFn,
  signal?: AbortSignal
): Promise<void> {
  const frame = parseWebsiteInboundFrame(raw);
  if (!frame) {
    sendWebsiteError(send, "Некорректное сообщение");
    return;
  }

  try {
    await processWebsiteGuestMessage(frame, send, signal);
  } catch (err) {
    if (signal?.aborted) {
      return;
    }
    logWebsiteWidget("disconnect", {
      session_id: frame.session_id,
      hotel_id: frame.hotel_id,
      reason: "processing_error",
    });
    sendWebsiteError(send, toPublicWebsiteErrorMessage(err));
  }
}

export function __resetWebsiteStreamsForTests(): void {
  connections.clear();
}
