"use client";

import { BookOpen, ExternalLink } from "lucide-react";

import { MotionInspectorShell } from "@/components/motion/MotionInspectorShell";
import { Button } from "@/components/ui/core/Button";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import {
  cardBadgeRowClass,
  cardContentGapClass,
  cardMetricCellClass,
  inspectorPanelClass,
  kpiMetricGapClass,
  workspaceCardTitleClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  if (!model) {
    return (
      <Panel variant="glass" className={cn("h-full", inspectorPanelClass)}>
        <MotionInspectorShell
          header={
            <Section
              title={t("knowledge.inspectorTitle")}
              subtitle={t("knowledge.inspectorSubtitle")}
            />
          }
          content={
            <EmptyState
              title={t("knowledge.noArticleSelected")}
              description={t("knowledge.noArticleSelectedDesc")}
              icon={<BookOpen size={18} />}
            />
          }
        />
      </Panel>
    );
  }

  const { article, qualityScore, usageCount, aiReady, authorLabel } = model;

  return (
    <Panel variant="glass" className={cn("h-full", inspectorPanelClass)}>
      <MotionInspectorShell
        header={
          <Section
            title={t("knowledge.inspectorTitle")}
            subtitle={article.category ?? t("common.noCategory")}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpen}
                className="gap-1.5"
              >
                <ExternalLink size={14} />
                {t("common.open")}
              </Button>
            }
          />
        }
        content={
          <>
            <div className={cn(cardContentGapClass, "min-w-0")}>
              <p className={cn(workspaceCardTitleClass, "line-clamp-2")}>
                {article.title}
              </p>
              <p className={cn("mt-1 line-clamp-2 ds-caption")}>{model.description}</p>
            </div>

            <div className={cardBadgeRowClass}>
              <KnowledgeStatusBadge status={article.status} />
              <AiReadyBadge ready={aiReady} />
            </div>

            <dl className={cn(cardContentGapClass, "grid gap-2")}>
              <KnowledgeDetailRow label={t("knowledge.quality")} value={`${qualityScore}%`} />
              <KnowledgeDetailRow label={t("knowledge.usage")} value={String(usageCount)} />
              <KnowledgeDetailRow
                label={t("knowledge.updated")}
                value={formatKnowledgeDate(article.updated_at)}
              />
              <KnowledgeDetailRow label={t("knowledge.author")} value={authorLabel} />
            </dl>

            <div className={cn(cardContentGapClass, cardMetricCellClass)}>
              <p className="ds-overline">{t("knowledge.aiReadiness")}</p>
              <p className={cn(kpiMetricGapClass, "ds-kpi")}>
                <Metric value={qualityScore} formatter={(value) => `${Math.round(value)}%`} />
              </p>
            </div>
          </>
        }
      />
    </Panel>
  );
}
