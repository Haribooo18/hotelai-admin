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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: KnowledgeArticleModel | null;
  allModels: KnowledgeArticleModel[];
  onEdit: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[12px] text-[var(--shell-muted)]">{label}</span>
      <span className="text-right text-[12px] font-medium text-[var(--shell-text)]">
        {value}
      </span>
    </div>
  );
}

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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                <Sparkles size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-left text-[18px] font-semibold tracking-[-0.02em]">
                  {article.title}
                </SheetTitle>
                <p className="mt-1 text-left text-[13px] text-[var(--shell-muted)]">
                  {article.category ?? "Без категории"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <KnowledgeStatusBadge status={article.status} />
                  <AiReadyBadge ready={model.aiReady} />
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-3 overflow-y-auto px-6 py-5">
            <DashboardGlassPanel className="p-4">
              <DashboardPanelHeader title="Статья" subtitle="Метаданные" className="mb-3" />
              <dl className="grid gap-2">
                <Row label="Название" value={article.title} />
                <Row label="Категория" value={article.category ?? "—"} />
                <Row label="Статус" value={article.status} />
                <Row label="Автор" value={model.authorLabel} />
                <Row label="Создано" value={formatKnowledgeDate(article.created_at)} />
                <Row label="Обновлено" value={formatKnowledgeDate(article.updated_at)} />
              </dl>
            </DashboardGlassPanel>

            <DashboardGlassPanel className="p-4">
              <DashboardPanelHeader title="Контент" subtitle="Предпросмотр и метрики" className="mb-3" />
              <div className="mb-3 max-h-48 overflow-y-auto rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)]/60">
                <KnowledgePreview content={article.content} />
              </div>
              <dl className="grid gap-2">
                <Row label="Токены (оценка)" value={String(model.estimatedTokens)} />
                <Row label="Качество AI" value={`${model.qualityScore}%`} />
                <Row label="Время чтения" value={`${model.readingMinutes} мин`} />
              </dl>
            </DashboardGlassPanel>

            <DashboardGlassPanel className="p-4">
              <DashboardPanelHeader title="AI" subtitle="Индексация и использование" className="mb-3" />
              <dl className="grid gap-2">
                <Row
                  label="Проиндексировано"
                  value={model.aiReady ? "Да" : "Нет"}
                />
                <Row
                  label="Статус эмбеддинга"
                  value={model.aiReady ? "Активен" : "Ожидает"}
                />
                <Row
                  label="Последняя синхронизация"
                  value={formatKnowledgeDate(article.updated_at)}
                />
                <Row label="Частота использования" value={String(model.usageCount)} />
              </dl>
              {related.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--shell-muted)]">
                    Похожие статьи
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {related.map((item) => (
                      <li
                        key={item.article.id}
                        className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px] text-[var(--shell-text)]"
                      >
                        {item.article.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </DashboardGlassPanel>

            <DashboardGlassPanel className="p-4">
              <DashboardPanelHeader title="История" subtitle="Версии и активность" className="mb-3" />
              <ul className="space-y-2">
                {revisions.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
                  >
                    <span className="text-[12px] text-[var(--shell-text)]">{item.label}</span>
                    <span className="text-[11px] text-[var(--shell-muted)]">
                      {formatKnowledgeDate(item.at)}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardGlassPanel>
          </div>

          <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
                onClick={onEdit}
                disabled={pending}
              >
                <Pencil size={15} />
                Редактировать
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
                onClick={handlePublishToggle}
                disabled={pending}
              >
                <Bot size={15} />
                {article.status === "published" ? "Снять с публикации" : "Опубликовать"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
                onClick={handleDuplicate}
                disabled={pending}
              >
                <Copy size={15} />
                Дублировать
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
                onClick={handleRegenerateEmbedding}
                disabled={pending}
              >
                <RefreshCw size={15} />
                Переиндексировать
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-red-400 shadow-[var(--shell-shadow-sm)] hover:text-red-300"
                onClick={() => setDeleteOpen(true)}
                disabled={pending}
              >
                <Trash2 size={15} />
                Удалить
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
