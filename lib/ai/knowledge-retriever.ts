import type { KnowledgeArticle } from "@/types/knowledge-article";

export type KnowledgeQuery = {
  hotelId: string;
  query: string;
  limit?: number;
  language?: string;
  category?: string;
  /** Restrict to published articles (default true for AI retrieval). */
  publishedOnly?: boolean;
};

export type RetrievedKnowledge = Pick<
  KnowledgeArticle,
  "id" | "title" | "content" | "category" | "language" | "priority"
> & {
  score?: number;
};

/**
 * Retrieves relevant knowledge-base snippets for RAG.
 * Implementations may use full-text search, embeddings, or hybrid retrieval.
 */
export type KnowledgeRetriever = {
  retrieve(input: KnowledgeQuery): Promise<RetrievedKnowledge[]>;
};
