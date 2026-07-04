import { createClient } from "@/lib/supabase/server";
import {
  rankKnowledgeArticles,
  type KnowledgeSearchFilters,
} from "@/lib/knowledge-search";
import { getCurrentHotelId } from "@/lib/tenant";

import type {
  KnowledgeArticle,
  KnowledgeSearchResult,
} from "@/types/knowledge-article";

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

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw formatError(error);

  return (data ?? []) as KnowledgeArticle[];
}

export async function getPublishedKnowledgeArticles(): Promise<
  KnowledgeArticle[]
> {
  const articles = await getKnowledgeArticles();
  return articles.filter((a) => a.status === "published");
}

export async function getKnowledgeArticle(
  id: string
): Promise<KnowledgeArticle | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw formatError(error);

  return (data as KnowledgeArticle | null) ?? null;
}

export async function searchKnowledgeArticles(
  query: string,
  filters: Omit<KnowledgeSearchFilters, "query"> = {}
): Promise<KnowledgeSearchResult[]> {
  const articles = await getKnowledgeArticles();
  return rankKnowledgeArticles(articles, { ...filters, query });
}

export async function searchPublishedKnowledge(
  query: string,
  limit = 5
): Promise<KnowledgeSearchResult[]> {
  return searchKnowledgeArticles(query, { publishedOnly: true, limit });
}

export async function getPinnedKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const articles = await getPublishedKnowledgeArticles();
  return articles.filter((a) => a.is_pinned);
}

export async function getRecentKnowledgeArticles(
  limit = 5
): Promise<KnowledgeArticle[]> {
  const articles = await getPublishedKnowledgeArticles();
  return articles.slice(0, limit);
}

export async function getKnowledgeCategories(): Promise<string[]> {
  const articles = await getKnowledgeArticles();
  const set = new Set<string>();
  for (const a of articles) {
    if (a.category) set.add(a.category);
  }
  return Array.from(set).sort();
}
