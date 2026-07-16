"use client";

import { BookOpen, Copy, Pencil, Trash2 } from "lucide-react";

import { Metric } from "@/components/ui/display/Metric";
import {
  TableRowActions,
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableRow,
} from "@/components/dashboard/shared/WorkspaceTable";
import { tablePrimaryTextClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  const headers = [
    { key: "title", label: t("knowledge.colTitle") },
    { key: "category", label: t("knowledge.colCategory") },
    { key: "status", label: t("knowledge.colStatus") },
    { key: "ai", label: "AI" },
    { key: "quality", label: t("knowledge.colQuality") },
    { key: "updated", label: t("knowledge.colUpdated") },
    { key: "usage", label: t("knowledge.colUsage") },
    { key: "actions", label: t("a11y.actions"), srOnly: true },
  ] as const;

  return (
    <WorkspaceTable
      caption={t("knowledge.tableCaption")}
      minWidth={960}
      loading={loading}
      isEmpty={models.length === 0}
      empty={{
        title: t("knowledge.notFound"),
        description: t("knowledge.notFoundDesc"),
        icon: <BookOpen size={18} />,
        guidance: t("workspace.knowledge.emptyGuidance"),
      }}
      headers={headers.map((header) => ({
        key: header.key,
        label: header.label,
        srOnly: "srOnly" in header ? header.srOnly : false,
      }))}
    >
      {models.map((model) => {
        const selected = selectedId === model.article.id;

        return (
          <WorkspaceTableRow
            key={model.article.id}
            selected={selected}
            onClick={() => onSelect?.(model)}
            a11yLabel={`${t("knowledge.selectArticle")} ${model.article.title}`}
            onActivate={() => onSelect?.(model)}
          >
            <WorkspaceTableCell>
              <p className={cn(tablePrimaryTextClass, "max-w-[240px]")}>
                {model.article.title}
              </p>
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {model.article.category ?? "—"}
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <KnowledgeStatusBadge status={model.article.status} />
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <AiReadyBadge ready={model.aiReady} />
            </WorkspaceTableCell>
            <WorkspaceTableCell metric>
              <Metric
                value={model.qualityScore}
                formatter={(value) => `${Math.round(value)}%`}
              />
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {formatKnowledgeDate(model.article.updated_at)}
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              <Metric value={model.usageCount} />
            </WorkspaceTableCell>
            <WorkspaceTableCell align="right">
              <TableRowActions
                ariaLabel={`${t("a11y.actions")}: ${model.article.title}`}
                onTriggerClick={(event) => event.stopPropagation()}
                actions={[
                  {
                    label: t("common.open"),
                    onClick: () => onOpen(model),
                  },
                  {
                    label: t("common.edit"),
                    icon: Pencil,
                    onClick: () => onEdit(model),
                  },
                  {
                    label: t("common.duplicate"),
                    icon: Copy,
                    onClick: () => onDuplicate(model),
                  },
                  {
                    label: t("common.delete"),
                    icon: Trash2,
                    onClick: () => onDelete(model),
                    destructive: true,
                  },
                ]}
              />
            </WorkspaceTableCell>
          </WorkspaceTableRow>
        );
      })}
    </WorkspaceTable>
  );
}
