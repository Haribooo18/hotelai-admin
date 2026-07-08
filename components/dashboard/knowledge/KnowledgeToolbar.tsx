"use client";

import { useMemo } from "react";
import { Filter, RefreshCw, Upload } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import {
  ToolbarSecondaryButton,
} from "@/components/ui/data/FilterBar";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import { SearchInput } from "@/components/ui/core/SearchInput";
import { useI18n } from "@/lib/i18n";
import {
  toolbarControlClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";

import type { KnowledgeArticleStatus } from "@/types/knowledge-article";

import type { KnowledgeSortKey } from "./knowledge-ops-metrics";
import type { KnowledgeToolbarFilters } from "./knowledge-ui";

type Props = {
  filters: KnowledgeToolbarFilters;
  categories: string[];
  refreshing: boolean;
  onFiltersChange: (filters: KnowledgeToolbarFilters) => void;
  onImportClick: () => void;
  onRefresh: () => void;
};

export function KnowledgeToolbar({
  filters,
  categories,
  refreshing,
  onFiltersChange,
  onImportClick,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const sortOptions = useMemo(
    (): { value: KnowledgeSortKey; label: string }[] => [
      { value: "updated_desc", label: t("knowledge.sortUpdated") },
      { value: "title_asc", label: t("knowledge.sortTitle") },
      { value: "quality_desc", label: t("knowledge.sortQuality") },
      { value: "usage_desc", label: t("knowledge.sortUsage") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    (): { value: KnowledgeArticleStatus | ""; label: string }[] => [
      { value: "", label: t("toolbar.allStatuses") },
      { value: "published", label: t("statuses.knowledge.published") },
      { value: "draft", label: t("statuses.knowledge.draft") },
      { value: "archived", label: t("statuses.knowledge.archived") },
    ],
    [t]
  );

  const aiReadyOptions = useMemo(
    () =>
      [
        { value: "", label: t("toolbar.allArticles") },
        { value: "ready", label: t("knowledge.aiReady") },
        { value: "pending", label: t("knowledge.aiPending") },
      ] as const,
    [t]
  );

  const qualityOptions = useMemo(
    () =>
      [
        { value: "", label: t("toolbar.anyQuality") },
        { value: "high", label: t("knowledge.qualityHigh") },
        { value: "medium", label: t("knowledge.qualityMedium") },
        { value: "low", label: t("knowledge.qualityLow") },
      ] as const,
    [t]
  );

  function patch(partial: Partial<KnowledgeToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    sortOptions.find((option) => option.value === filters.sort)?.label ??
    t("common.sort");
  const activeStatus =
    statusOptions.find((option) => option.value === filters.status)?.label ??
    t("toolbar.allStatuses");
  const activeAiReady =
    aiReadyOptions.find((option) => option.value === filters.aiReady)?.label ??
    t("toolbar.allArticles");
  const activeQuality =
    qualityOptions.find((option) => option.value === filters.quality)?.label ??
    t("toolbar.anyQuality");
  const activeCategory = filters.category || t("toolbar.allCategories");

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("knowledge.searchPlaceholder")}
          aria-label={t("knowledge.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      primaryFilters={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeCategory}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ category: "" })}>
                {t("toolbar.allCategories")}
              </DropdownMenuItem>
              {categories.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ category: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ status: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeAiReady}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {aiReadyOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ aiReady: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeQuality}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {qualityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() =>
                    patch({
                      quality: option.value as KnowledgeToolbarFilters["quality"],
                    })
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ sort: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      actions={
        <>
          <ToolbarSecondaryButton type="button" onClick={onImportClick}>
            <Upload size={toolbarFilterIconSize} aria-hidden />
            {t("common.import")}
          </ToolbarSecondaryButton>

          <ToolbarSecondaryButton
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
          >
            <RefreshCw size={toolbarFilterIconSize} aria-hidden />
            {t("common.refresh")}
          </ToolbarSecondaryButton>
        </>
      }
    />
  );
}
