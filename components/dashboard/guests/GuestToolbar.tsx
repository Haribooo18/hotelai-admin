"use client";

import {
  Download,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { FilterBar, FilterChip } from "@/components/ui/data/FilterBar";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import {
  GUEST_STATUS_FILTERS,
  type GuestSortKey,
  type GuestViewMode,
} from "./guest-crm-metrics";
import type { GuestsToolbarFilters } from "./guests-ui";

const SORT_OPTIONS: { value: GuestSortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "activity", label: "Last activity" },
  { value: "spent", label: "By lifetime revenue" },
  { value: "visits", label: "By total stays" },
];

const VIP_OPTIONS = [
  { value: "", label: "All guests" },
  { value: "yes", label: "VIP only" },
  { value: "no", label: "Non-VIP" },
] as const;

type Props = {
  filters: GuestsToolbarFilters;
  viewMode: GuestViewMode;
  tagOptions: string[];
  countryOptions: string[];
  languageOptions: string[];
  refreshing: boolean;
  onFiltersChange: (filters: GuestsToolbarFilters) => void;
  onViewModeChange: (value: GuestViewMode) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
};

export function GuestToolbar({
  filters,
  viewMode,
  tagOptions,
  countryOptions,
  languageOptions,
  refreshing,
  onFiltersChange,
  onViewModeChange,
  onCreateClick,
  onRefresh,
}: Props) {
  function patch(partial: Partial<GuestsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ?? "Sort";
  const activeTag = filters.tag || "All tags";
  const activeCountry = filters.country || "All countries";
  const activeLanguage = filters.language || "All languages";
  const activeVip =
    VIP_OPTIONS.find((option) => option.value === filters.vip)?.label ??
    "All guests";

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search by name, email, phone..."
          aria-label="Search guests"
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      trailing={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Tag filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeTag}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ tag: "" })}>
                All tags
              </DropdownMenuItem>
              {tagOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ tag: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="VIP filter"
            >
              <Filter size={15} aria-hidden />
              {activeVip}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {VIP_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ vip: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Country filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeCountry}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ country: "" })}>
                All countries
              </DropdownMenuItem>
              {countryOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ country: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Language filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeLanguage}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ language: "" })}>
                All languages
              </DropdownMenuItem>
              {languageOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ language: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Sort guests"
            >
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ sort: option.value })}
                  className={cn(
                    filters.sort === option.value &&
                      "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label="Refresh guests"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-label="Export guests"
            title="Export coming soon"
          >
            <Download size={15} aria-hidden />
            Export
          </Button>

          <SegmentedControl
            value={viewMode}
            onChange={onViewModeChange}
            options={[
              {
                value: "cards",
                ariaLabel: "Card view",
                label: <LayoutGrid size={15} aria-hidden />,
              },
              {
                value: "table",
                ariaLabel: "Table view",
                label: <List size={15} aria-hidden />,
              },
            ]}
          />

          <Button
            type="button"
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
          >
            <Plus size={15} aria-hidden />
            New guest
          </Button>
        </>
      }
      filters={
        <>
          {GUEST_STATUS_FILTERS.map((option) => (
            <FilterChip
              key={option.value || "all"}
              active={filters.status === option.value}
              onClick={() => patch({ status: option.value })}
            >
              {option.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
