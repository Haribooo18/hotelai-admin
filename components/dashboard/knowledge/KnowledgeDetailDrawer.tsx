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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlay/Drawer";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { motionPresets } from "@/lib/design/motion";
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
          notify("Статья снята с публикации");
        } else {
          await publishKnowledgeArticle(article.id);
          notify("Статья опубликована");
        }
      } catch {
        toast.error("Не удалось изменить статус публикации");
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(article.id);
        toast.success("Копия статьи создана");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Не удалось дублировать статью");
      }
    });
  }

  function handleRegenerateEmbedding() {
    startTransition(() => {
      toast.success("Запрос на переиндексацию отправлен");
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
        toast.success("Статья удалена");
        onOpenChange(false);
        router.refresh();
      } catch {
        toast.error("Не удалось удалить статью");
      } finally {
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          side="right"
          className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
        >
          <DrawerHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                <Sparkles size={20} aria-hidden />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <DrawerTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                  {article.title}
                </DrawerTitle>
                <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                  {article.category ?? "Без категории"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <KnowledgeStatusBadge status={article.status} />
                  <AiReadyBadge ready={model.aiReady} />
                </div>
              </div>
            </div>
          </DrawerHeader>

          <Scrollable className="flex-1 px-6 py-5">
            <Stack gap="sm">
              <Panel variant="glass" className="p-4">
                <Section title="Метаданные" subtitle="Статья" />
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow label="Название" value={article.title} />
                  <KnowledgeDetailRow
                    label="Категория"
                    value={article.category ?? "—"}
                  />
                  <KnowledgeDetailRow label="Статус" value={article.status} />
                  <KnowledgeDetailRow label="Автор" value={model.authorLabel} />
                  <KnowledgeDetailRow
                    label="Создано"
                    value={formatKnowledgeDate(article.created_at)}
                  />
                  <KnowledgeDetailRow
                    label="Обновлено"
                    value={formatKnowledgeDate(article.updated_at)}
                  />
                </dl>
              </Panel>

              <Panel variant="glass" className="p-4">
                <Section title="Предпросмотр" subtitle="Markdown" />
                <div className="mt-3 max-h-48 overflow-y-auto rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)]/60">
                  <KnowledgePreview content={article.content} />
                </div>
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow
                    label="Токены (оценка)"
                    value={String(model.estimatedTokens)}
                  />
                  <KnowledgeDetailRow
                    label="Качество AI"
                    value={`${model.qualityScore}%`}
                  />
                  <KnowledgeDetailRow
                    label="Время чтения"
                    value={`${model.readingMinutes} мин`}
                  />
                </dl>
              </Panel>

              <Panel variant="glass" className="p-4">
                <Section title="AI-индексация" subtitle="Embeddings" />
                <dl className="mt-3 grid gap-2">
                  <KnowledgeDetailRow
                    label="Проиндексировано"
                    value={model.aiReady ? "Да" : "Нет"}
                  />
                  <KnowledgeDetailRow
                    label="Статус эмбеддинга"
                    value={model.aiReady ? "Активен" : "Ожидает"}
                  />
                  <KnowledgeDetailRow
                    label="Последняя синхронизация"
                    value={formatKnowledgeDate(article.updated_at)}
                  />
                  <KnowledgeDetailRow
                    label="Частота использования"
                    value={String(model.usageCount)}
                  />
                </dl>
              </Panel>

              {related.length > 0 ? (
                <Panel variant="glass" className="p-4">
                  <Section title="Похожие статьи" subtitle="Related articles" />
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

              <Panel variant="glass" className="p-4">
                <Section title="История" subtitle="Версии" />
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

              <Panel variant="glass" className="p-4">
                <Section title="Использование" subtitle="AI retrieval" />
                <p className="mt-3 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                  <Metric value={model.usageCount} />
                </p>
                <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
                  обращений к статье через AI-ресепшен
                </p>
              </Panel>
            </Stack>
          </Scrollable>

          <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={onEdit}
                disabled={pending}
                className="gap-2"
              >
                <Pencil size={15} aria-hidden />
                Редактировать
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
                  ? "Снять с публикации"
                  : "Опубликовать"}
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
                Дублировать
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
                Переиндексировать
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                disabled={pending}
                className="gap-2 text-red-400 hover:text-red-300"
              >
                <Trash2 size={15} aria-hidden />
                Удалить
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
