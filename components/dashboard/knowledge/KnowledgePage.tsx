"use client";

import { useMemo, useState } from "react";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { rankKnowledgeArticles } from "@/lib/knowledge-search";

import {
  KnowledgeCreateButton,
  KnowledgeCreateDialog,
} from "./KnowledgeCreateDialog";
import { KnowledgeCategories } from "./KnowledgeCategories";
import { KnowledgeEmptyState } from "./KnowledgeEmptyState";
import { KnowledgeFilters } from "./KnowledgeFilters";
import { KnowledgeSearch } from "./KnowledgeSearch";
import { KnowledgeTable } from "./KnowledgeTable";

type Props = {
  articles: KnowledgeArticle[];
  categories: string[];
};

export function KnowledgePage({ articles, categories }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [priority, setPriority] = useState("");
  const [quickCategory, setQuickCategory] = useState("");

  const filtered = useMemo(() => {
    const effectiveCategory = quickCategory || category;

    return rankKnowledgeArticles(articles, {
      query: search,
      status: status && status !== "all" ? status : undefined,
      category:
        effectiveCategory && effectiveCategory !== "all"
          ? effectiveCategory
          : undefined,
      language: language && language !== "all" ? language : undefined,
      priority: priority && priority !== "all" ? priority : undefined,
    });
  }, [articles, search, status, category, language, priority, quickCategory]);

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Knowledge base</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Articles for the AI receptionist · {publishedCount} published ·{" "}
            {draftCount} drafts
          </p>
        </div>
        <KnowledgeCreateButton onClick={() => setCreateOpen(true)} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <KnowledgeSearch value={search} onChange={setSearch} />
        <KnowledgeFilters
          status={status}
          category={category}
          language={language}
          priority={priority}
          categories={categories}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onLanguageChange={setLanguage}
          onPriorityChange={setPriority}
        />
      </div>

      <KnowledgeCategories
        categories={categories}
        selected={quickCategory}
        onSelect={setQuickCategory}
      />

      {articles.length === 0 ? (
        <KnowledgeEmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <KnowledgeTable articles={filtered} />
      )}

      <KnowledgeCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
