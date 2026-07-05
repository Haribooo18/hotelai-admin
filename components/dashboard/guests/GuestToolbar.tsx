"use client";

import {
  Crown,
  Filter,
  LayoutGrid,
  List,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { GuestCreateButton } from "./GuestCreateDialog";
import type { GuestSortKey, GuestViewMode } from "./guest-crm-metrics";

const SORT_OPTIONS: { value: GuestSortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "activity", label: "Last activity" },
  { value: "spent", label: "By total spent" },
  { value: "visits", label: "By visits" },
];

type Props = {
  search: string;
  flag: string;
  tag: string;
  tagOptions: string[];
  sortKey: GuestSortKey;
  viewMode: GuestViewMode;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onFlagChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: GuestSortKey) => void;
  onViewModeChange: (value: GuestViewMode) => void;
  onCreateClick: () => void;
  onBulkDelete: () => void;
  onBulkVip: () => void;
  onBulkFavorite: () => void;
  onClearSelection: () => void;
};

export function GuestToolbar({
  search,
  flag,
  tag,
  tagOptions,
  sortKey,
  viewMode,
  selectedCount,
  onSearchChange,
  onFlagChange,
  onTagChange,
  onSortChange,
  onViewModeChange,
  onCreateClick,
  onBulkDelete,
  onBulkVip,
  onBulkFavorite,
  onClearSelection,
}: Props) {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sortKey)?.label ??
    "Sort";

  return (
    <div className="sticky top-[72px] z-20 space-y-4 rounded-[20px] bg-[var(--shell-content)]/90 p-4 backdrop-blur-xl lg:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={18}
          />
          <Input
            className="h-11 rounded-[12px] border-0 bg-[var(--shell-surface)] pl-10 text-[13px] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out focus-visible:ring-emerald-500/30"
            placeholder="Search by name, email, phone..."
            aria-label="Search guests"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={flag}
            onChange={onFlagChange}
            placeholder="All guests"
            aria-label="Filter by flag"
            className="h-11 min-w-[140px] rounded-[12px] border-0 bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]"
            options={[
              { value: "vip", label: "VIP only" },
              { value: "favorite", label: "Favorites only" },
            ]}
          />

          <Select
            value={tag}
            onChange={onTagChange}
            placeholder="All tags"
            aria-label="Filter by tag"
            className="h-11 min-w-[140px] rounded-[12px] border-0 bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]"
            options={tagOptions.map((value) => ({ value, label: value }))}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-[12px] bg-[var(--shell-surface)] px-4 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
                "hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              )}
            >
              <Filter size={16} className="text-[var(--shell-muted)]" />
              {activeSort}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-52 rounded-[12px] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "rounded-[10px] px-3 py-2 text-[13px]",
                    sortKey === option.value
                      ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                      : "text-[var(--shell-text)]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex rounded-[12px] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-sm)]">
            <button
              type="button"
              aria-label="Grid"
              aria-pressed={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-[180ms] ease-out",
                viewMode === "grid"
                  ? "bg-[var(--shell-nav-active-bg)] text-emerald-500"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              aria-label="List"
              aria-pressed={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-[180ms] ease-out",
                viewMode === "list"
                  ? "bg-[var(--shell-nav-active-bg)] text-emerald-500"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <List size={16} />
            </button>
          </div>

          <GuestCreateButton
            onClick={onCreateClick}
            className="h-11 rounded-[12px] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:bg-emerald-500"
          />
        </div>
      </div>

      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[14px] bg-[var(--shell-surface)] px-4 py-3 shadow-[var(--shell-shadow-sm)]">
          <span className="text-[13px] font-medium text-[var(--shell-text)]">
            Selected: {selectedCount}
          </span>
          <button
            type="button"
            onClick={onBulkVip}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--shell-nav-hover-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--shell-text)] transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-active-bg)]"
          >
            <Crown size={14} />
            VIP
          </button>
          <button
            type="button"
            onClick={onBulkFavorite}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--shell-nav-hover-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--shell-text)] transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-active-bg)]"
          >
            <Star size={14} />
            Add to favorites
          </button>
          <button
            type="button"
            onClick={onBulkDelete}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-red-500/10 px-3 py-1.5 text-[12px] font-medium text-red-400 transition-all duration-[180ms] ease-out hover:bg-red-500/15"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <button
            type="button"
            onClick={onClearSelection}
            className="ml-auto text-[12px] text-[var(--shell-muted)] transition-opacity duration-[180ms] ease-out hover:opacity-80"
          >
            Clear selection
          </button>
        </div>
      ) : null}
    </div>
  );
}
