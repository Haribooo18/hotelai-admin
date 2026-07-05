"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
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
import { cn } from "@/lib/utils";

import type {
  HousekeepingStatus,
  RoomOperationalStatus,
  RoomSortKey,
  RoomViewMode,
} from "./room-ops-metrics";

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

type Props = {
  search: string;
  floor: string;
  status: string;
  roomType: string;
  housekeeping: string;
  floorOptions: string[];
  roomTypeOptions: string[];
  sortKey: RoomSortKey;
  viewMode: RoomViewMode;
  refreshing: boolean;
  onSearchChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
  onHousekeepingChange: (value: string) => void;
  onSortChange: (value: RoomSortKey) => void;
  onViewModeChange: (value: RoomViewMode) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
};

export function RoomToolbar({
  search,
  floor,
  status,
  roomType,
  housekeeping,
  floorOptions,
  roomTypeOptions,
  sortKey,
  viewMode,
  refreshing,
  onSearchChange,
  onFloorChange,
  onStatusChange,
  onRoomTypeChange,
  onHousekeepingChange,
  onSortChange,
  onViewModeChange,
  onCreateClick,
  onRefresh,
}: Props) {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sortKey)?.label ?? "Sort";
  const activeStatus =
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "All statuses";
  const activeHousekeeping =
    HOUSEKEEPING_OPTIONS.find((option) => option.value === housekeeping)
      ?.label ?? "All housekeeping";
  const activeRoomType = roomType || "All types";
  const activeFloor = floor || "All floors";

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
            placeholder="Search room number or type"
            aria-label="Search rooms"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeRoomType}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoomTypeChange("")}>
                All types
              </DropdownMenuItem>
              {roomTypeOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onRoomTypeChange(value)}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeFloor}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onFloorChange("")}>
                All floors
              </DropdownMenuItem>
              {floorOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onFloorChange(value)}
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
              {activeHousekeeping}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {HOUSEKEEPING_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => onHousekeepingChange(option.value)}
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
            aria-label="View mode"
            className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "cards"}
              onClick={() => onViewModeChange("cards")}
              className={cn(
                chipClass,
                "rounded-[var(--ds-radius-sm)] px-3 py-1",
                viewMode === "cards" ? chipActiveClass : chipIdleClass
              )}
            >
              <LayoutGrid size={14} className="mr-1 inline" />
              Cards
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "table"}
              onClick={() => onViewModeChange("table")}
              className={cn(
                chipClass,
                "rounded-[var(--ds-radius-sm)] px-3 py-1",
                viewMode === "table" ? chipActiveClass : chipIdleClass
              )}
            >
              <List size={14} className="mr-1 inline" />
              Table
            </button>
          </div>

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
            Refresh
          </Button>

          <Button
            type="button"
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
          >
            <Plus size={15} />
            Add room
          </Button>
        </div>
      </div>
    </div>
  );
}
