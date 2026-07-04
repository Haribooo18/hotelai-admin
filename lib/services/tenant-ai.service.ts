import type { SupabaseClient } from "@supabase/supabase-js";

import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { DEFAULT_AI_SETTINGS } from "@/lib/ai/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Conversation } from "@/types/conversation";
import type { HotelAISettings } from "@/types/ai-settings";
import type { Message } from "@/types/message";

export type GenerateAIResponseForHotelOptions = {
  /** Defaults to service-role client for channel/webhook callers. */
  supabase?: SupabaseClient;
  hotelName?: string;
  messageMetadata?: Record<string, unknown>;
  /** When true, throws if AI is disabled instead of returning null. */
  throwIfDisabled?: boolean;
};

async function resolveHotelName(
  hotelId: string,
  supabase: SupabaseClient,
  provided?: string
): Promise<string> {
  if (provided) return provided;

  const { data, error } = await supabase
    .from("hotels")
    .select("name")
    .eq("id", hotelId)
    .maybeSingle();

  if (error) throw error;
  return (data?.name as string | undefined) ?? "Hotel";
}

async function getHotelAISettingsForHotel(
  hotelId: string,
  supabase: SupabaseClient
): Promise<HotelAISettings> {
  const { data, error } = await supabase
    .from("hotel_ai_settings")
    .select("*")
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const now = new Date().toISOString();
    return {
      hotel_id: hotelId,
      ...DEFAULT_AI_SETTINGS,
      created_at: now,
      updated_at: now,
    };
  }

  return {
    hotel_id: data.hotel_id,
    enabled: data.enabled,
    model: data.model,
    max_output_tokens: data.max_output_tokens,
    temperature: Number(data.temperature),
    top_p: Number(data.top_p ?? DEFAULT_AI_SETTINGS.top_p),
    tool_choice: (data.tool_choice ??
      DEFAULT_AI_SETTINGS.tool_choice) as HotelAISettings["tool_choice"],
    system_language: data.system_language ?? DEFAULT_AI_SETTINGS.system_language,
    rate_limit_per_minute: data.rate_limit_per_minute,
    timeout_ms: data.timeout_ms,
    max_tool_rounds: data.max_tool_rounds,
    max_retries: data.max_retries,
    extra_instructions: data.extra_instructions,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

async function getConversationForHotel(
  hotelId: string,
  conversationId: string,
  supabase: SupabaseClient
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return (data as Conversation | null) ?? null;
}

async function getMessagesForHotel(
  hotelId: string,
  conversationId: string,
  supabase: SupabaseClient
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("hotel_id", hotelId)
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}

async function setAITyping(
  supabase: SupabaseClient,
  hotelId: string,
  conversationId: string,
  typing: boolean
): Promise<void> {
  await supabase
    .from("conversations")
    .update({ is_ai_typing: typing })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

async function setConversationAiAnswering(
  supabase: SupabaseClient,
  hotelId: string,
  conversationId: string
): Promise<void> {
  await supabase
    .from("conversations")
    .update({ status: "ai_answering" })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

async function saveAIMessage(
  supabase: SupabaseClient,
  hotelId: string,
  conversationId: string,
  body: string,
  metadata: Record<string, unknown>
): Promise<string> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      hotel_id: hotelId,
      conversation_id: conversationId,
      role: "ai",
      body,
      metadata,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({
      status: "waiting_guest",
      is_ai_typing: false,
      last_message_preview: body.slice(0, 200),
      last_message_at: data.created_at,
    })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);

  return data.id as string;
}

/**
 * Tenant-scoped AI completion for authenticated staff and channel webhooks.
 * All queries are filtered by hotel_id. Uses service-role client by default
 * so channel ingress can trigger AI without a user session.
 */
export async function generateAIResponseForHotel(
  hotelId: string,
  conversationId: string,
  options: GenerateAIResponseForHotelOptions = {}
): Promise<{ messageId: string; content: string } | null> {
  const supabase = options.supabase ?? createAdminClient();

  const settings = await getHotelAISettingsForHotel(hotelId, supabase);
  if (!settings.enabled) {
    if (options.throwIfDisabled) {
      throw new Error("AI-ресепшн отключён в настройках отеля.");
    }
    return null;
  }

  const [hotelName, conversation, messages] = await Promise.all([
    resolveHotelName(hotelId, supabase, options.hotelName),
    getConversationForHotel(hotelId, conversationId, supabase),
    getMessagesForHotel(hotelId, conversationId, supabase),
  ]);

  if (!conversation) {
    throw new Error("Диалог не найден");
  }

  await setAITyping(supabase, hotelId, conversationId, true);
  await setConversationAiAnswering(supabase, hotelId, conversationId);

  try {
    const result = await aiOrchestrator.run({
      hotel: { id: hotelId, name: hotelName },
      conversation,
      messages,
      settings,
    });

    const messageId = await saveAIMessage(
      supabase,
      hotelId,
      conversationId,
      result.content,
      {
        model: result.model,
        usage: result.usage,
        cost_usd: result.costUsd,
        tool_rounds: result.toolRounds,
        provider: "openai",
        ...options.messageMetadata,
      }
    );

    return { messageId, content: result.content };
  } catch (err) {
    await setAITyping(supabase, hotelId, conversationId, false);
    throw err;
  }
}
