"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { FilterBar } from "@/components/ui/data/FilterBar";
import { SearchInput } from "@/components/ui/core/SearchInput";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { KNOWLEDGE_STATUS_LABELS } from "@/lib/knowledge";
import { toolbarControlClass } from "@/lib/dashboard/design-system";

import type { KnowledgeSortKey, KnowledgeViewMode } from "./knowledge-ops-metrics";
import type { KnowledgeToolbarFilters } from "./knowledge-ui";

const SORT_OPTIONS: { value: KnowledgeSortKey; label: string }[] = [
  { value: "updated_desc", label: "Недавно обновлённые" },
  { value: "title_asc", label: "По названию" },
  { value: "quality_desc", label: "По качеству" },
  { value: "usage_desc", label: "По использованию" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "published", label: KNOWLEDGE_STATUS_LABELS.published },
  { value: "draft", label: KNOWLEDGE_STATUS_LABELS.draft },
  { value: "archived", label: KNOWLEDGE_STATUS_LABELS.archived },
] as const;

const AI_READY_OPTIONS = [
  { value: "", label: "Все статьи" },
  { value: "ready", label: "Готово для AI" },
  { value: "pending", label: "Не проиндексировано" },
] as const;

const QUALITY_OPTIONS = [
  { value: "", label: "Любое качество" },
  { value: "high", label: "Высокое (80%+)" },
  { value: "medium", label: "Среднее (60–79%)" },
  { value: "low", label: "Низкое (<60%)" },
] as const;

type Props = {
  filters: KnowledgeToolbarFilters;
  viewMode: KnowledgeViewMode;
  categories: string[];
  refreshing: boolean;
  onFiltersChange: (filters: KnowledgeToolbarFilters) => void;
  onViewModeChange: (value: KnowledgeViewMode) => void;
  onCreateClick: () => void;
  onImportClick: () => void;
  onRefresh: () => void;
};

export function KnowledgeToolbar({
  filters,
  viewMode,
  categories,
  refreshing,
  onFiltersChange,
  onViewModeChange,
  onCreateClick,
  onImportClick,
  onRefresh,
}: Props) {
  function patch(partial: Partial<KnowledgeToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ??
    "Сортировка";
  const activeStatus =
    STATUS_OPTIONS.find((option) => option.value === filters.status)?.label ??
    "Все статусы";
  const activeAiReady =
    AI_READY_OPTIONS.find((option) => option.value === filters.aiReady)?.label ??
    "Все статьи";
  const activeQuality =
    QUALITY_OPTIONS.find((option) => option.value === filters.quality)?.label ??
    "Любое качество";
  const activeCategory = filters.category || "Все категории";

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Поиск статей"
          aria-label="Поиск статей"
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      trailing={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} aria-hidden />
              {activeCategory}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ category: "" })}>
                Все категории
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
              <Filter size={15} aria-hidden />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {STATUS_OPTIONS.map((option) => (
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
              <Filter size={15} aria-hidden />
              {activeAiReady}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AI_READY_OPTIONS.map((option) => (
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
              <Filter size={15} aria-hidden />
              {activeQuality}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {QUALITY_OPTIONS.map((option) => (
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
              <Filter size={15} aria-hidden />
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ sort: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SegmentedControl
            value={viewMode}
            onChange={onViewModeChange}
            options={[
              {
                value: "grid",
                ariaLabel: "Карточки",
                label: (
                  <>
                    <LayoutGrid size={15} aria-hidden />
                    <span className="sr-only sm:not-sr-only sm:ml-1.5">Карточки</span>
                  </>
                ),
              },
              {
                value: "list",
                ariaLabel: "Таблица",
                label: (
                  <>
                    <List size={15} aria-hidden />
                    <span className="sr-only sm:not-sr-only sm:ml-1.5">Таблица</span>
                  </>
                ),
              },
            ]}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onImportClick}
            className="gap-2"
          >
            <Upload size={15} aria-hidden />
            Импорт
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            className="gap-2"
          >
            <RefreshCw size={15} aria-hidden />
            Обновить
          </Button>

          <Button type="button" size="sm" onClick={onCreateClick} className="gap-2">
            <Plus size={15} aria-hidden />
            Новая статья
          </Button>
        </>
      }
    />
  );
}
