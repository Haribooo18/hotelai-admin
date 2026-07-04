import { z } from "zod";

export const knowledgeArticleCreateSchema = z.object({
  title: z.string().trim().min(1, "Введите заголовок"),
  slug: z.string().trim().default(""),
  content: z.string().trim().default(""),
  category: z.string().trim().default(""),
  is_pinned: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const knowledgeArticleUpdateSchema = z.object({
  id: z.string().uuid(),
  ...knowledgeArticleCreateSchema.shape,
});

export type KnowledgeArticleCreateInput = z.infer<
  typeof knowledgeArticleCreateSchema
>;
export type KnowledgeArticleUpdateInput = z.infer<
  typeof knowledgeArticleUpdateSchema
>;
