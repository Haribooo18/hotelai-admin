import type { KnowledgeRetriever } from "./knowledge-retriever";
import { searchKnowledgeArticles } from "@/lib/services/knowledge.service";

/**
 * Server-side knowledge retriever backed by `knowledge_articles`.
 * Tenant scope is enforced inside `searchKnowledgeArticles` via `getCurrentHotelId`.
 * Wire via `configureAIServices({ knowledgeRetriever: serverKnowledgeRetriever })`
 * inside a Server Action or background job — not in Client Components.
 */
export const serverKnowledgeRetriever: KnowledgeRetriever = {
  async retrieve({ query, limit = 5 }) {
    const articles = await searchKnowledgeArticles(query);
    return articles.slice(0, limit).map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      category: a.category,
    }));
  },
};
