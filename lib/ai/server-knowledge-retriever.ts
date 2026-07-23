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

    const byCategory = results.filter((result) => {
      if (category && result.category !== category) return false;
      return true;
    });

    // Language is a soft preference here, not a hard requirement. The
    // detected language can default to a guess (e.g. a guest writing in a
    // script the detector doesn't recognize falls back to a default
    // language) — excluding every article that doesn't match that guess
    // used to mean those guests got zero knowledge base results even when
    // a perfectly relevant article existed, just tagged with a different
    // language. Prefer a language match when one exists; otherwise fall
    // back to the best relevance-ranked results regardless of language
    // rather than showing the guest nothing.
    const languageMatched = language
      ? byCategory.filter((result) => result.language === language)
      : byCategory;

    const filtered = languageMatched.length > 0 ? languageMatched : byCategory;

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