"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { GuestCreateButton } from "./GuestCreateDialog";
import {
  GUEST_STATUS_FILTERS,
  type GuestSortKey,
  type GuestStatusFilter,
  type GuestViewMode,
} from "./guest-crm-metrics";

const SORT_OPTIONS: { value: GuestSortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "activity", label: "Last activity" },
  { value: "spent", label: "By lifetime revenue" },
  { value: "visits", label: "By total stays" },
];

type Props = {
  search: string;
  status: GuestStatusFilter;
  tag: string;
  country: string;
  tagOptions: string[];
  countryOptions: string[];
  sortKey: GuestSortKey;
  viewMode: GuestViewMode;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: GuestStatusFilter) => void;
  onTagChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSortChange: (value: GuestSortKey) => void;
  onViewModeChange: (value: GuestViewMode) => void;
  onCreateClick: () => void;
};

export function GuestToolbar({
  search,
  status,
  tag,
  country,
  tagOptions,
  countryOptions,
  sortKey,
  viewMode,
  onSearchChange,
  onStatusChange,
  onTagChange,
  onCountryChange,
  onSortChange,
  onViewModeChange,
  onCreateClick,
}: Props) {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sortKey)?.label ?? "Sort";

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
            placeholder="Search by name, email, phone..."
            aria-label="Search guests"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={tag}
            onChange={onTagChange}
            placeholder="All tags"
            aria-label="Filter by tag"
            className="h-[var(--ds-input-height)] min-w-[130px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
            options={tagOptions.map((value) => ({ value, label: value }))}
          />

          <Select
            value={country}
            onChange={onCountryChange}
            placeholder="All countries"
            aria-label="Filter by country"
            className="h-[var(--ds-input-height)] min-w-[140px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
            options={countryOptions.map((value) => ({ value, label: value }))}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Sort guests"
              className={toolbarControlClass}
            >
              <Filter size={15} className="text-[var(--shell-muted)]" />
              {activeSort}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-52 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
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

          <div className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]">
            <button
              type="button"
              aria-label="Cards view"
              aria-pressed={viewMode === "cards"}
              onClick={() => onViewModeChange("cards")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
                viewMode === "cards"
                  ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              onClick={() => onViewModeChange("table")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
                viewMode === "table"
                  ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <List size={15} />
            </button>
          </div>

          <GuestCreateButton
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-emerald-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {GUEST_STATUS_FILTERS.map((option) => {
          const active = status === option.value;

          return (
            <button
              key={option.value || "all"}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={cn(chipClass, active ? chipActiveClass : chipIdleClass)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
