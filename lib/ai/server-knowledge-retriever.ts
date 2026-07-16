import { searchPublishedKnowledge } from "@/lib/services/knowledge.service";

import type { KnowledgeRetriever } from "./knowledge-retriever";

/**
 * Server-side knowledge retriever backed by ranked lexical search.
 * Tenant scope is enforced inside knowledge services via `getCurrentHotelId`.
 */
export const serverKnowledgeRetriever: KnowledgeRetriever = {
  async retrieve({ query, limit = 5, language, publishedOnly = true }) {
    const results = publishedOnly
      ? await searchPublishedKnowledge(query, limit)
      : await import("@/lib/services/knowledge.service").then((m) =>
          m.searchKnowledgeArticles(query, { limit, language })
        );

    const filtered = language
      ? results.filter((r) => r.language === language)
      : results;

    return filtered.slice(0, limit).map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      category: a.category,
      language: a.language,
      priority: a.priority,
      score: a.score,
    }));
  },
};
