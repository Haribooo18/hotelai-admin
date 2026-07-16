"use client";

import { useMemo } from "react";
import { Filter, RefreshCw } from "lucide-react";

import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import {
  FilterChip,
  ToolbarSecondaryButton,
} from "@/components/ui/data/FilterBar";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import {
  toolbarControlClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import {
  GUEST_STATUS_FILTERS,
  type GuestSortKey,
  type GuestStatusFilter,
} from "./guest-crm-metrics";
import type { GuestsToolbarFilters } from "./guests-ui";

type Props = {
  filters: GuestsToolbarFilters;
  tagOptions: string[];
  countryOptions: string[];
  languageOptions: string[];
  refreshing: boolean;
  onFiltersChange: (filters: GuestsToolbarFilters) => void;
  onRefresh: () => void;
};

function guestStatusLabel(
  value: GuestStatusFilter,
  t: ReturnType<typeof useI18n>["t"]
): string {
  switch (value) {
    case "":
      return t("toolbar.allStatuses");
    case "active":
      return t("guests.chipActiveStays");
    case "returning":
      return t("guests.chipReturning");
    case "vip":
      return t("guests.vipOnly");
    default:
      return value;
  }
}

export function GuestToolbar({
  filters,
  tagOptions,
  countryOptions,
  languageOptions,
  refreshing,
  onFiltersChange,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const sortOptions = useMemo(
    (): { value: GuestSortKey; label: string }[] => [
      { value: "newest", label: t("guests.sortNewest") },
      { value: "name_asc", label: t("guests.sortNameAsc") },
      { value: "name_desc", label: t("guests.sortNameDesc") },
      { value: "activity", label: t("guests.sortActivity") },
      { value: "spent", label: t("guests.sortSpent") },
      { value: "visits", label: t("guests.sortVisits") },
    ],
    [t]
  );

  const vipOptions = useMemo(
    () =>
      [
        { value: "", label: t("toolbar.allGuests") },
        { value: "yes", label: t("guests.vipOnly") },
        { value: "no", label: t("guests.nonVip") },
      ] as const,
    [t]
  );

  const statusChipOptions = useMemo(
    () =>
      GUEST_STATUS_FILTERS.map((option) => ({
        value: option.value,
        label: guestStatusLabel(option.value, t),
      })),
    [t]
  );

  function patch(partial: Partial<GuestsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    sortOptions.find((option) => option.value === filters.sort)?.label ??
    t("common.sort");
  const activeTag = filters.tag || t("toolbar.allTags");
  const activeCountry = filters.country || t("toolbar.allCountries");
  const activeLanguage = filters.language || t("toolbar.allLanguages");
  const activeVip =
    vipOptions.find((option) => option.value === filters.vip)?.label ??
    t("toolbar.allGuests");

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("guests.searchPlaceholder")}
          aria-label={t("guests.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      primaryFilters={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("guests.tagFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[96px] truncate">{activeTag}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ tag: "" })}>
                {t("toolbar.allTags")}
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
              aria-label={t("guests.vipFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeVip}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {vipOptions.map((option) => (
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
              aria-label={t("guests.countryFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[96px] truncate">{activeCountry}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ country: "" })}>
                {t("toolbar.allCountries")}
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
              aria-label={t("guests.languageFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[96px] truncate">{activeLanguage}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ language: "" })}>
                {t("toolbar.allLanguages")}
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
              aria-label={t("guests.sortAria")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
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
        </>
      }
      actions={
        <>
          <ToolbarSecondaryButton
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label={t("guests.refreshAria")}
          >
            <RefreshCw size={toolbarFilterIconSize} aria-hidden />
            {t("common.refresh")}
          </ToolbarSecondaryButton>
        </>
      }
      chips={
        <>
          {statusChipOptions.map((option) => (
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
