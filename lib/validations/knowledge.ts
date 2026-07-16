import { z } from "zod";

export const knowledgeArticleStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const knowledgeArticlePrioritySchema = z.enum([
  "low",
  "normal",
  "high",
]);

const knowledgeArticleFieldsSchema = z.object({
  title: z.string().trim().min(1, "Введите заголовок"),
  slug: z.string().trim().default(""),
  content: z.string().default(""),
  category: z.string().trim().default(""),
  language: z.string().trim().min(2, "Укажите язык").default("ru"),
  priority: knowledgeArticlePrioritySchema.default("normal"),
  status: knowledgeArticleStatusSchema.default("draft"),
  is_pinned: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).default([]),
  search_keywords: z.array(z.string().trim().min(1)).default([]),
});

export const knowledgeArticleCreateSchema = knowledgeArticleFieldsSchema;

export const knowledgeArticleUpdateSchema = z.object({
  id: z.string().uuid(),
  ...knowledgeArticleFieldsSchema.shape,
});

export const knowledgeArticleAutosaveSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  category: z.string().trim().optional(),
  language: z.string().trim().optional(),
  priority: knowledgeArticlePrioritySchema.optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  search_keywords: z.array(z.string().trim().min(1)).optional(),
  is_pinned: z.boolean().optional(),
});

export type KnowledgeArticleCreateInput = z.infer<
  typeof knowledgeArticleCreateSchema
>;
export type KnowledgeArticleUpdateInput = z.infer<
  typeof knowledgeArticleUpdateSchema
>;
export type KnowledgeArticleAutosaveInput = z.infer<
  typeof knowledgeArticleAutosaveSchema
>;
