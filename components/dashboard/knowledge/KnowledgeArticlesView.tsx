"use client";

import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";

import { KnowledgeArticleCard } from "./KnowledgeArticleCard";
import { KnowledgeArticlesTable } from "./KnowledgeArticlesTable";
import type { KnowledgeArticleModel, KnowledgeViewMode } from "./knowledge-ops-metrics";

type Props = {
  models: KnowledgeArticleModel[];
  viewMode: KnowledgeViewMode;
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
  viewMode,
  loading = false,
  selectedId = null,
  onSelect,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  if (loading) {
    return viewMode === "grid" ? (
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
        aria-busy="true"
        aria-label="Загрузка статей"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-[var(--ds-radius)]" />
        ))}
      </div>
    ) : (
      <Skeleton className="h-64 rounded-[var(--ds-radius)]" aria-busy="true" />
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="Статьи не найдены"
        description="Измените фильтры или создайте первую статью для AI-ресепшена."
        icon={<BookOpen size={18} />}
      />
    );
  }

  if (viewMode === "list") {
    return (
      <KnowledgeArticlesTable
        models={models}
        selectedId={selectedId}
        onSelect={onSelect}
        onOpen={onOpen}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
      role="list"
      aria-label="Карточки статей"
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
