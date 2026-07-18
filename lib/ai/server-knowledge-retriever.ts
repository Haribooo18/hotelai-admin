import {
  searchKnowledgeArticlesForHotel,
  searchPublishedKnowledgeForHotel,
} from "@/lib/services/knowledge.service";

import type { KnowledgeRetriever } from "./knowledge-retriever";

/**
 * Server-side knowledge retriever backed by ranked lexical search.
 *
 * Tenant scope is explicit: channel callers provide hotelId and retrieval
 * uses the service-role client without requiring a dashboard user session.
 */
export const serverKnowledgeRetriever: KnowledgeRetriever = {
  async retrieve({
    hotelId,
    query,
    limit = 5,
    language,
    category,
    publishedOnly = true,
  }) {
    const results = publishedOnly
      ? await searchPublishedKnowledgeForHotel(hotelId, query, limit)
      : await searchKnowledgeArticlesForHotel(hotelId, query, {
          limit,
          language,
          category,
        });

    const filtered = results.filter((result) => {
      if (language && result.language !== language) {
        return false;
      }

      if (category && result.category !== category) {
        return false;
      }

      return true;
    });

    return filtered.slice(0, limit).map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      category: article.category,
      language: article.language,
      priority: article.priority,
      score: article.score,
    }));
  },
};