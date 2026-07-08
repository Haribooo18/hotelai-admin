"use client";

import { useMemo } from "react";
import { ArrowLeftRight, Download, Filter, RefreshCw } from "lucide-react";

import { ToolbarDateInput } from "@/components/ui/core/ToolbarDateInput";
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
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import {
  toolbarControlClass,
  toolbarFilterIconSize,
  toolbarInlineLabelClass,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import type { Room } from "@/types/room";

import {
  buildRevenuePresetRange,
  detectRevenuePreset,
  type RevenueRangePreset,
  type RevenueToolbarFilters,
} from "./revenue-ui";
import type { RevenueDateRange } from "./revenue-metrics";

type Props = {
  range: RevenueDateRange;
  preset: RevenueRangePreset;
  compareEnabled: boolean;
  exporting: boolean;
  refreshing: boolean;
  canExport: boolean;
  filters: RevenueToolbarFilters;
  rooms: Room[];
  onRangeChange: (range: RevenueDateRange) => void;
  onPresetChange: (preset: RevenueRangePreset) => void;
  onCompareChange: (enabled: boolean) => void;
  onExport: () => void;
  onRefresh: () => void;
  onFiltersChange: (filters: RevenueToolbarFilters) => void;
};

export function RevenueToolbar({
  range,
  preset,
  compareEnabled,
  exporting,
  refreshing,
  canExport,
  filters,
  rooms,
  onRangeChange,
  onPresetChange,
  onCompareChange,
  onExport,
  onRefresh,
  onFiltersChange,
}: Props) {
  const { t } = useI18n();

  const presetOptions = useMemo(
    (): Array<{
      value: Exclude<RevenueRangePreset, "custom">;
      label: string;
    }> => [
      { value: "today", label: t("revenue.today") },
      { value: "week", label: t("revenue.week") },
      { value: "month", label: t("revenue.month") },
      { value: "quarter", label: t("revenue.quarter") },
      { value: "year", label: t("revenue.year") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.allStatuses") },
      ...BOOKING_STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`statuses.booking.${option.value}`),
      })),
    ],
    [t]
  );

  function patch(partial: Partial<RevenueToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    statusOptions.find((option) => option.value === filters.status)?.label ??
    t("toolbar.allStatuses");

  const activeRoom =
    rooms.find((room) => room.id === filters.roomId)?.room_type ??
    t("toolbar.allRooms");

  function applyPreset(next: Exclude<RevenueRangePreset, "custom">) {
    onPresetChange(next);
    onRangeChange(buildRevenuePresetRange(next));
  }

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("revenue.searchPlaceholder")}
          aria-label={t("revenue.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      primaryFilters={
        <>
          <ToolbarDateInput
            value={range.from}
            onChange={(event) => {
              onPresetChange("custom");
              onRangeChange({ ...range, from: event.target.value });
            }}
            aria-label={t("revenue.startDate")}
          />
          <span className={toolbarInlineLabelClass}>{t("revenue.dateTo")}</span>
          <ToolbarDateInput
            value={range.to}
            onChange={(event) => {
              onPresetChange("custom");
              onRangeChange({ ...range, to: event.target.value });
            }}
            aria-label={t("revenue.endDate")}
          />

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeRoom}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ roomId: "" })}>
                {t("toolbar.allRooms")}
              </DropdownMenuItem>
              {rooms.map((room) => (
                <DropdownMenuItem
                  key={room.id}
                  onClick={() => patch({ roomId: room.id })}
                >
                  {room.room_type}
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
        </>
      }
      actions={
        <>
          <ToolbarSecondaryButton
            type="button"
            variant={compareEnabled ? "default" : "outline"}
            onClick={() => onCompareChange(!compareEnabled)}
          >
            <ArrowLeftRight size={toolbarFilterIconSize} aria-hidden />
            {t("revenue.compare")}
          </ToolbarSecondaryButton>

          <ToolbarSecondaryButton
            type="button"
            onClick={onExport}
            disabled={exporting || !canExport}
            loading={exporting}
          >
            <Download size={toolbarFilterIconSize} aria-hidden />
            {t("common.export")}
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
      chips={
        <>
          {presetOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={preset === option.value}
              onClick={() => applyPreset(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
          <FilterChip
            active={preset === "custom" || detectRevenuePreset(range) === "custom"}
            onClick={() => onPresetChange("custom")}
          >
            {t("revenue.custom")}
          </FilterChip>
        </>
      }
    />
  );
}
