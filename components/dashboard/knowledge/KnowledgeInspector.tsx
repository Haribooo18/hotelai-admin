"use client";

import { BookOpen, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";

import { AiReadyBadge } from "./AiReadyBadge";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";
import {
  formatKnowledgeDate,
  type KnowledgeArticleModel,
} from "./knowledge-ops-metrics";
import { KnowledgeDetailRow } from "./knowledge-ui";

type Props = {
  model: KnowledgeArticleModel | null;
  onOpen?: () => void;
};

export function KnowledgeInspector({ model, onOpen }: Props) {
  if (!model) {
    return (
      <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
        <Section title="Инспектор" subtitle="Детали выбранной статьи" />
        <EmptyState
          title="Статья не выбрана"
          description="Выберите статью в списке или на карточке, чтобы просмотреть метаданные и AI-индексацию."
          icon={<BookOpen size={18} />}
        />
      </Panel>
    );
  }

  const { article, qualityScore, usageCount, aiReady, authorLabel } = model;

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <Section
        title="Инспектор"
        subtitle={article.category ?? "Без категории"}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpen}
            className="gap-1.5"
          >
            <ExternalLink size={14} />
            Открыть
          </Button>
        }
      />

      <div className="mt-4 min-w-0">
        <p className="line-clamp-2 text-[14px] font-semibold text-[var(--shell-text)]">
          {article.title}
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] text-[var(--shell-muted)]">
          {model.description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <KnowledgeStatusBadge status={article.status} />
        <AiReadyBadge ready={aiReady} />
      </div>

      <dl className="mt-4 grid gap-2">
        <KnowledgeDetailRow label="Качество" value={`${qualityScore}%`} />
        <KnowledgeDetailRow label="Использование" value={String(usageCount)} />
        <KnowledgeDetailRow
          label="Обновлено"
          value={formatKnowledgeDate(article.updated_at)}
        />
        <KnowledgeDetailRow label="Автор" value={authorLabel} />
      </dl>

      <div className="mt-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
          AI readiness
        </p>
        <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
          <Metric value={qualityScore} formatter={(value) => `${Math.round(value)}%`} />
        </p>
      </div>
    </Panel>
  );
}
