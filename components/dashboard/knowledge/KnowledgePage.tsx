"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { rankKnowledgeArticles } from "@/lib/knowledge-search";
import { duplicateKnowledgeArticle } from "@/lib/services/knowledge.mutations";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useI18n } from "@/lib/i18n";

import { KnowledgeArticlesView } from "./KnowledgeArticlesView";
import { KnowledgeCreateDialog } from "./KnowledgeCreateDialog";
import { KnowledgeDeleteDialog } from "./KnowledgeDeleteDialog";
import { KnowledgeDetailDrawer } from "./KnowledgeDetailDrawer";
import { KnowledgeEmptyState } from "./KnowledgeEmptyState";
import { KnowledgeExecutiveKpis } from "./KnowledgeExecutiveKpis";
import { KnowledgeInspector } from "./KnowledgeInspector";
import { KnowledgeOperations } from "./KnowledgeOperations";
import { KnowledgeToolbar } from "./KnowledgeToolbar";
import {
  buildKnowledgeArticleModels,
  buildKnowledgeOperationsSnapshot,
  computeKnowledgeOpsKpis,
  sortKnowledgeModels,
  type KnowledgeArticleModel,
  type KnowledgeViewMode,
} from "./knowledge-ops-metrics";
import {
  matchesKnowledgeQualityFilter,
  type KnowledgeToolbarFilters,
} from "./knowledge-ui";

type Props = {
  articles: KnowledgeArticle[];
  categories: string[];
};

const DEFAULT_FILTERS: KnowledgeToolbarFilters = {
  search: "",
  category: "",
  status: "",
  aiReady: "",
  quality: "",
  sort: "updated_desc",
};

export function KnowledgePage({ articles, categories }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [actionPending, startAction] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticleModel | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<KnowledgeArticleModel | null>(
    null
  );

  const [filters, setFilters] = useState<KnowledgeToolbarFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<KnowledgeViewMode>("grid");

  const articleModels = useMemo(
    () => buildKnowledgeArticleModels(articles),
    [articles]
  );

  const modelById = useMemo(
    () => new Map(articleModels.map((model) => [model.article.id, model])),
    [articleModels]
  );

  const filteredModels = useMemo(() => {
    const ranked = rankKnowledgeArticles(articles, {
      query: filters.search,
      status: filters.status || undefined,
      category: filters.category || undefined,
    });

    const models = ranked
      .map((article) => modelById.get(article.id))
      .filter((model): model is KnowledgeArticleModel => model !== undefined)
      .filter((model) => {
        if (filters.aiReady === "ready") return model.aiReady;
        if (filters.aiReady === "pending") return !model.aiReady;
        return true;
      })
      .filter((model) =>
        matchesKnowledgeQualityFilter(model.qualityScore, filters.quality)
      );

    return sortKnowledgeModels(models, filters.sort);
  }, [articles, filters, modelById]);

  const kpis = useMemo(
    () => computeKnowledgeOpsKpis(articles, articleModels),
    [articles, articleModels]
  );

  const operations = useMemo(
    () => buildKnowledgeOperationsSnapshot(articleModels),
    [articleModels]
  );

  const selectedId = selectedModel?.article.id ?? null;

  const handleSelect = useCallback((model: KnowledgeArticleModel) => {
    setSelectedModel(model);
  }, []);

  const handleOpen = useCallback((model: KnowledgeArticleModel) => {
    setSelectedModel(model);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback(
    (model: KnowledgeArticleModel) => {
      router.push(`/knowledge/${model.article.id}`);
    },
    [router]
  );

  const handleDuplicate = useCallback(
    (model: KnowledgeArticleModel) => {
      startAction(async () => {
        try {
          const id = await duplicateKnowledgeArticle(model.article.id);
          toast.success("Копия статьи создана");
          router.push(`/knowledge/${id}`);
        } catch {
          toast.error("Не удалось дублировать статью");
        }
      });
    },
    [router, startAction]
  );

  const handleDelete = useCallback((model: KnowledgeArticleModel) => {
    setDrawerOpen(false);
    setDeleteTarget(model);
  }, []);

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.article.id;

    startAction(async () => {
      try {
        const { deleteKnowledgeArticle } = await import(
          "@/lib/services/knowledge.mutations"
        );
        await deleteKnowledgeArticle(id);
        toast.success("Статья удалена");
        setDeleteTarget(null);
        if (selectedModel?.article.id === id) {
          setSelectedModel(null);
        }
        router.refresh();
      } catch {
        toast.error("Не удалось удалить статью");
      }
    });
  }

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  function handleImport() {
    toast.info("Импорт статей скоро будет доступен");
  }

  return (
    <Stack gap="md" className="ds-page-enter">
      <PageHeader
        title={t("pages.reports.title")}
        subtitle={t("pages.reports.subtitle")}
      />

      <KnowledgeExecutiveKpis kpis={kpis} loading={refreshing} />

      <KnowledgeToolbar
        filters={filters}
        viewMode={viewMode}
        categories={categories}
        refreshing={refreshing}
        onFiltersChange={setFilters}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
        onImportClick={handleImport}
        onRefresh={handleRefresh}
      />

      {articles.length === 0 ? (
        <KnowledgeEmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <GlassSurface className="overflow-hidden p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)]">
            <KnowledgeArticlesView
              models={filteredModels}
              viewMode={viewMode}
              loading={refreshing}
              selectedId={selectedId}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </GlassSurface>

          <div className="hidden xl:block">
            <KnowledgeInspector
              model={selectedModel}
              onOpen={() => {
                if (selectedModel) handleOpen(selectedModel);
              }}
            />
          </div>
        </div>
      )}

      <KnowledgeOperations
        snapshot={operations}
        loading={refreshing}
        onSelect={handleOpen}
      />

      <KnowledgeDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selectedModel}
        allModels={articleModels}
        onEdit={() => {
          if (selectedModel) handleEdit(selectedModel);
        }}
      />

      <KnowledgeCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <KnowledgeDeleteDialog
        article={deleteTarget?.article ?? null}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        pending={actionPending}
      />
    </Stack>
  );
}
