import type {
  KnowledgeArticle,
  KnowledgeArticlePriority,
  KnowledgeArticleStatus,
} from "@/types/knowledge-article";
import type { DbKnowledgeArticleRow } from "@/types/database/generated";
import {
  resolveKnowledgeMetrics,
  toKnowledgeArticle,
} from "@/lib/database/mappers";

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

type KnowledgeMetricsInput = {
  status: string;
  priority: string;
  tags: string[];
  search_keywords: string[];
  content: string;
  is_pinned: boolean;
};

export class KnowledgeRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  private async getRawById(id: string): Promise<DbKnowledgeArticleRow | null> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as DbKnowledgeArticleRow | null) ?? null;
  }

  private metricsForWrite(
    row: KnowledgeMetricsInput,
    existing: DbKnowledgeArticleRow | null,
    options?: { forceAiIndexed?: boolean }
  ) {
    return resolveKnowledgeMetrics(row, existing, options);
  }

  async getAll(): Promise<KnowledgeArticle[]> {
    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbKnowledgeArticleRow[]).map(toKnowledgeArticle);
  }

  async getById(id: string): Promise<KnowledgeArticle | null> {
    const data = await this.getRawById(id);

    return data ? toKnowledgeArticle(data) : null;
  }

  async create(row: KnowledgeInsertRow): Promise<string> {
    const metrics = this.metricsForWrite(row, null);

    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .insert({
        hotel_id: this.ctx.hotelId,
        ...row,
        ...metrics,
      })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }

  async update(id: string, row: KnowledgeUpdateRow): Promise<void> {
    const existing = await this.getRawById(id);
    const metrics = this.metricsForWrite(row, existing);

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        ...row,
        ...metrics,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async autosave(id: string, patch: KnowledgeAutosavePatch): Promise<void> {
    const existing = await this.getRawById(id);
    if (!existing) {
      throw new Error("Статья не найдена");
    }

    const article = toKnowledgeArticle(existing);
    const merged = {
      status: (patch.status as string | undefined) ?? article.status,
      priority: (patch.priority as string | undefined) ?? article.priority,
      tags: (patch.tags as string[] | undefined) ?? article.tags,
      search_keywords:
        (patch.search_keywords as string[] | undefined) ??
        article.search_keywords,
      content: (patch.content as string | undefined) ?? article.content,
      is_pinned:
        (patch.is_pinned as boolean | undefined) ?? article.is_pinned,
    };

    const metrics = this.metricsForWrite(merged, existing);

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        ...patch,
        ...metrics,
      })
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
    const existing = await this.getRawById(id);
    if (!existing) return;

    const metrics = this.metricsForWrite(
      {
        status: existing.status,
        priority: existing.priority,
        tags: existing.tags ?? [],
        search_keywords: existing.search_keywords ?? [],
        content: existing.content,
        is_pinned: pinned,
      },
      existing
    );

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({ is_pinned: pinned, ...metrics })
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
    const existing = await this.getRawById(id);
    if (!existing) return;

    const metrics = this.metricsForWrite(
      {
        status: "published",
        priority: existing.priority,
        tags: existing.tags ?? [],
        search_keywords: existing.search_keywords ?? [],
        content: existing.content,
        is_pinned: existing.is_pinned,
      },
      existing,
      { forceAiIndexed: true }
    );

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "published",
        version,
        updated_by: updatedBy,
        ...metrics,
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
    const existing = await this.getRawById(id);
    if (!existing) return;

    const metrics = this.metricsForWrite(
      {
        status: "draft",
        priority: existing.priority,
        tags: existing.tags ?? [],
        search_keywords: existing.search_keywords ?? [],
        content: existing.content,
        is_pinned: existing.is_pinned,
      },
      existing,
      { forceAiIndexed: false }
    );

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "draft",
        updated_by: updatedBy,
        ...metrics,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async archive(id: string, updatedBy: string | null): Promise<void> {
    const existing = await this.getRawById(id);
    if (!existing) return;

    const metrics = this.metricsForWrite(
      {
        status: "archived",
        priority: existing.priority,
        tags: existing.tags ?? [],
        search_keywords: existing.search_keywords ?? [],
        content: existing.content,
        is_pinned: false,
      },
      existing,
      { forceAiIndexed: false }
    );

    const { error } = await this.ctx.supabase
      .from("knowledge_articles")
      .update({
        status: "archived",
        is_pinned: false,
        updated_by: updatedBy,
        ...metrics,
      })
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async duplicateFromSource(
    source: KnowledgeArticle,
    updatedBy: string | null
  ): Promise<string> {
    const draftRow = {
      title: `${source.title} (копия)`,
      slug: null,
      content: source.content,
      category: source.category,
      language: source.language,
      priority: source.priority,
      status: "draft" as const,
      is_pinned: false,
      tags: source.tags,
      search_keywords: source.search_keywords,
    };

    const metrics = this.metricsForWrite(draftRow, null);

    const { data, error } = await this.ctx.supabase
      .from("knowledge_articles")
      .insert({
        hotel_id: this.ctx.hotelId,
        ...draftRow,
        version: 1,
        ...metrics,
        created_by: updatedBy,
        updated_by: updatedBy,
      })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }
}
