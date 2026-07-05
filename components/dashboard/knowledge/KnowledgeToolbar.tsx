"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { KNOWLEDGE_STATUS_LABELS } from "@/lib/knowledge";
import { cn } from "@/lib/utils";

import type { KnowledgeSortKey, KnowledgeViewMode } from "./knowledge-ops-metrics";

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

type Props = {
  search: string;
  category: string;
  status: string;
  aiReady: string;
  sortKey: KnowledgeSortKey;
  viewMode: KnowledgeViewMode;
  categories: string[];
  refreshing: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAiReadyChange: (value: string) => void;
  onSortChange: (value: KnowledgeSortKey) => void;
  onViewModeChange: (value: KnowledgeViewMode) => void;
  onCreateClick: () => void;
  onImportClick: () => void;
  onRefresh: () => void;
};

export function KnowledgeToolbar({
  search,
  category,
  status,
  aiReady,
  sortKey,
  viewMode,
  categories,
  refreshing,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAiReadyChange,
  onSortChange,
  onViewModeChange,
  onCreateClick,
  onImportClick,
  onRefresh,
}: Props) {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sortKey)?.label ?? "Сортировка";
  const activeStatus =
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? "Все статусы";
  const activeAiReady =
    AI_READY_OPTIONS.find((option) => option.value === aiReady)?.label ?? "Все статьи";
  const activeCategory = category || "Все категории";

  return (
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={17}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Поиск статей"
            aria-label="Поиск статей"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeCategory}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCategoryChange("")}>
                Все категории
              </DropdownMenuItem>
              {categories.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onCategoryChange(value)}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => onStatusChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeAiReady}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AI_READY_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => onAiReadyChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            role="tablist"
            aria-label="Режим отображения"
            className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
              className={cn(
                chipClass,
                "rounded-[var(--ds-radius-sm)] px-3 py-1",
                viewMode === "grid" ? chipActiveClass : chipIdleClass
              )}
            >
              <LayoutGrid size={14} className="mr-1 inline" />
              Карточки
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
              className={cn(
                chipClass,
                "rounded-[var(--ds-radius-sm)] px-3 py-1",
                viewMode === "list" ? chipActiveClass : chipIdleClass
              )}
            >
              <List size={14} className="mr-1 inline" />
              Список
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onImportClick}
            className="gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
          >
            <Upload size={15} />
            Импорт
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            className="gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
          >
            <RefreshCw size={15} />
            Обновить
          </Button>

          <Button
            type="button"
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
          >
            <Plus size={15} />
            Новая статья
          </Button>
        </div>
      </div>
    </div>
  );
}
