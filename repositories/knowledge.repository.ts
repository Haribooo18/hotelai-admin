import type {
  KnowledgeArticle,
  KnowledgeArticlePriority,
  KnowledgeArticleStatus,
} from "@/types/knowledge-article";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

type KnowledgeInsertRow = {
  title: string;
  slug: string | null;
  content: string;
  category: string | null;
  language: string;
  priority: KnowledgeArticlePriority;
  status: KnowledgeArticleStatus;
  is_pinned: boolean;
  tags: string[];
  search_keywords: string[];
  created_by: string | null;
  updated_by: string | null;
};

type KnowledgeUpdateRow = Omit<KnowledgeInsertRow, "created_by">;

type KnowledgeAutosavePatch = Record<string, unknown>;

export class KnowledgeRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async getAll(): Promise<KnowledgeArticle[]> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return (data ?? []) as KnowledgeArticle[];
  }

  async getById(id: string): Promise<KnowledgeArticle | null> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as KnowledgeArticle | null) ?? null;
  }

  async create(row: KnowledgeInsertRow): Promise<string> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .insert({
        hotel_id: this.ctx.hotelId,
        ...row,
      })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }

  async update(id: string, row: KnowledgeUpdateRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update(row)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async autosave(id: string, patch: KnowledgeAutosavePatch): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update(patch)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({ is_pinned: pinned })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getVersion(id: string): Promise<number> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .select("version")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .single();

    if (error) throwRepositoryError(error);

    return data.version as number;
  }

  async publish(id: string, version: number, updatedBy: string | null): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "published",
        version,
        updated_by: updatedBy,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getPublished(): Promise<KnowledgeArticle[]> {
    const articles = await this.getAll();
    return articles.filter((a) => a.status === "published");
  }

  async getCategories(): Promise<string[]> {
    const articles = await this.getAll();
    const set = new Set<string>();
    for (const a of articles) {
      if (a.category) set.add(a.category);
    }
    return Array.from(set).sort();
  }

  async unpublish(id: string, updatedBy: string | null): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "draft",
        updated_by: updatedBy,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async archive(id: string, updatedBy: string | null): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "archived",
        is_pinned: false,
        updated_by: updatedBy,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async duplicateFromSource(
    source: KnowledgeArticle,
    updatedBy: string | null
  ): Promise<string> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .insert({
        hotel_id: this.ctx.hotelId,
        title: `${source.title} (копия)`,
        slug: null,
        content: source.content,
        category: source.category,
        language: source.language,
        priority: source.priority,
        status: "draft",
        version: 1,
        is_pinned: false,
        tags: source.tags,
        search_keywords: source.search_keywords,
        created_by: updatedBy,
        updated_by: updatedBy,
      })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }
}
