import {
  rankKnowledgeArticles,
  type KnowledgeSearchFilters,
} from "@/lib/knowledge-search";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";

import type {
  KnowledgeArticle,
  KnowledgeSearchResult,
} from "@/types/knowledge-article";

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const repo = await createKnowledgeRepository();
  return repo.getAll();
}

export async function getPublishedKnowledgeArticles(): Promise<
  KnowledgeArticle[]
> {
  const repo = await createKnowledgeRepository();
  return repo.getPublished();
}

export async function getKnowledgeArticle(
  id: string
): Promise<KnowledgeArticle | null> {
  const repo = await createKnowledgeRepository();
  return repo.getById(id);
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

export async function getKnowledgeCategories(): Promise<string[]> {
  const repo = await createKnowledgeRepository();
  return repo.getCategories();
}
