"use client";

import { memo } from "react";
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
import { CardMetricCell } from "@/components/ui/data/CardMetricCell";
import {
  cardBadgeRowClass,
  cardDescriptionClass,
  cardMetricGridClass,
  iconActionClass,
  workspaceCardCategoryClass,
  workspaceCardTitleClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { formatTranslation, useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
  const { article, description, qualityScore, usageCount, aiReady, authorLabel } =
    model;

  function handleCardClick() {
    onSelect?.();
  }

  return (
    <KnowledgeWorkspaceCard
      selected={selected}
      role="listitem"
      aria-label={formatTranslation(t("knowledge.articleCardAria"), {
        title: article.title,
      })}
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
          <p className={cn(workspaceCardTitleClass, "line-clamp-2 leading-snug")}>
            {article.title}
          </p>
          {article.category && (
            <p className={workspaceCardCategoryClass}>{article.category}</p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={formatTranslation(t("knowledge.articleActionsFor"), {
              title: article.title,
            })}
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
              {t("common.open")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              <Pencil size={14} className="mr-2" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy size={14} className="mr-2" />
              {t("common.duplicate")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 size={14} className="mr-2" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className={cn(cardDescriptionClass, "line-clamp-2 text-[12px]")}>
        {description}
      </p>

      <div className={cardBadgeRowClass}>
        <AiReadyBadge ready={aiReady} />
        <KnowledgeStatusBadge status={article.status} />
      </div>

      <div className={cardMetricGridClass}>
        <CardMetricCell label={t("knowledge.quality")}>
          <Metric value={qualityScore} formatter={(value) => `${Math.round(value)}%`} />
        </CardMetricCell>
        <CardMetricCell label={t("knowledge.usage")}>
          <Metric value={usageCount} />
        </CardMetricCell>
        <CardMetricCell
          label={t("knowledge.updated")}
          value={formatKnowledgeDate(article.updated_at)}
        />
        <CardMetricCell label={t("knowledge.author")} value={authorLabel} />
      </div>
    </KnowledgeWorkspaceCard>
  );
});
