import type {
  KnowledgeArticle,
  KnowledgeSearchResult,
} from "@/types/knowledge-article";

export type KnowledgeSearchFilters = {
  query?: string;
  category?: string;
  language?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  /** When true, only published articles (for AI retrieval). */
  publishedOnly?: boolean;
  limit?: number;
};

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  normal: 2,
  low: 1,
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function fieldScore(haystack: string, tokens: string[]): number {
  const lower = haystack.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (lower.includes(token)) score += 1;
    if (lower.startsWith(token)) score += 0.5;
  }

  return score;
}

/**
 * Lexical search with weighted ranking across title, body, tags, category,
 * keywords, priority, and language. Designed for future embedding hybrid merge.
 */
export function rankKnowledgeArticles(
  articles: KnowledgeArticle[],
  filters: KnowledgeSearchFilters
): KnowledgeSearchResult[] {
  const {
    query = "",
    category,
    language,
    priority,
    status,
    tags = [],
    publishedOnly = false,
    limit,
  } = filters;

  const tokens = tokenize(query);

  const results: KnowledgeSearchResult[] = [];

  for (const article of articles) {
    if (publishedOnly && article.status !== "published") continue;
    if (category && article.category !== category) continue;
    if (language && article.language !== language) continue;
    if (priority && article.priority !== priority) continue;
    if (status && article.status !== status) continue;
    if (tags.length > 0 && !tags.some((t) => article.tags.includes(t))) continue;

    const matchedFields: string[] = [];
    let score = 0;

    if (article.is_pinned) score += 2;

    score += (PRIORITY_WEIGHT[article.priority] ?? 1) * 0.5;

    if (tokens.length > 0) {
      const titleScore = fieldScore(article.title, tokens) * 4;
      if (titleScore > 0) {
        score += titleScore;
        matchedFields.push("title");
      }

      const contentScore = fieldScore(article.content, tokens) * 1.5;
      if (contentScore > 0) {
        score += contentScore;
        matchedFields.push("content");
      }

      const categoryScore = fieldScore(article.category ?? "", tokens) * 2;
      if (categoryScore > 0) {
        score += categoryScore;
        matchedFields.push("category");
      }

      for (const tag of article.tags) {
        const tagScore = fieldScore(tag, tokens) * 2.5;
        if (tagScore > 0) {
          score += tagScore;
          if (!matchedFields.includes("tags")) matchedFields.push("tags");
        }
      }

      for (const kw of article.search_keywords) {
        const kwScore = fieldScore(kw, tokens) * 3;
        if (kwScore > 0) {
          score += kwScore;
          if (!matchedFields.includes("search_keywords")) {
            matchedFields.push("search_keywords");
          }
        }
      }

      if (language && tokens.some((t) => article.language.includes(t))) {
        score += 1;
        matchedFields.push("language");
      }

      if (score === 0) continue;
    } else {
      score = article.is_pinned ? 2 : 1;
      score += (PRIORITY_WEIGHT[article.priority] ?? 1) * 0.25;
    }

    results.push({ ...article, score, matchedFields });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return (
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });

  return limit ? results.slice(0, limit) : results;
}
