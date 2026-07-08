"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Copy,
  Pencil,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/core/Button";
import {
  WorkspaceInspectorDrawer,
  WorkspaceOverlayActions,
} from "@/components/dashboard/shared/WorkspaceOverlay";
import { DrawerTitle } from "@/components/ui/overlay/Drawer";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { motionPresets } from "@/lib/design/motion";
import {
  cardPaddingClass,
  drawerBadgeRowClass,
  drawerSubtitleClass,
  overlayDangerButtonClass,
} from "@/lib/dashboard/design-system";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  duplicateKnowledgeArticle,
  publishKnowledgeArticle,
  unpublishKnowledgeArticle,
} from "@/lib/services/knowledge.mutations";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeDeleteDialog } from "./KnowledgeDeleteDialog";
import { KnowledgePreview } from "./KnowledgePreview";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  buildRevisionHistory,
  formatKnowledgeDate,
  getRelatedArticles,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";
import { KnowledgeDetailRow } from "./knowledge-ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: KnowledgeArticleModel | null;
  allModels: KnowledgeArticleModel[];
  onEdit: () => void;
};

export function KnowledgeDetailDrawer({
  open,
  onOpenChange,
  model,
  allModels,
  onEdit,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!model) return null;

  const { article } = model;
  const related = getRelatedArticles(article, allModels);
  const revisions = buildRevisionHistory(article);

  function notify(message: string) {
    startTransition(() => {
      toast.success(message);
      router.refresh();
    });
  }

  function handlePublishToggle() {
    startTransition(async () => {
      try {
        if (article.status === "published") {
          await unpublishKnowledgeArticle(article.id);
          notify(t("knowledge.unpublishSuccess"));
        } else {
          await publishKnowledgeArticle(article.id);
          notify(t("knowledge.publishSuccess"));
        }
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.statusChangeFailed")
        );
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(article.id);
        toast.success(t("knowledge.duplicateSuccess"));
        router.push(`/knowledge/${id}`);
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.duplicateFailed")
        );
      }
    });
  }

  function handleRegenerateEmbedding() {
    startTransition(() => {
      toast.success(t("errors.reindexSent"));
      router.refresh();
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      try {
        const { deleteKnowledgeArticle } = await import(
          "@/lib/services/knowledge.mutations"
        );
        await deleteKnowledgeArticle(article.id);
        toast.success(t("knowledge.deleteSuccess"));
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.deleteFailed")
        );
      } finally {
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <WorkspaceInspectorDrawer
        open={open}
        onOpenChange={onOpenChange}
        header={
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
              <Sparkles size={20} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <DrawerTitle>{article.title}</DrawerTitle>
              <p className={drawerSubtitleClass}>
                {article.category ?? t("common.noCategory")}
              </p>
              <div className={drawerBadgeRowClass}>
                <KnowledgeStatusBadge status={article.status} />
                <AiReadyBadge ready={model.aiReady} />
              </div>
            </div>
          </div>
        }
        footer={
          <WorkspaceOverlayActions>
            <Button
              type="button"
              size="sm"
              onClick={onEdit}
              disabled={pending}
              className="gap-2"
            >
              <Pencil size={15} aria-hidden />
              {t("common.edit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePublishToggle}
              disabled={pending}
              className="gap-2"
            >
              <Bot size={15} aria-hidden />
              {article.status === "published"
                ? t("knowledge.unpublish")
                : t("knowledge.publish")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={pending}
              className="gap-2"
            >
              <Copy size={15} aria-hidden />
              {t("common.duplicate")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRegenerateEmbedding}
              disabled={pending}
              className="gap-2"
            >
              <RefreshCw size={15} aria-hidden />
              {t("knowledge.reindex")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              disabled={pending}
              className={overlayDangerButtonClass}
            >
              <Trash2 size={15} aria-hidden />
              {t("common.delete")}
            </Button>
          </WorkspaceOverlayActions>
        }
      >
            <Stack gap="sm">
              <Panel variant="glass" className={cardPaddingClass}>
                <Section
                  title={t("knowledge.metadata")}
                  subtitle={t("knowledge.metadataSubtitle")}
                />
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow label={t("knowledge.title")} value={article.title} />
                  <KnowledgeDetailRow
                    label={t("knowledge.category")}
                    value={article.category ?? "—"}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.status")}
                    value={t(`statuses.knowledge.${article.status}`)}
                  />
                  <KnowledgeDetailRow label={t("knowledge.author")} value={model.authorLabel} />
                  <KnowledgeDetailRow
                    label={t("knowledge.created")}
                    value={formatKnowledgeDate(article.created_at)}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.updated")}
                    value={formatKnowledgeDate(article.updated_at)}
                  />
                </dl>
              </Panel>

              <Panel variant="glass" className={cardPaddingClass}>
                <Section
                  title={t("knowledge.preview")}
                  subtitle={t("knowledge.previewSubtitle")}
                />
                <div className="mt-3 max-h-48 overflow-y-auto rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)]/60">
                  <KnowledgePreview content={article.content} />
                </div>
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow
                    label={t("knowledge.tokensEstimate")}
                    value={String(model.estimatedTokens)}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.aiQuality")}
                    value={`${model.qualityScore}%`}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.readingTime")}
                    value={`${model.readingMinutes} ${t("common.minutes")}`}
                  />
                </dl>
              </Panel>

              <Panel variant="glass" className={cardPaddingClass}>
                <Section
                  title={t("knowledge.aiIndexing")}
                  subtitle={t("knowledge.aiIndexingSubtitle")}
                />
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow
                    label={t("knowledge.indexed")}
                    value={model.aiReady ? t("common.yes") : t("common.no")}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.embeddingStatus")}
                    value={
                      model.aiReady
                        ? t("knowledge.embeddingActive")
                        : t("knowledge.embeddingAwaiting")
                    }
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.lastSync")}
                    value={formatKnowledgeDate(article.updated_at)}
                  />
                  <KnowledgeDetailRow
                    label={t("knowledge.usageFrequency")}
                    value={String(model.usageCount)}
                  />
                </dl>
              </Panel>

              {related.length > 0 ? (
                <Panel variant="glass" className={cardPaddingClass}>
                  <Section
                    title={t("knowledge.relatedArticles")}
                    subtitle={t("knowledge.relatedSubtitle")}
                  />
                  <ul className="mt-3 space-y-2" role="list">
                    {related.map((item) => (
                      <li
                        key={item.article.id}
                        role="listitem"
                        className={cn(
                          "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px] text-[var(--shell-text)]",
                          motionPresets.transitionBase
                        )}
                      >
                        {item.article.title}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              <Panel variant="glass" className={cardPaddingClass}>
                <Section
                  title={t("knowledge.history")}
                  subtitle={t("knowledge.historySubtitle")}
                />
                <ul className="mt-3 space-y-2" role="list">
                  {revisions.map((item) => (
                    <li
                      key={item.id}
                      role="listitem"
                      className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
                    >
                      <span className="text-[12px] text-[var(--shell-text)]">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[var(--shell-muted)]">
                        {formatKnowledgeDate(item.at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel variant="glass" className={cardPaddingClass}>
                <Section
                  title={t("knowledge.usageSection")}
                  subtitle={t("knowledge.usageSectionSubtitle")}
                />
                <p className="mt-3 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                  <Metric value={model.usageCount} />
                </p>
                <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
                  {t("knowledge.usageRetrieval")}
                </p>
              </Panel>
            </Stack>
      </WorkspaceInspectorDrawer>

      <KnowledgeDeleteDialog
        article={article}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
