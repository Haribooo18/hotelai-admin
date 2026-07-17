import type { SupabaseClient } from "@supabase/supabase-js";

import type { ConversationPriority } from "@/types/conversation";

export type RequestAIHandoffInput = {
  hotelId: string;
  conversationId: string;
  reason: string;
  urgency: Extract<ConversationPriority, "normal" | "high" | "urgent">;
  guestMessage?: string;
};

export type RequestAIHandoffResult = {
  handoff_requested: true;
  conversation_id: string;
  status: "handoff_requested";
  priority: Extract<ConversationPriority, "normal" | "high" | "urgent">;
  already_requested: boolean;
};

export async function requestAIHumanHandoff(
  supabase: SupabaseClient,
  input: RequestAIHandoffInput,
): Promise<RequestAIHandoffResult> {
  const now = new Date().toISOString();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("id, status, priority, internal_notes")
    .eq("id", input.conversationId)
    .eq("hotel_id", input.hotelId)
    .is("deleted_at", null)
    .maybeSingle();

  if (conversationError) throw conversationError;
  if (!conversation) throw new Error("Диалог не найден");

  if (
    conversation.status === "handoff_requested" ||
    conversation.status === "assigned"
  ) {
    return {
      handoff_requested: true,
      conversation_id: input.conversationId,
      status: "handoff_requested",
      priority: (conversation.priority ?? input.urgency) as RequestAIHandoffResult["priority"],
      already_requested: true,
    };
  }

  if (conversation.status === "resolved" || conversation.status === "archived") {
    throw new Error("Нельзя передать закрытый диалог сотруднику");
  }

  const existingNotes = (conversation.internal_notes as string | null)?.trim();
  const handoffNote = `[AI handoff ${now}] ${input.reason}`;
  const internalNotes = existingNotes
    ? `${existingNotes}\n${handoffNote}`
    : handoffNote;

  const { error: updateError } = await supabase
    .from("conversations")
    .update({
      status: "handoff_requested",
      priority: input.urgency,
      assigned_to: null,
      is_ai_typing: false,
      internal_notes: internalNotes,
      unread_count: 1,
    })
    .eq("id", input.conversationId)
    .eq("hotel_id", input.hotelId)
    .not("status", "in", '("handoff_requested","assigned","resolved","archived")');

  if (updateError) throw updateError;

  const { error: actionError } = await supabase.from("ai_actions").insert({
    hotel_id: input.hotelId,
    conversation_id: input.conversationId,
    action_type: "human_handoff",
    tool_name: "request_human_handoff",
    input: { reason: input.reason, urgency: input.urgency },
    output: { guest_message: input.guestMessage ?? null },
    status: "completed",
    completed_at: now,
  });

  if (actionError) throw actionError;

  const { error: messageError } = await supabase.from("messages").insert({
    hotel_id: input.hotelId,
    conversation_id: input.conversationId,
    role: "system",
    body: `AI запросил подключение сотрудника: ${input.reason}`,
    is_internal: true,
    metadata: {
      event: "human_handoff_requested",
      urgency: input.urgency,
      guest_message: input.guestMessage ?? null,
    },
  });

  if (messageError) throw messageError;

  return {
    handoff_requested: true,
    conversation_id: input.conversationId,
    status: "handoff_requested",
    priority: input.urgency,
    already_requested: false,
  };
}
