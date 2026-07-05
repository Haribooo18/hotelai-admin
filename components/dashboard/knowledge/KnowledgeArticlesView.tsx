"use client";

import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DashboardEmptyState,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";

import { KnowledgeArticleCard } from "./KnowledgeArticleCard";
import { KnowledgeArticlesTable } from "./KnowledgeArticlesTable";
import type { KnowledgeArticleModel, KnowledgeViewMode } from "./knowledge-ops-metrics";

type Props = {
  models: KnowledgeArticleModel[];
  viewMode: KnowledgeViewMode;
  loading?: boolean;
  onOpen: (model: KnowledgeArticleModel) => void;
  onEdit: (model: KnowledgeArticleModel) => void;
  onDuplicate: (model: KnowledgeArticleModel) => void;
  onDelete: (model: KnowledgeArticleModel) => void;
};

export function KnowledgeArticlesView({
  models,
  viewMode,
  loading = false,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            : "space-y-2"
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <DashboardSkeletonBlock
            key={index}
            className={viewMode === "grid" ? "h-52" : "h-12"}
          />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 p-6 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
        <DashboardEmptyState
          title="Статьи не найдены"
          description="Измените фильтры или создайте первую статью для AI-ресепшена."
          icon={<BookOpen size={18} />}
        />
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <KnowledgeArticlesTable
        models={models}
        onOpen={onOpen}
        onEdit={onEdit}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {models.map((model) => (
        <KnowledgeArticleCard
          key={model.article.id}
          model={model}
          onOpen={() => onOpen(model)}
          onEdit={() => onEdit(model)}
          onDuplicate={() => onDuplicate(model)}
          onDelete={() => onDelete(model)}
        />
      ))}
    </div>
  );
}
