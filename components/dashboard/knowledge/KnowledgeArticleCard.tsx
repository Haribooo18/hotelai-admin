"use client";

import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  formatKnowledgeDate,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";

type Props = {
  model: KnowledgeArticleModel;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function KnowledgeArticleCard({
  model,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const { article, description, qualityScore, usageCount, aiReady, authorLabel } =
    model;

  return (
    <article
      className={cn(
        "group rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/85 p-4 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
        "transition-[transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--shell-text)]">
            {article.title}
          </p>
          {article.category && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--shell-accent)]">
              {article.category}
            </p>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Действия: ${article.title}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] opacity-0 transition-[opacity,background-color] duration-[var(--ds-duration)] group-hover:opacity-100 hover:bg-[var(--shell-nav-hover-bg)]"
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>
              <Eye size={14} className="mr-2" />
              Открыть
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil size={14} className="mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy size={14} className="mr-2" />
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 size={14} className="mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button type="button" onClick={onOpen} className="mt-3 block w-full text-left">
        <p className="line-clamp-2 text-[12px] leading-relaxed text-[var(--shell-muted)]">
          {description}
        </p>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <AiReadyBadge ready={aiReady} />
        <KnowledgeStatusBadge status={article.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <Metric label="Качество" value={`${qualityScore}%`} />
        <Metric label="Использование" value={String(usageCount)} />
        <Metric
          label="Обновлено"
          value={formatKnowledgeDate(article.updated_at)}
        />
        <Metric label="Автор" value={authorLabel} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--shell-muted)]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--shell-text)]">
        {value}
      </p>
    </div>
  );
}
