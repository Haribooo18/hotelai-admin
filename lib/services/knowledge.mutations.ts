"use server";

import { revalidatePath } from "next/cache";

import { slugifyTitle } from "@/lib/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";
import {
  knowledgeArticleCreateSchema,
  knowledgeArticleUpdateSchema,
  knowledgeArticleAutosaveSchema,
  type KnowledgeArticleCreateInput,
  type KnowledgeArticleUpdateInput,
  type KnowledgeArticleAutosaveInput,
} from "@/lib/validations/knowledge";

function revalidateKnowledge() {
  revalidatePath("/knowledge");
  revalidatePath("/app/ai");
}

function toRow(
  data: Omit<KnowledgeArticleUpdateInput, "id">,
  userId: string | null
) {
  return {
    title: data.title,
    slug: data.slug || slugifyTitle(data.title) || null,
    content: data.content,
    category: data.category || null,
    language: data.language,
    priority: data.priority,
    status: data.status,
    is_pinned: data.is_pinned,
    tags: data.tags,
    search_keywords: data.search_keywords,
    created_by: userId,
    updated_by: userId,
  };
}

export async function createKnowledgeArticle(input: KnowledgeArticleCreateInput) {
  const parsed = knowledgeArticleCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const ctx = await getRepositoryContext();
  const repo = createKnowledgeRepository(ctx);
  const row = toRow(parsed.data, ctx.userId);

  const id = await repo.create({
    title: row.title,
    slug: row.slug,
    content: row.content,
    category: row.category,
    language: row.language,
    priority: row.priority,
    status: row.status,
    is_pinned: row.is_pinned,
    tags: row.tags,
    search_keywords: row.search_keywords,
    created_by: row.created_by,
    updated_by: row.updated_by,
  });

  revalidateKnowledge();
  return id;
}

export async function updateKnowledgeArticle(input: KnowledgeArticleUpdateInput) {
  const parsed = knowledgeArticleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...rest } = parsed.data;
  const ctx = await getRepositoryContext();
  const repo = createKnowledgeRepository(ctx);
  const row = toRow(rest, ctx.userId);

  await repo.update(id, {
    title: row.title,
    slug: row.slug,
    content: row.content,
    category: row.category,
    language: row.language,
    priority: row.priority,
    status: row.status,
    is_pinned: row.is_pinned,
    tags: row.tags,
    search_keywords: row.search_keywords,
    updated_by: row.updated_by,
  });

  revalidateKnowledge();
}

export async function autosaveKnowledgeArticle(
  input: KnowledgeArticleAutosaveInput
) {
  const parsed = knowledgeArticleAutosaveSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...fields } = parsed.data;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (fields.title !== undefined) patch.title = fields.title;
  if (fields.content !== undefined) patch.content = fields.content;
  if (fields.category !== undefined) patch.category = fields.category || null;
  if (fields.language !== undefined) patch.language = fields.language;
  if (fields.priority !== undefined) patch.priority = fields.priority;
  if (fields.tags !== undefined) patch.tags = fields.tags;
  if (fields.search_keywords !== undefined) {
    patch.search_keywords = fields.search_keywords;
  }
  if (fields.is_pinned !== undefined) patch.is_pinned = fields.is_pinned;

  const ctx = await getRepositoryContext();
  patch.updated_by = ctx.userId;

  await createKnowledgeRepository(ctx).autosave(id, patch);
}

export async function deleteKnowledgeArticle(id: string) {
  const ctx = await getRepositoryContext();
  await createKnowledgeRepository(ctx).delete(id);
  revalidateKnowledge();
}

export async function pinKnowledgeArticle(id: string, pinned: boolean) {
  const ctx = await getRepositoryContext();
  await createKnowledgeRepository(ctx).setPinned(id, pinned);
  revalidateKnowledge();
}

export async function publishKnowledgeArticle(id: string) {
  const ctx = await getRepositoryContext();
  const repo = createKnowledgeRepository(ctx);
  const version = await repo.getVersion(id);

  await repo.publish(id, version + 1, ctx.userId);
  revalidateKnowledge();
}

export async function unpublishKnowledgeArticle(id: string) {
  const ctx = await getRepositoryContext();
  await createKnowledgeRepository(ctx).unpublish(id, ctx.userId);
  revalidateKnowledge();
}

export async function archiveKnowledgeArticle(id: string) {
  const ctx = await getRepositoryContext();
  await createKnowledgeRepository(ctx).archive(id, ctx.userId);
  revalidateKnowledge();
}

export async function duplicateKnowledgeArticle(id: string) {
  const ctx = await getRepositoryContext();
  const repo = createKnowledgeRepository(ctx);
  const source = await repo.getById(id);

  if (!source) {
    throw new Error("Статья не найдена");
  }

  const newId = await repo.duplicateFromSource(source, ctx.userId);
  revalidateKnowledge();
  return newId;
}
