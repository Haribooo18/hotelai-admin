import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { Lead } from "@/types/lead";

function formatError(error: {
  code?: string;
  message: string;
  details?: string | null;
}) {
  return new Error(
    `${error.code ?? "error"}: ${error.message}${
      error.details ? ` (${error.details})` : ""
    }`
  );
}

async function attachTags(
  conversations: Conversation[]
): Promise<Conversation[]> {
  if (conversations.length === 0) return conversations;

  const supabase = await createClient();
  const ids = conversations.map((c) => c.id);

  const { data, error } = await supabase
    .from("conversation_tags")
    .select("conversation_id, tag")
    .in("conversation_id", ids);

  if (error) throw formatError(error);

  const tagMap = new Map<string, string[]>();
  for (const row of data ?? []) {
    const list = tagMap.get(row.conversation_id) ?? [];
    list.push(row.tag);
    tagMap.set(row.conversation_id, list);
  }

  return conversations.map((c) => ({
    ...c,
    tags: tagMap.get(c.id) ?? [],
  }));
}

export type ConversationFilters = {
  search?: string;
  status?: string;
  channel?: string;
  priority?: string;
};

export async function getConversations(
  filters: ConversationFilters = {}
): Promise<Conversation[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  let query = supabase
    .from("conversations")
    .select("*")
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.channel) query = query.eq("channel", filters.channel);
  if (filters.priority) query = query.eq("priority", filters.priority);

  const { data, error } = await query;

  if (error) throw formatError(error);

  let rows = (data ?? []) as Conversation[];

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    rows = rows.filter((c) => {
      const haystack = [
        c.guest_name,
        c.guest_email ?? "",
        c.guest_phone ?? "",
        c.subject ?? "",
        c.last_message_preview ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return attachTags(rows);
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw formatError(error);
  if (!data) return null;

  const [withTags] = await attachTags([data as Conversation]);
  return withTags;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw formatError(error);

  return (data ?? []) as Message[];
}

/** Fetches a linked lead when conversation.lead_id is set. */
export async function getLinkedLead(leadId: string): Promise<Lead | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("lead_id", leadId)
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) throw formatError(error);

  return (data as Lead | null) ?? null;
}

export async function getUnreadConversationCount(): Promise<number> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { count, error } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .gt("unread_count", 0);

  if (error) throw formatError(error);

  return count ?? 0;
}
