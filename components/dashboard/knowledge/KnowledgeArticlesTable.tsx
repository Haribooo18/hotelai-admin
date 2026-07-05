"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconActionClass, tableRowClickableAltClass } from "@/lib/dashboard/design-system";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import { cn } from "@/lib/utils";
import { duplicateKnowledgeArticle } from "@/lib/services/knowledge.mutations";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeDeleteDialog } from "./KnowledgeDeleteDialog";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  formatKnowledgeDate,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";

type Props = {
  models: KnowledgeArticleModel[];
  onOpen: (model: KnowledgeArticleModel) => void;
  onEdit: (model: KnowledgeArticleModel) => void;
};

export function KnowledgeArticlesTable({ models, onOpen, onEdit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticleModel | null>(
    null
  );

  function handleDuplicate(model: KnowledgeArticleModel) {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(model.article.id);
        toast.success("Копия статьи создана");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Не удалось дублировать статью");
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.article.id;

    startTransition(async () => {
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

  return (
    <>
      <div className="overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/85 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[960px] text-left text-[12px]">
            <caption className="sr-only">Список статей</caption>
            <thead className="border-b border-[var(--shell-border)]/50 bg-[var(--shell-surface-raised)]/60 text-[11px] uppercase tracking-[0.06em] text-[var(--shell-muted)]">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Название</th>
                <th scope="col" className="px-4 py-3 font-medium">Категория</th>
                <th scope="col" className="px-4 py-3 font-medium">Статус</th>
                <th scope="col" className="px-4 py-3 font-medium">AI</th>
                <th scope="col" className="px-4 py-3 font-medium">Качество</th>
                <th scope="col" className="px-4 py-3 font-medium">Обновлено</th>
                <th scope="col" className="px-4 py-3 font-medium">Использование</th>
                <th scope="col" className="px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.article.id}
                  onClick={() => onOpen(model)}
                  className={tableRowClickableAltClass}
                  {...tableRowA11yProps(
                    `Открыть статью ${model.article.title}`,
                    () => onOpen(model)
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="max-w-[240px] truncate font-semibold text-[var(--shell-text)]">
                      {model.article.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--shell-muted)]">
                    {model.article.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <KnowledgeStatusBadge status={model.article.status} />
                  </td>
                  <td className="px-4 py-3">
                    <AiReadyBadge ready={model.aiReady} />
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--shell-text)]">
                    {model.qualityScore}%
                  </td>
                  <td className="px-4 py-3 text-[var(--shell-muted)]">
                    {formatKnowledgeDate(model.article.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-[var(--shell-muted)]">
                    {model.usageCount}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Действия: ${model.article.title}`}
                        className={cn(iconActionClass, "h-8 w-8")}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpen(model);
                          }}
                        >
                          Открыть
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit(model);
                          }}
                          className="gap-2"
                        >
                          <Pencil size={14} />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDuplicate(model);
                          }}
                          className="gap-2"
                        >
                          <Copy size={14} />
                          Дублировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeleteTarget(model);
                          }}
                          className="gap-2 text-red-400 focus:text-red-400"
                        >
                          <Trash2 size={14} />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <KnowledgeDeleteDialog
        article={deleteTarget?.article ?? null}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
