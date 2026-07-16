export type KnowledgeArticleStatus = "draft" | "published" | "archived";

export type KnowledgeArticlePriority = "low" | "normal" | "high";

export type KnowledgeArticle = {
  id: string;
  hotel_id: string;

  title: string;
  slug: string | null;
  content: string;
  category: string | null;

  language: string;
  priority: KnowledgeArticlePriority;
  status: KnowledgeArticleStatus;
  version: number;

  is_pinned: boolean;
  tags: string[];
  search_keywords: string[];

  created_by: string | null;
  updated_by: string | null;

  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type KnowledgeSearchResult = KnowledgeArticle & {
  score: number;
  matchedFields: string[];
};
