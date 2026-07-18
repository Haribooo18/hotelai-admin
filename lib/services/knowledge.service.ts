import type { SupabaseClient } from "@supabase/supabase-js";

import {
  rankKnowledgeArticles,
  type KnowledgeSearchFilters,
} from "@/lib/knowledge-search";
import { toKnowledgeArticle } from "@/lib/database/mappers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRepositoryContext } from "@/lib/tenant/repository-context";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { throwRepositoryError } from "@/repositories/context.types";

import type { DbKnowledgeArticleRow } from "@/types/database/generated";
import type {
  KnowledgeArticle,
  KnowledgeSearchResult,
} from "@/types/knowledge-article";

/**
 * Dashboard API.
 *
 * Resolves the current authenticated tenant from the user session.
 */
export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const ctx = await getRepositoryContext();
  return createKnowledgeRepository(ctx).getAll();
}

/**
 * Channel/runtime API.
 *
 * Uses an explicit hotel ID and service-role client, so it does not depend
 * on an authenticated dashboard session.
 */
export async function getKnowledgeArticlesForHotel(
  hotelId: string,
  supabase: SupabaseClient = createAdminClient()
): Promise<KnowledgeArticle[]> {
  const normalizedHotelId = hotelId.trim();

  if (!normalizedHotelId) {
    throw new Error("hotelId is required");
  }

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("hotel_id", normalizedHotelId)
    .is("deleted_at", null)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throwRepositoryError(error);
  }

  return ((data ?? []) as DbKnowledgeArticleRow[]).map(toKnowledgeArticle);
}

export async function getPublishedKnowledgeArticles(): Promise<
  KnowledgeArticle[]
> {
  const ctx = await getRepositoryContext();
  return createKnowledgeRepository(ctx).getPublished();
}

export async function getPublishedKnowledgeArticlesForHotel(
  hotelId: string,
  supabase: SupabaseClient = createAdminClient()
): Promise<KnowledgeArticle[]> {
  const articles = await getKnowledgeArticlesForHotel(hotelId, supabase);
  return articles.filter((article) => article.status === "published");
}

export async function getKnowledgeArticle(
  id: string
): Promise<KnowledgeArticle | null> {
  const ctx = await getRepositoryContext();
  return createKnowledgeRepository(ctx).getById(id);
}

export async function searchKnowledgeArticles(
  query: string,
  filters: Omit<KnowledgeSearchFilters, "query"> = {}
): Promise<KnowledgeSearchResult[]> {
  const articles = await getKnowledgeArticles();
  return rankKnowledgeArticles(articles, { ...filters, query });
}

export async function searchKnowledgeArticlesForHotel(
  hotelId: string,
  query: string,
  filters: Omit<KnowledgeSearchFilters, "query"> = {},
  supabase: SupabaseClient = createAdminClient()
): Promise<KnowledgeSearchResult[]> {
  const articles = await getKnowledgeArticlesForHotel(hotelId, supabase);
  const ranked = rankKnowledgeArticles(articles, {
    ...filters,
    query,
  });


  return ranked;
}

export async function searchPublishedKnowledge(
  query: string,
  limit = 5
): Promise<KnowledgeSearchResult[]> {
  return searchKnowledgeArticles(query, {
    publishedOnly: true,
    limit,
  });
}

export async function searchPublishedKnowledgeForHotel(
  hotelId: string,
  query: string,
  limit = 5,
  supabase: SupabaseClient = createAdminClient()
): Promise<KnowledgeSearchResult[]> {
  return searchKnowledgeArticlesForHotel(
    hotelId,
    query,
    {
      publishedOnly: true,
      limit,
    },
    supabase
  );
}

export async function getKnowledgeCategories(): Promise<string[]> {
  const ctx = await getRepositoryContext();
  return createKnowledgeRepository(ctx).getCategories();
}