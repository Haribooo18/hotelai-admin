import type { Conversation } from "@/types/conversation";
import type { AITokenUsage } from "@/types/ai-settings";
import type { Guest } from "@/types/guest";

import { CurrentPromptVersion } from "./prompt-version";
import { opsLogger } from "@/lib/ops/logger";
import type { AIRequest } from "./types";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Database side effects for one AI completion turn: marking the
 * conversation as "AI is typing", persisting the reply, and writing the
 * `ai_actions` audit trail (start/complete/failed/tool-call). Extracted
 * from orchestrator.ts, which owns the actual completion/streaming logic
 * and just calls these — none of them touch AIOrchestrator's internal
 * state, so they don't need to live in the same file or class.
 */

export async function setConversationAIActive(
  conversationId: string,
  hotelId: string
): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("conversations")
    .update({ is_ai_typing: true, status: "ai_answering" })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

/**
 * Resolves a returning guest record for this conversation, if one exists,
 * so their VIP status and known identity land in the system prompt from
 * the first reply rather than depending on the model deciding to call the
 * `get_guest` tool on its own. The tool itself stays available for
 * mid-conversation lookups (e.g. a phone number given later that doesn't
 * match the conversation's own guest_phone/guest_email) — this is a
 * separate, deterministic path for what's already known up front.
 *
 * Matched by conversation.guest_phone / guest_email. Note that for
 * Telegram, guest_phone currently holds the Telegram chat id (see
 * findTelegramConversation), not a real phone number, so this will only
 * find a match once a guest has actually shared their real phone/email in
 * a previous booking — which is exactly the "returning guest" case this
 * exists for.
 */
export async function resolveGuestForConversation(
  hotelId: string,
  conversation: Pick<Conversation, "guest_phone" | "guest_email">
): Promise<
  Pick<Guest, "id" | "first_name" | "last_name" | "email" | "phone" | "is_vip"> | null
> {
  const phone = conversation.guest_phone?.trim();
  const email = conversation.guest_email?.trim();
  if (!phone && !email) return null;

  // Best-effort enrichment — a lookup failure here (a real Supabase error,
  // or a client that doesn't implement .select at all) should degrade to
  // "no known guest info" rather than block the whole AI reply. The whole
  // call chain is wrapped, not just the awaited { error } field, because a
  // missing/incompatible method on the client throws synchronously before
  // any Promise exists to await.
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("guests")
      .select("id, first_name, last_name, email, phone, is_vip")
      .eq("hotel_id", hotelId)
      .is("deleted_at", null);

    query = email ? query.eq("email", email) : query.eq("phone", phone as string);

    const { data, error } = await query.maybeSingle();
    if (error) {
      opsLogger.error({
        module: "ai",
        operation: "resolve_guest",
        message: error.message,
        hotelId,
      });
      return null;
    }

    return data;
  } catch (err) {
    opsLogger.error({
      module: "ai",
      operation: "resolve_guest",
      message: err instanceof Error ? err.message : "Unknown error",
      hotelId,
    });
    return null;
  }
}

export async function clearConversationAITyping(
  conversationId: string,
  hotelId: string
): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("conversations")
    .update({ is_ai_typing: false })
    .eq("id", conversationId)
    .eq("hotel_id", hotelId);
}

export async function persistAIMessage(input: {
  hotelId: string;
  conversationId: string;
  body: string;
  metadata: Record<string, unknown>;
}): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      hotel_id: input.hotelId,
      conversation_id: input.conversationId,
      role: "ai",
      body: input.body,
      metadata: input.metadata,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({
      status: "waiting_guest",
      is_ai_typing: false,
      last_message_preview: input.body.slice(0, 200),
      last_message_at: data.created_at,
    })
    .eq("id", input.conversationId)
    .eq("hotel_id", input.hotelId);

  return data.id as string;
}

export async function logAIActionStart(input: {
  hotelId: string;
  conversationId: string;
  request: AIRequest;
  model: string;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("ai_actions")
    .insert({
      hotel_id: input.hotelId,
      conversation_id: input.conversationId,
      action_type: "completion",
      tool_name: null,
      input: {
        system_prompt_length: input.request.systemPrompt.length,
        knowledge_count: input.request.knowledgeSnippets.length,
        message_count: input.request.messages.length,
        prompt_version: input.request.promptVersion ?? CurrentPromptVersion,
        system_prompt_hash: input.request.systemPromptHash,
      },
      status: "pending",
      model: input.model,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function logAIActionComplete(input: {
  actionId: string;
  output: Record<string, unknown>;
  model: string;
  usage: AITokenUsage;
  costUsd: number;
  durationMs: number;
  requestId: string;
}) {
  const supabase = createAdminClient();

  await supabase
    .from("ai_actions")
    .update({
      status: "completed",
      output: input.output,
      model: input.model,
      token_usage: input.usage,
      cost_usd: input.costUsd,
      duration_ms: input.durationMs,
      request_id: input.requestId,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId);
}

export async function logAIActionFailed(input: {
  actionId: string;
  errorMessage: string;
}) {
  const supabase = createAdminClient();

  await supabase
    .from("ai_actions")
    .update({
      status: "failed",
      error_message: input.errorMessage,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId);
}

export async function logAIActionTool(input: {
  hotelId: string;
  conversationId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  model: string;
}) {
  const supabase = createAdminClient();

  await supabase.from("ai_actions").insert({
    hotel_id: input.hotelId,
    conversation_id: input.conversationId,
    action_type: "tool_call",
    tool_name: input.toolName,
    input: input.input,
    output: input.output,
    status: "completed",
    model: input.model,
    completed_at: new Date().toISOString(),
  });
}
