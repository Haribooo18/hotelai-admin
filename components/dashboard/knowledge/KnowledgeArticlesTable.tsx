"use client";

import { BookOpen, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Metric } from "@/components/ui/display/Metric";
import { SkeletonRows } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { TableContainer } from "@/components/ui/data/TableContainer";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  formatKnowledgeDate,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";

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

const HEADERS = [
  "Название",
  "Категория",
  "Статус",
  "AI",
  "Качество",
  "Обновлено",
  "Использование",
  "Actions",
] as const;

export function KnowledgeArticlesTable({
  models,
  loading = false,
  selectedId = null,
  onSelect,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <TableContainer>
        <SkeletonRows rows={8} />
      </TableContainer>
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

  return (
    <TableContainer scrollable className="shadow-[var(--shell-shadow-sm)]">
      <table className="w-full min-w-[960px] border-collapse">
        <caption className="sr-only">Список статей</caption>
        <thead className="sticky top-0 z-10 bg-[var(--shell-surface)]">
          <tr className="border-b border-[var(--shell-border)]/50">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] last:text-right"
              >
                {header === "Actions" ? (
                  <span className="sr-only">Действия</span>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const selected = selectedId === model.article.id;

            return (
              <tr
                key={model.article.id}
                onClick={() => onSelect?.(model)}
                aria-selected={selected}
                className={cn(
                  "cursor-pointer border-b border-[var(--shell-border)]/30 last:border-b-0",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-surface-raised)]/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)]",
                  selected &&
                    "bg-[var(--shell-nav-active-bg)]/40 shadow-[inset_2px_0_0_0_var(--shell-accent)]"
                )}
                {...tableRowA11yProps(
                  `Выбрать статью ${model.article.title}`,
                  () => onSelect?.(model)
                )}
              >
                <td className="px-4 py-3">
                  <p className="max-w-[240px] truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {model.article.title}
                  </p>
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--shell-muted)]">
                  {model.article.category ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <KnowledgeStatusBadge status={model.article.status} />
                </td>
                <td className="px-4 py-3">
                  <AiReadyBadge ready={model.aiReady} />
                </td>
                <td className="px-4 py-3 text-[13px] font-medium text-[var(--shell-text)]">
                  <Metric
                    value={model.qualityScore}
                    formatter={(value) => `${Math.round(value)}%`}
                  />
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {formatKnowledgeDate(model.article.updated_at)}
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--shell-muted)]">
                  <Metric value={model.usageCount} />
                </td>
                <td className="px-4 py-3 text-right">
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
                          onDuplicate(model);
                        }}
                        className="gap-2"
                      >
                        <Copy size={14} />
                        Дублировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(model);
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
            );
          })}
        </tbody>
      </table>
    </TableContainer>
  );
}
