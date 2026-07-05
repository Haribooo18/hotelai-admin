"use client";

import { memo, type ReactNode } from "react";
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
} from "@/components/ui/overlay/DropdownMenu";
import { Metric } from "@/components/ui/display/Metric";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  formatKnowledgeDate,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";
import { KnowledgeWorkspaceCard } from "./knowledge-ui";

type Props = {
  model: KnowledgeArticleModel;
  selected?: boolean;
  onSelect?: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export const KnowledgeArticleCard = memo(function KnowledgeArticleCard({
  model,
  selected = false,
  onSelect,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const { article, description, qualityScore, usageCount, aiReady, authorLabel } =
    model;

  function handleCardClick() {
    onSelect?.();
  }

  return (
    <KnowledgeWorkspaceCard
      selected={selected}
      role="listitem"
      aria-label={`Статья ${article.title}`}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--shell-text)]">
            {article.title}
          </p>
          {article.category && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--shell-accent)]">
              {article.category}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Действия для статьи ${article.title}`}
            className={cn(
              iconActionClass,
              "shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              motionPresets.transitionBase
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
            >
              <Eye size={14} className="mr-2" />
              Открыть
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              <Pencil size={14} className="mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy size={14} className="mr-2" />
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 size={14} className="mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-[var(--shell-muted)]">
        {description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <AiReadyBadge ready={aiReady} />
        <KnowledgeStatusBadge status={article.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <MetricCell label="Качество">
          <Metric value={qualityScore} formatter={(value) => `${Math.round(value)}%`} />
        </MetricCell>
        <MetricCell label="Использование">
          <Metric value={usageCount} />
        </MetricCell>
        <MetricCell label="Обновлено" value={formatKnowledgeDate(article.updated_at)} />
        <MetricCell label="Автор" value={authorLabel} />
      </div>
    </KnowledgeWorkspaceCard>
  );
});

function MetricCell({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--shell-muted)]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--shell-text)]">
        {children ?? value}
      </p>
    </div>
  );
}
