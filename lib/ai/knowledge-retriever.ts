import type { KnowledgeArticle } from "@/types/knowledge-article";

export type KnowledgeQuery = {
  hotelId: string;
  query: string;
  limit?: number;
};

/**
 * Retrieves relevant knowledge-base snippets for RAG.
 * Implementations may use full-text search, embeddings, or hybrid retrieval.
 */
export type KnowledgeRetriever = {
  retrieve(input: KnowledgeQuery): Promise<
    Pick<KnowledgeArticle, "id" | "title" | "content" | "category">[]
  >;
};
