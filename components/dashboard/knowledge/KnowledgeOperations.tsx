"use client";

import { useMemo } from "react";
import { BookOpen } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent } from "@/lib/dashboard/format";

import type {
  KnowledgeArticleModel,
  KnowledgeOperationsSnapshot,
} from "./knowledge-ops-metrics";
import { formatKnowledgeDate } from "./knowledge-ops-metrics";
import { KnowledgeOpsListItem } from "./knowledge-ui";

type Props = {
  snapshot: KnowledgeOperationsSnapshot;
  loading?: boolean;
  onSelect?: (model: KnowledgeArticleModel) => void;
};

function ArticleOpsList({
  items,
  emptyTitle,
  emptyDescription,
  onSelect,
}: {
  items: Array<{
    model: KnowledgeArticleModel;
    secondary: string;
  }>;
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: KnowledgeArticleModel) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<BookOpen size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {items.slice(0, 5).map(({ model, secondary }) => (
        <KnowledgeOpsListItem
          key={model.article.id}
          role="listitem"
          aria-label={`Открыть статью ${model.article.title}`}
          onClick={() => onSelect?.(model)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                {model.article.title}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                {secondary}
              </p>
            </div>
          </div>
        </KnowledgeOpsListItem>
      ))}
    </div>
  );
}

export function KnowledgeOperations({ snapshot, loading = false, onSelect }: Props) {
  const indexedPercent = useMemo(() => {
    const total = snapshot.indexedCount + snapshot.pendingIndexCount;
    return total > 0 ? Math.round((snapshot.indexedCount / total) * 100) : 0;
  }, [snapshot.indexedCount, snapshot.pendingIndexCount]);

  if (loading) {
    return (
      <Section title="Операции" subtitle="Активность базы знаний и индексация AI">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} title="Загрузка">
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="Операции"
      subtitle="Активность базы знаний и индексация AI"
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title="Недавно обновлённые"
          subtitle="Recently updated"
        >
          <ArticleOpsList
            items={snapshot.recentlyUpdated.map((model) => ({
              model,
              secondary: formatKnowledgeDate(model.article.updated_at),
            }))}
            emptyTitle="Нет недавних обновлений"
            emptyDescription="Обновлённые статьи появятся здесь."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Чаще всего используются AI"
          subtitle="Most used"
        >
          <ArticleOpsList
            items={snapshot.mostUsed.map((model) => ({
              model,
              secondary: `${model.usageCount} обращений`,
            }))}
            emptyTitle="Нет данных об использовании"
            emptyDescription="Статьи с AI-обращениями появятся здесь."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard interactive title="Низкое качество" subtitle="Low quality">
          <ArticleOpsList
            items={snapshot.lowQuality.map((model) => ({
              model,
              secondary: `Качество ${model.qualityScore}%`,
            }))}
            emptyTitle="Все статьи в норме"
            emptyDescription="Статьи с низким качеством появятся здесь."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard interactive title="Очередь черновиков" subtitle="Draft queue">
          <ArticleOpsList
            items={snapshot.draftQueue.map((model) => ({
              model,
              secondary: model.article.category ?? "Без категории",
            }))}
            emptyTitle="Черновиков нет"
            emptyDescription="Неопубликованные статьи появятся здесь."
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title="Распределение по категориям"
          subtitle="Category distribution"
        >
          {snapshot.categoryDistribution.length === 0 ? (
            <EmptyState
              title="Категории не заданы"
              description="Добавьте категории к статьям для аналитики."
              icon={<BookOpen size={16} />}
            />
          ) : (
            <CategoryDistribution snapshot={snapshot} />
          )}
        </DataCard>

        <DataCard interactive title="Статус индексации AI" subtitle="AI coverage">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
                <Metric value={indexedPercent} formatter={formatPercent} />
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">покрытие индекса</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--shell-surface-raised)]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-[var(--ds-duration)] ease-[var(--ds-ease)]"
                style={{ width: `${indexedPercent}%` }}
              />
            </div>
            <dl className="grid gap-2 text-[12px]">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--shell-muted)]">Проиндексировано</span>
                <span className="font-medium text-[var(--shell-text)]">
                  <Metric value={snapshot.indexedCount} />
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--shell-muted)]">Ожидает</span>
                <span className="font-medium text-[var(--shell-text)]">
                  <Metric value={snapshot.pendingIndexCount} />
                </span>
              </div>
            </dl>
          </div>
        </DataCard>
      </div>
    </Section>
  );
}

function CategoryDistribution({ snapshot }: { snapshot: KnowledgeOperationsSnapshot }) {
  const total = snapshot.categoryDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <ul className="space-y-2" role="list">
      {snapshot.categoryDistribution.slice(0, 5).map((item) => {
        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

        return (
          <li key={item.label} role="listitem">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-[var(--shell-text)]">{item.label}</span>
              <span className="text-[var(--shell-muted)]">{percent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shell-surface-raised)]">
              <div
                className="h-full rounded-full bg-[var(--shell-accent)] transition-[width] duration-[var(--ds-duration)] ease-[var(--ds-ease)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
