import { generateAIResponseForHotel } from "@/lib/services/tenant-ai.service";
import type { ChannelInboundMessage } from "@/lib/channels/types";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Conversation } from "@/types/conversation";

import { parseTelegramUpdate } from "./parser";
import { sendTelegramMessage } from "./sender";
import type { TelegramUpdate } from "./types";

const TELEGRAM_WEBHOOK_HEADER = "x-telegram-bot-api-secret-token";

export function getTelegramWebhookSecret(): string | undefined {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || undefined;
}

export function getTelegramHotelId(): string {
  return (
    process.env.TELEGRAM_HOTEL_ID?.trim() ||
    process.env.DEFAULT_HOTEL_ID ||
    "hotel_aurora"
  );
}

export function validateWebhookSecret(
  headerValue: string | null,
  expectedSecret: string | undefined = getTelegramWebhookSecret()
): boolean {
  if (!expectedSecret) {
    return false;
  }
  return headerValue === expectedSecret;
}

export async function findTelegramConversation(
  hotelId: string,
  externalChatId: string
): Promise<Conversation | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("hotel_id", hotelId)
    .eq("channel", "telegram")
    .eq("guest_phone", externalChatId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return (data as Conversation | null) ?? null;
}

export async function createTelegramConversation(
  hotelId: string,
  inbound: ChannelInboundMessage
): Promise<Conversation> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      hotel_id: hotelId,
      guest_name: inbound.guestName,
      guest_email: null,
      guest_phone: inbound.externalChatId,
      channel: "telegram",
      status: "new",
      priority: "normal",
      subject: inbound.guestUsername
        ? `Telegram @${inbound.guestUsername}`
        : "Telegram",
      unread_count: 0,
      last_message_preview: inbound.body.slice(0, 200),
      last_message_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Conversation;
}

export async function findOrCreateTelegramConversation(
  hotelId: string,
  inbound: ChannelInboundMessage
): Promise<{ conversation: Conversation; created: boolean }> {
  const existing = await findTelegramConversation(hotelId, inbound.externalChatId);
  if (existing) {
    return { conversation: existing, created: false };
  }

  const conversation = await createTelegramConversation(hotelId, inbound);
  return { conversation, created: true };
}

export async function insertTelegramGuestMessage(
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

export async function processTelegramUpdate(
  update: TelegramUpdate
): Promise<{ handled: boolean; reason?: string }> {
  const inbound = parseTelegramUpdate(update);
  if (!inbound) {
    return { handled: false, reason: "unsupported_update" };
  }

  const hotelId = getTelegramHotelId();
  const { conversation } = await findOrCreateTelegramConversation(
    hotelId,
    inbound
  );

  await insertTelegramGuestMessage(hotelId, conversation.id, inbound);

  const aiResult = await generateAIResponseForHotel(hotelId, conversation.id, {
    messageMetadata: { channel: "telegram" },
  });

  if (!aiResult) {
    return { handled: true, reason: "ai_disabled" };
  }

  const sendResult = await sendTelegramMessage({
    externalChatId: inbound.externalChatId,
    body: aiResult.content,
  });

  if (!sendResult.ok) {
    throw new Error(sendResult.error ?? "Не удалось отправить сообщение в Telegram");
  }

  return { handled: true };
}

export async function handleTelegramWebhook(request: Request): Promise<Response> {
  const secret = getTelegramWebhookSecret();
  const headerSecret = request.headers.get(TELEGRAM_WEBHOOK_HEADER);

  if (!validateWebhookSecret(headerSecret, secret)) {
    return new Response(JSON.stringify({ error: "Недопустимый секрет вебхука" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return new Response(JSON.stringify({ error: "Некорректный JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await processTelegramUpdate(update);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка обработки вебхука";
    console.error("[telegram-webhook]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
