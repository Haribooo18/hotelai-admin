"use client";

import {
  ArrowLeftRight,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { FilterBar, FilterChip } from "@/components/ui/data/FilterBar";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import type { Room } from "@/types/room";

import {
  buildRevenuePresetRange,
  detectRevenuePreset,
  type RevenueRangePreset,
  type RevenueToolbarFilters,
} from "./revenue-ui";
import type { RevenueDateRange } from "./revenue-metrics";

const PRESET_OPTIONS: Array<{
  value: Exclude<RevenueRangePreset, "custom">;
  label: string;
}> = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

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
  function patch(partial: Partial<RevenueToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === filters.status)
      ?.label ?? "All statuses";

  const activeRoom =
    rooms.find((room) => room.id === filters.roomId)?.room_type ?? "All rooms";

  function applyPreset(next: Exclude<RevenueRangePreset, "custom">) {
    onPresetChange(next);
    onRangeChange(buildRevenuePresetRange(next));
  }

  return (
    <FilterBar
      leading={
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_OPTIONS.map((option) => (
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
            Custom
          </FilterChip>
        </div>
      }
      trailing={
        <>
          <Input
            type="date"
            value={range.from}
            onChange={(event) => {
              onPresetChange("custom");
              onRangeChange({ ...range, from: event.target.value });
            }}
            aria-label="Start date"
            className="h-[var(--ds-input-height)] w-[148px]"
          />
          <span className="text-[12px] text-[var(--shell-muted)]">to</span>
          <Input
            type="date"
            value={range.to}
            onChange={(event) => {
              onPresetChange("custom");
              onRangeChange({ ...range, to: event.target.value });
            }}
            aria-label="End date"
            className="h-[var(--ds-input-height)] w-[148px]"
          />

          <Button
            type="button"
            variant={compareEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onCompareChange(!compareEnabled)}
            className="gap-2"
          >
            <ArrowLeftRight size={15} aria-hidden />
            Compare
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={exporting || !canExport}
            loading={exporting}
            className="gap-2"
          >
            <Download size={15} aria-hidden />
            Export
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
            Refresh
          </Button>
        </>
      }
      filters={
        <>
          <SearchInput
            containerClassName="min-w-[220px] flex-1 xl:max-w-sm"
            placeholder="Search guest or room"
            aria-label="Search transactions"
            value={filters.search}
            onChange={(event) => patch({ search: event.target.value })}
          />

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} aria-hidden />
              {activeRoom}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ roomId: "" })}>
                All rooms
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
              <Filter size={15} aria-hidden />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ status: "" })}>
                All statuses
              </DropdownMenuItem>
              {BOOKING_STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ status: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  );
}
