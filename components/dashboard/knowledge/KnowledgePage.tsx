"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { rankKnowledgeArticles } from "@/lib/knowledge-search";
import { duplicateKnowledgeArticle } from "@/lib/services/knowledge.mutations";
import { AdminPageStack, DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { KnowledgeArticlesView } from "./KnowledgeArticlesView";
import { KnowledgeCreateDialog } from "./KnowledgeCreateDialog";
import { KnowledgeDeleteDialog } from "./KnowledgeDeleteDialog";
import { KnowledgeDetailDrawer } from "./KnowledgeDetailDrawer";
import { KnowledgeEmptyState } from "./KnowledgeEmptyState";
import { KnowledgeExecutiveKpis } from "./KnowledgeExecutiveKpis";
import { KnowledgeOperations } from "./KnowledgeOperations";
import { KnowledgeToolbar } from "./KnowledgeToolbar";
import {
  buildKnowledgeArticleModels,
  buildKnowledgeOperationsSnapshot,
  computeKnowledgeOpsKpis,
  sortKnowledgeModels,
  type KnowledgeArticleModel,
  type KnowledgeSortKey,
  type KnowledgeViewMode,
} from "./knowledge-ops-metrics";

type Props = {
  articles: KnowledgeArticle[];
  categories: string[];
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
  const [drawerModel, setDrawerModel] = useState<KnowledgeArticleModel | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [aiReady, setAiReady] = useState("");
  const [sortKey, setSortKey] = useState<KnowledgeSortKey>("updated_desc");
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
      query: search,
      status: status || undefined,
      category: category || undefined,
    });

    const models = ranked
      .map((article) => modelById.get(article.id))
      .filter((model): model is KnowledgeArticleModel => model !== undefined)
      .filter((model) => {
        if (aiReady === "ready") return model.aiReady;
        if (aiReady === "pending") return !model.aiReady;
        return true;
      });

    return sortKnowledgeModels(models, sortKey);
  }, [articles, search, status, category, aiReady, sortKey, modelById]);

  const kpis = useMemo(
    () => computeKnowledgeOpsKpis(articles, articleModels),
    [articles, articleModels]
  );

  const operations = useMemo(
    () => buildKnowledgeOperationsSnapshot(articleModels),
    [articleModels]
  );

  function handleOpen(model: KnowledgeArticleModel) {
    setDrawerModel(model);
    setDrawerOpen(true);
  }

  function handleEdit(model: KnowledgeArticleModel) {
    router.push(`/knowledge/${model.article.id}`);
  }

  function handleDuplicate(model: KnowledgeArticleModel) {
    startAction(async () => {
      try {
        const id = await duplicateKnowledgeArticle(model.article.id);
        toast.success("Копия статьи создана");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Не удалось дублировать статью");
      }
    });
  }

  function handleDelete(model: KnowledgeArticleModel) {
    setDeleteTarget(model);
  }

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
        router.refresh();
      } catch {
        toast.error("Не удалось удалить статью");
      } finally {
        setDeleteTarget(null);
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
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.reports.title")}
        subtitle={t("pages.reports.subtitle")}
      />

      <KnowledgeExecutiveKpis kpis={kpis} loading={refreshing} />

      <KnowledgeToolbar
        search={search}
        category={category}
        status={status}
        aiReady={aiReady}
        sortKey={sortKey}
        viewMode={viewMode}
        categories={categories}
        refreshing={refreshing}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onAiReadyChange={setAiReady}
        onSortChange={setSortKey}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
        onImportClick={handleImport}
        onRefresh={handleRefresh}
      />

      {articles.length === 0 ? (
        <KnowledgeEmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <KnowledgeArticlesView
          models={filteredModels}
          viewMode={viewMode}
          loading={refreshing}
          onOpen={handleOpen}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

      <KnowledgeOperations snapshot={operations} />

      <KnowledgeDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={drawerModel}
        allModels={articleModels}
        onEdit={() => {
          if (drawerModel) handleEdit(drawerModel);
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
    </AdminPageStack>
  );
}
