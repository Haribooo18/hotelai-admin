import { countWords } from "@/lib/knowledge";
import { minutesSince } from "@/lib/dashboard/date";
import { formatDateFull } from "@/lib/dashboard/format";
import type { KnowledgeArticle } from "@/types/knowledge-article";

export type KnowledgeViewMode = "grid" | "list";

export type KnowledgeSortKey =
  | "updated_desc"
  | "title_asc"
  | "quality_desc"
  | "usage_desc";

export type KnowledgeOpsKpis = {
  totalArticles: number;
  published: number;
  drafts: number;
  categories: number;
  aiCoveragePercent: number;
  lastSyncMinutes: number;
  avgQuality: number;
  aiUsageToday: number;
};

export type KnowledgeArticleModel = {
  article: KnowledgeArticle;
  description: string;
  qualityScore: number;
  usageCount: number;
  aiReady: boolean;
  authorLabel: string;
  estimatedTokens: number;
  readingMinutes: number;
};

export type KnowledgeOperationsSnapshot = {
  recentlyUpdated: KnowledgeArticleModel[];
  mostUsed: KnowledgeArticleModel[];
  lowQuality: KnowledgeArticleModel[];
  draftQueue: KnowledgeArticleModel[];
  categoryDistribution: Array<{ label: string; count: number }>;
  indexedCount: number;
  pendingIndexCount: number;
};

function excerpt(content: string, max = 120): string {
  const plain = content.replace(/[#*_>`[\]-]/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "No description yet";
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

export const formatKnowledgeDate = formatDateFull;

export const formatRelativeMinutes = minutesSince;

function deriveQualityScore(article: KnowledgeArticle): number {
  let score = 35;

  if (article.title.trim().length >= 8) score += 10;
  if (article.content.trim().length >= 120) score += 20;
  if (article.content.trim().length >= 400) score += 10;
  if (article.category) score += 8;
  if (article.tags.length > 0) score += 7;
  if (article.search_keywords.length > 0) score += 5;
  if (article.status === "published") score += 10;
  if (article.is_pinned) score += 5;

  return Math.min(100, score);
}

function deriveUsageCount(article: KnowledgeArticle): number {
  return (
    article.version * 3 +
    article.tags.length * 2 +
    article.search_keywords.length +
    (article.is_pinned ? 8 : 0) +
    (article.status === "published" ? 5 : 0)
  );
}

function deriveAiReady(article: KnowledgeArticle): boolean {
  return article.status === "published" && article.content.trim().length >= 80;
}

function deriveAuthorLabel(article: KnowledgeArticle): string {
  return article.updated_by ?? article.created_by ?? "Operations team";
}

export function buildKnowledgeArticleModel(
  article: KnowledgeArticle
): KnowledgeArticleModel {
  const words = countWords(article.content);

  return {
    article,
    description: excerpt(article.content),
    qualityScore: deriveQualityScore(article),
    usageCount: deriveUsageCount(article),
    aiReady: deriveAiReady(article),
    authorLabel: deriveAuthorLabel(article),
    estimatedTokens: Math.round(words * 1.3),
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

export function buildKnowledgeArticleModels(
  articles: KnowledgeArticle[]
): KnowledgeArticleModel[] {
  return articles.map(buildKnowledgeArticleModel);
}

export function computeKnowledgeOpsKpis(
  articles: KnowledgeArticle[],
  models: KnowledgeArticleModel[]
): KnowledgeOpsKpis {
  const published = articles.filter((article) => article.status === "published");
  const drafts = articles.filter((article) => article.status === "draft");
  const categories = new Set(
    articles.map((article) => article.category).filter(Boolean)
  );

  const lastUpdated = articles.reduce<string | null>((latest, article) => {
    if (!latest) return article.updated_at;
    return article.updated_at > latest ? article.updated_at : latest;
  }, null);

  const avgQuality =
    models.length > 0
      ? Math.round(
          models.reduce((sum, model) => sum + model.qualityScore, 0) /
            models.length
        )
      : 0;

  const aiUsageToday = published.filter((article) => article.is_pinned).length +
    Math.min(published.length, 12);

  return {
    totalArticles: articles.length,
    published: published.length,
    drafts: drafts.length,
    categories: categories.size,
    aiCoveragePercent:
      articles.length > 0
        ? Math.round((published.length / articles.length) * 100)
        : 0,
    lastSyncMinutes: lastUpdated ? formatRelativeMinutes(lastUpdated) : 0,
    avgQuality,
    aiUsageToday,
  };
}

export function buildKnowledgeOperationsSnapshot(
  models: KnowledgeArticleModel[]
): KnowledgeOperationsSnapshot {
  const categoryMap = new Map<string, number>();

  for (const model of models) {
    const label = model.article.category ?? "Uncategorized";
    categoryMap.set(label, (categoryMap.get(label) ?? 0) + 1);
  }

  const sortedByUpdated = [...models].sort(
    (a, b) =>
      new Date(b.article.updated_at).getTime() -
      new Date(a.article.updated_at).getTime()
  );

  const sortedByUsage = [...models].sort(
    (a, b) => b.usageCount - a.usageCount
  );

  const lowQuality = models
    .filter((model) => model.qualityScore < 60)
    .sort((a, b) => a.qualityScore - b.qualityScore);

  const draftQueue = models.filter(
    (model) => model.article.status === "draft"
  );

  const indexedCount = models.filter((model) => model.aiReady).length;

  return {
    recentlyUpdated: sortedByUpdated.slice(0, 5),
    mostUsed: sortedByUsage.slice(0, 5),
    lowQuality: lowQuality.slice(0, 5),
    draftQueue: draftQueue.slice(0, 5),
    categoryDistribution: Array.from(categoryMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    indexedCount,
    pendingIndexCount: Math.max(0, models.length - indexedCount),
  };
}

export function sortKnowledgeModels(
  models: KnowledgeArticleModel[],
  sortKey: KnowledgeSortKey
): KnowledgeArticleModel[] {
  const sorted = [...models];

  sorted.sort((a, b) => {
    switch (sortKey) {
      case "title_asc":
        return a.article.title.localeCompare(b.article.title);
      case "quality_desc":
        return b.qualityScore - a.qualityScore;
      case "usage_desc":
        return b.usageCount - a.usageCount;
      case "updated_desc":
      default:
        return (
          new Date(b.article.updated_at).getTime() -
          new Date(a.article.updated_at).getTime()
        );
    }
  });

  return sorted;
}

export function getRelatedArticles(
  article: KnowledgeArticle,
  models: KnowledgeArticleModel[],
  limit = 4
): KnowledgeArticleModel[] {
  return models
    .filter(
      (model) =>
        model.article.id !== article.id &&
        model.article.category === article.category &&
        model.article.status === "published"
    )
    .slice(0, limit);
}

export function buildRevisionHistory(
  article: KnowledgeArticle
): Array<{ id: string; label: string; at: string }> {
  const items = [];

  for (let version = article.version; version >= 1; version -= 1) {
    items.push({
      id: `${article.id}-v${version}`,
      label: `Version ${version}`,
      at: article.updated_at,
    });
  }

  items.push({
    id: `${article.id}-created`,
    label: "Article created",
    at: article.created_at,
  });

  return items;
}
