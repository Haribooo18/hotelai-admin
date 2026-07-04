export type KnowledgeArticle = {
  id: string;
  hotel_id: string;

  title: string;
  slug: string | null;
  content: string;
  category: string | null;

  is_pinned: boolean;
  tags: string[];

  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
