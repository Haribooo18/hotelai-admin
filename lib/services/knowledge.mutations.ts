"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { slugifyTitle } from "@/lib/knowledge";
import { getCurrentHotelId, getCurrentUser } from "@/lib/tenant";
import {
  knowledgeArticleCreateSchema,
  knowledgeArticleUpdateSchema,
  knowledgeArticleAutosaveSchema,
  type KnowledgeArticleCreateInput,
  type KnowledgeArticleUpdateInput,
  type KnowledgeArticleAutosaveInput,
} from "@/lib/validations/knowledge";

function revalidateKnowledge() {
  revalidatePath("/knowledge");
  revalidatePath("/ai");
}

function toRow(
  data: Omit<KnowledgeArticleUpdateInput, "id">,
  userId: string | null
) {
  return {
    title: data.title,
    slug: data.slug || slugifyTitle(data.title) || null,
    content: data.content,
    category: data.category || null,
    language: data.language,
    priority: data.priority,
    status: data.status,
    is_pinned: data.is_pinned,
    tags: data.tags,
    search_keywords: data.search_keywords,
    updated_by: userId,
  };
}

export async function createKnowledgeArticle(input: KnowledgeArticleCreateInput) {
  const parsed = knowledgeArticleCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { data, error } = await supabase
    .from("knowledge_articles")
    .insert({
      hotel_id: hotelId,
      created_by: user?.id ?? null,
      ...toRow(parsed.data, user?.id ?? null),
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidateKnowledge();
  return data.id as string;
}

export async function updateKnowledgeArticle(input: KnowledgeArticleUpdateInput) {
  const parsed = knowledgeArticleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...rest } = parsed.data;

  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { error } = await supabase
    .from("knowledge_articles")
    .update(toRow(rest, user?.id ?? null))
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function autosaveKnowledgeArticle(
  input: KnowledgeArticleAutosaveInput
) {
  const parsed = knowledgeArticleAutosaveSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...fields } = parsed.data;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (fields.title !== undefined) patch.title = fields.title;
  if (fields.content !== undefined) patch.content = fields.content;
  if (fields.category !== undefined) patch.category = fields.category || null;
  if (fields.language !== undefined) patch.language = fields.language;
  if (fields.priority !== undefined) patch.priority = fields.priority;
  if (fields.tags !== undefined) patch.tags = fields.tags;
  if (fields.search_keywords !== undefined) {
    patch.search_keywords = fields.search_keywords;
  }
  if (fields.is_pinned !== undefined) patch.is_pinned = fields.is_pinned;

  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);
  patch.updated_by = user?.id ?? null;

  const { error } = await supabase
    .from("knowledge_articles")
    .update(patch)
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;
}

export async function deleteKnowledgeArticle(id: string) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("knowledge_articles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function pinKnowledgeArticle(id: string, pinned: boolean) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("knowledge_articles")
    .update({ is_pinned: pinned })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function publishKnowledgeArticle(id: string) {
  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { data: current, error: readError } = await supabase
    .from("knowledge_articles")
    .select("version")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .single();

  if (readError) throw readError;

  const { error } = await supabase
    .from("knowledge_articles")
    .update({
      status: "published",
      version: (current.version as number) + 1,
      updated_by: user?.id ?? null,
    })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function unpublishKnowledgeArticle(id: string) {
  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { error } = await supabase
    .from("knowledge_articles")
    .update({
      status: "draft",
      updated_by: user?.id ?? null,
    })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function archiveKnowledgeArticle(id: string) {
  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { error } = await supabase
    .from("knowledge_articles")
    .update({
      status: "archived",
      is_pinned: false,
      updated_by: user?.id ?? null,
    })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
}

export async function duplicateKnowledgeArticle(id: string) {
  const supabase = await createClient();
  const [hotelId, user] = await Promise.all([
    getCurrentHotelId(),
    getCurrentUser(),
  ]);

  const { data: source, error: readError } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .single();

  if (readError) throw readError;

  const { data, error } = await supabase
    .from("knowledge_articles")
    .insert({
      hotel_id: hotelId,
      title: `${source.title} (копия)`,
      slug: null,
      content: source.content,
      category: source.category,
      language: source.language,
      priority: source.priority,
      status: "draft",
      version: 1,
      is_pinned: false,
      tags: source.tags,
      search_keywords: source.search_keywords,
      created_by: user?.id ?? null,
      updated_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidateKnowledge();
  return data.id as string;
}
