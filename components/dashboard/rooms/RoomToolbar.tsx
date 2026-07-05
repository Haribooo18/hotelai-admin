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
import { FilterBar } from "@/components/ui/data/FilterBar";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import type {
  HousekeepingStatus,
  RoomOperationalStatus,
  RoomSortKey,
  RoomViewMode,
} from "./room-ops-metrics";
import type { RoomsToolbarFilters } from "./rooms-ui";

const SORT_OPTIONS: { value: RoomSortKey; label: string }[] = [
  { value: "type_asc", label: "Type A–Z" },
  { value: "type_desc", label: "Type Z–A" },
  { value: "price_asc", label: "Price ascending" },
  { value: "price_desc", label: "Price descending" },
  { value: "capacity", label: "By capacity" },
  { value: "status", label: "By status" },
];

const STATUS_OPTIONS: { value: RoomOperationalStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "cleaning", label: "Housekeeping" },
  { value: "maintenance", label: "Maintenance" },
  { value: "reserved", label: "Reserved" },
];

const HOUSEKEEPING_OPTIONS: { value: HousekeepingStatus | ""; label: string }[] =
  [
    { value: "", label: "All housekeeping" },
    { value: "clean", label: "Clean" },
    { value: "dirty", label: "Dirty" },
    { value: "inspected", label: "Inspected" },
  ];

const MAINTENANCE_OPTIONS = [
  { value: "", label: "All maintenance" },
  { value: "open", label: "In maintenance" },
  { value: "clear", label: "No issues" },
] as const;

type Props = {
  filters: RoomsToolbarFilters;
  viewMode: RoomViewMode;
  floorOptions: string[];
  roomTypeOptions: string[];
  refreshing: boolean;
  onFiltersChange: (filters: RoomsToolbarFilters) => void;
  onViewModeChange: (value: RoomViewMode) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
};

export function RoomToolbar({
  filters,
  viewMode,
  floorOptions,
  roomTypeOptions,
  refreshing,
  onFiltersChange,
  onViewModeChange,
  onCreateClick,
  onRefresh,
}: Props) {
  function patch(partial: Partial<RoomsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ?? "Sort";
  const activeStatus =
    STATUS_OPTIONS.find((option) => option.value === filters.status)?.label ??
    "All statuses";
  const activeHousekeeping =
    HOUSEKEEPING_OPTIONS.find((option) => option.value === filters.housekeeping)
      ?.label ?? "All housekeeping";
  const activeMaintenance =
    MAINTENANCE_OPTIONS.find((option) => option.value === filters.maintenance)
      ?.label ?? "All maintenance";
  const activeRoomType = filters.roomType || "All types";
  const activeFloor = filters.floor || "All floors";

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search room number or type"
          aria-label="Search rooms"
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      trailing={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Status filter"
            >
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
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Housekeeping filter"
            >
              <Filter size={15} aria-hidden />
              {activeHousekeeping}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {HOUSEKEEPING_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ housekeeping: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Maintenance filter"
            >
              <Filter size={15} aria-hidden />
              {activeMaintenance}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {MAINTENANCE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ maintenance: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Floor filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeFloor}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ floor: "" })}>
                All floors
              </DropdownMenuItem>
              {floorOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ floor: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Room type filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeRoomType}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ roomType: "" })}>
                All types
              </DropdownMenuItem>
              {roomTypeOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ roomType: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Sort rooms"
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
            aria-label="Refresh rooms"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-label="Export rooms"
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
            New room
          </Button>
        </>
      }
    />
  );
}
