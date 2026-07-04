import type {
  KnowledgeArticlePriority,
  KnowledgeArticleStatus,
} from "@/types/knowledge-article";

export const KNOWLEDGE_STATUSES: KnowledgeArticleStatus[] = [
  "draft",
  "published",
  "archived",
];

export const KNOWLEDGE_STATUS_LABELS: Record<KnowledgeArticleStatus, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "В архиве",
};

export const KNOWLEDGE_PRIORITIES: KnowledgeArticlePriority[] = [
  "low",
  "normal",
  "high",
];

export const KNOWLEDGE_PRIORITY_LABELS: Record<
  KnowledgeArticlePriority,
  string
> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
};

export const KNOWLEDGE_LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
] as const;

export const DEFAULT_KNOWLEDGE_CATEGORIES = [
  "Общее",
  "Заезд и выезд",
  "Услуги",
  "Питание",
  "Трансфер",
  "Правила",
  "FAQ",
] as const;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
