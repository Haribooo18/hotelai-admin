"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import {
  knowledgeArticleCreateSchema,
  knowledgeArticleUpdateSchema,
  type KnowledgeArticleCreateInput,
  type KnowledgeArticleUpdateInput,
} from "@/lib/validations/knowledge";

function revalidateKnowledge() {
  revalidatePath("/ai");
}

function toRow(data: Omit<KnowledgeArticleUpdateInput, "id">) {
  return {
    title: data.title,
    slug: data.slug || null,
    content: data.content,
    category: data.category || null,
    is_pinned: data.is_pinned,
    tags: data.tags,
  };
}

export async function createKnowledgeArticle(input: KnowledgeArticleCreateInput) {
  const parsed = knowledgeArticleCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase.from("knowledge_articles").insert({
    hotel_id: hotelId,
    ...toRow(parsed.data),
  });

  if (error) throw error;

  revalidateKnowledge();
}

export async function updateKnowledgeArticle(input: KnowledgeArticleUpdateInput) {
  const parsed = knowledgeArticleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...rest } = parsed.data;

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("knowledge_articles")
    .update(toRow(rest))
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateKnowledge();
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
