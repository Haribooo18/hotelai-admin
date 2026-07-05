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
  draft: "Draft",
  published: "Published",
  archived: "Archived",
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
  low: "Low",
  normal: "Normal",
  high: "High",
};

export const KNOWLEDGE_LANGUAGES = [
  { code: "ru", label: "Russian" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
] as const;

export const DEFAULT_KNOWLEDGE_CATEGORIES = [
  "General",
  "Check-in & Check-out",
  "Services",
  "Dining",
  "Transfer",
  "Policies",
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
