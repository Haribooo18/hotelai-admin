import type { Conversation } from "@/types/conversation";
import type { ConversationStatus } from "@/types/conversation";
import type { Lead } from "@/types/lead";
import type { Message } from "@/types/message";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

export type ConversationFilters = {
  search?: string;
  status?: string;
  channel?: string;
  priority?: string;
};

type ConversationInsertRow = {
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  channel: string;
  priority: string;
  subject: string | null;
  lead_id: string | null;
  status?: string;
  unread_count?: number;
};

type ConversationUpdateRow = Record<string, unknown>;

type MessageInsertRow = {
  conversation_id: string;
  body: string;
  is_internal: boolean;
  role?: string;
};

export class ConversationsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  private async attachTags(
    conversations: Conversation[]
  ): Promise<Conversation[]> {
    if (conversations.length === 0) return conversations;

    const ids = conversations.map((c) => c.id);

    const { data, error } = await this.ctx.supabase
      .from("conversation_tags")
      .select("conversation_id, tag")
      .in("conversation_id", ids);

    if (error) throwRepositoryError(error);

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

  async getAll(filters: ConversationFilters = {}): Promise<Conversation[]> {
    let query = this.ctx.supabase
      .from("conversations")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.channel) query = query.eq("channel", filters.channel);
    if (filters.priority) query = query.eq("priority", filters.priority);

    const { data, error } = await query;

    if (error) throwRepositoryError(error);

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

    return this.attachTags(rows);
  }

  async getById(id: string): Promise<Conversation | null> {
    const { data, error } = await this.ctx.supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throwRepositoryError(error);
    if (!data) return null;

    const [withTags] = await this.attachTags([data as Conversation]);
    return withTags;
  }

  async create(row: ConversationInsertRow): Promise<string> {
    const { data, error } = await this.ctx.supabase
      .from("conversations")
      .insert({
        hotel_id: this.ctx.hotelId,
        status: row.status ?? "new",
        unread_count: row.unread_count ?? 0,
        guest_name: row.guest_name,
        guest_email: row.guest_email,
        guest_phone: row.guest_phone,
        channel: row.channel,
        priority: row.priority,
        subject: row.subject,
        lead_id: row.lead_id,
      })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }

  async update(id: string, row: ConversationUpdateRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("conversations")
      .update(row)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("conversations")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.ctx.supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throwRepositoryError(error);

    return (data ?? []) as Message[];
  }

  async getLinkedLead(leadId: string): Promise<Lead | null> {
    const { data, error } = await this.ctx.supabase
      .from("leads")
      .select("*")
      .eq("lead_id", leadId)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as Lead | null) ?? null;
  }

  async getUnreadCount(): Promise<number> {
    const { count, error } = await this.ctx.supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .gt("unread_count", 0);

    if (error) throwRepositoryError(error);

    return count ?? 0;
  }

  async sendMessage(row: MessageInsertRow): Promise<{ id: string; created_at: string }> {
    const { data: message, error: msgError } = await this.ctx.supabase
      .from("messages")
      .insert({
        hotel_id: this.ctx.hotelId,
        conversation_id: row.conversation_id,
        role: row.role ?? "staff",
        body: row.body,
        is_internal: row.is_internal,
      })
      .select("id, created_at")
      .single();

    if (msgError) throwRepositoryError(msgError);

    return {
      id: message.id as string,
      created_at: message.created_at as string,
    };
  }

  async markRead(conversationId: string): Promise<void> {
    await this.update(conversationId, { unread_count: 0 });
  }

  async updateStatus(id: string, status: ConversationStatus): Promise<void> {
    await this.update(id, { status });
  }

  async updatePriority(
    id: string,
    priority: "low" | "normal" | "high" | "urgent"
  ): Promise<void> {
    await this.update(id, { priority });
  }

  async assignConversation(
    conversationId: string,
    userId: string,
    assignedBy: string
  ): Promise<void> {
    await this.ctx.supabase
      .from("conversation_assignments")
      .update({ is_active: false, unassigned_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("hotel_id", this.ctx.hotelId)
      .eq("is_active", true);

    const { error: assignError } = await this.ctx.supabase
      .from("conversation_assignments")
      .insert({
        hotel_id: this.ctx.hotelId,
        conversation_id: conversationId,
        user_id: userId,
        assigned_by: assignedBy,
        is_active: true,
      });

    if (assignError) throwRepositoryError(assignError);

    await this.update(conversationId, {
      assigned_to: userId,
      status: "assigned",
    });
  }

  async addTag(conversationId: string, tag: string): Promise<void> {
    const { error } = await this.ctx.supabase.from("conversation_tags").insert({
      hotel_id: this.ctx.hotelId,
      conversation_id: conversationId,
      tag,
    });

    if (error) throwRepositoryError(error);
  }
}
