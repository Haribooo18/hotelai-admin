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
import { AdminPageStack, DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

type Props = {
  articles: KnowledgeArticle[];
  categories: string[];
};

export function KnowledgePage({ articles, categories }: Props) {
  const { t } = useI18n();
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
    <AdminPageStack>
      <DashboardPageHeader
        title={t("pages.reports.title")}
        subtitle={`${t("pages.reports.subtitle")} · ${publishedCount} published · ${draftCount} drafts`}
        actions={<KnowledgeCreateButton onClick={() => setCreateOpen(true)} />}
      />

      <div className="flex flex-wrap items-center gap-3">
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
    </AdminPageStack>
  );
}
