import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";

import type { KnowledgeOperationsSnapshot } from "./knowledge-ops-metrics";
import { formatKnowledgeDate } from "./knowledge-ops-metrics";

type Props = {
  snapshot: KnowledgeOperationsSnapshot;
};

export function KnowledgeOperations({ snapshot }: Props) {
  return (
    <div className="space-y-3">
      <DashboardPanelHeader
        title="Операции"
        subtitle="Активность базы знаний и индексация AI"
      />

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <ArticleWidget
          title="Недавно обновлённые"
          items={snapshot.recentlyUpdated.map((model) => ({
            id: model.article.id,
            primary: model.article.title,
            secondary: formatKnowledgeDate(model.article.updated_at),
          }))}
          empty="Нет недавних обновлений"
        />
        <ArticleWidget
          title="Чаще всего используются AI"
          items={snapshot.mostUsed.map((model) => ({
            id: model.article.id,
            primary: model.article.title,
            secondary: `${model.usageCount} обращений`,
          }))}
          empty="Нет данных об использовании"
        />
        <ArticleWidget
          title="Низкое качество"
          items={snapshot.lowQuality.map((model) => ({
            id: model.article.id,
            primary: model.article.title,
            secondary: `Качество ${model.qualityScore}%`,
          }))}
          empty="Все статьи в норме"
        />
        <ArticleWidget
          title="Очередь черновиков"
          items={snapshot.draftQueue.map((model) => ({
            id: model.article.id,
            primary: model.article.title,
            secondary: model.article.category ?? "Без категории",
          }))}
          empty="Черновиков нет"
        />
        <CategoryWidget snapshot={snapshot} />
        <IndexingWidget snapshot={snapshot} />
      </div>
    </div>
  );
}

function ArticleWidget({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ id: string; primary: string; secondary: string }>;
  empty: string;
}) {
  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--shell-muted)]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
            >
              <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
                {item.primary}
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">{item.secondary}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardGlassPanel>
  );
}

function CategoryWidget({ snapshot }: { snapshot: KnowledgeOperationsSnapshot }) {
  const total = snapshot.categoryDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">
        Распределение по категориям
      </p>
      {snapshot.categoryDistribution.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--shell-muted)]">Категории не заданы</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {snapshot.categoryDistribution.slice(0, 5).map((item) => {
            const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <li key={item.label}>
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
      )}
    </DashboardGlassPanel>
  );
}

function IndexingWidget({ snapshot }: { snapshot: KnowledgeOperationsSnapshot }) {
  const total = snapshot.indexedCount + snapshot.pendingIndexCount;
  const indexedPercent =
    total > 0 ? Math.round((snapshot.indexedCount / total) * 100) : 0;

  return (
    <DashboardGlassPanel className="p-4">
      <p className="text-[13px] font-semibold text-[var(--shell-text)]">
        Статус индексации AI
      </p>
      <div className="mt-4 space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--shell-text)]">
            {indexedPercent}%
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
              {snapshot.indexedCount}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-[var(--shell-muted)]">Ожидает</span>
            <span className="font-medium text-[var(--shell-text)]">
              {snapshot.pendingIndexCount}
            </span>
          </div>
        </dl>
      </div>
    </DashboardGlassPanel>
  );
}
