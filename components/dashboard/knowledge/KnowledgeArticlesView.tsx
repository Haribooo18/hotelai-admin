"use client";

import { BookOpen } from "lucide-react";

import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { useI18n } from "@/lib/i18n";

import { KnowledgeArticleCard } from "./KnowledgeArticleCard";
import type { KnowledgeArticleModel } from "./knowledge-ops-metrics";

type Props = {
  models: KnowledgeArticleModel[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect?: (model: KnowledgeArticleModel) => void;
  onOpen: (model: KnowledgeArticleModel) => void;
  onEdit: (model: KnowledgeArticleModel) => void;
  onDuplicate: (model: KnowledgeArticleModel) => void;
  onDelete: (model: KnowledgeArticleModel) => void;
};

export function KnowledgeArticlesView({
  models,
  loading = false,
  selectedId = null,
  onSelect,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
        aria-busy="true"
        aria-label={t("knowledge.loadingArticles")}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-[var(--ds-radius)]" />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <WorkspaceEmptyState
        title={t("knowledge.notFound")}
        description={t("knowledge.notFoundDesc")}
        icon={<BookOpen size={18} />}
        guidance={t("workspace.knowledge.emptyGuidance")}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
      role="list"
      aria-label={t("knowledge.articleCards")}
    >
      {models.map((model) => (
        <KnowledgeArticleCard
          key={model.article.id}
          model={model}
          selected={selectedId === model.article.id}
          onSelect={() => onSelect?.(model)}
          onOpen={() => onOpen(model)}
          onEdit={() => onEdit(model)}
          onDuplicate={() => onDuplicate(model)}
          onDelete={() => onDelete(model)}
        />
      ))}
    </div>
  );
}
