"use client";

import {
  ArrowLeftRight,
  Download,
  Filter,
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
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import {
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import type { Room } from "@/types/room";

import {
  defaultRevenueRange,
  type RevenueDateRange,
} from "./revenue-metrics";

type Props = {
  range: RevenueDateRange;
  compareEnabled: boolean;
  exporting: boolean;
  refreshing: boolean;
  canExport: boolean;
  search: string;
  statusFilter: string;
  roomFilter: string;
  rooms: Room[];
  onRangeChange: (range: RevenueDateRange) => void;
  onCompareChange: (enabled: boolean) => void;
  onExport: () => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRoomFilterChange: (value: string) => void;
};

export function RevenueToolbar({
  range,
  compareEnabled,
  exporting,
  refreshing,
  canExport,
  search,
  statusFilter,
  roomFilter,
  rooms,
  onRangeChange,
  onCompareChange,
  onExport,
  onRefresh,
  onSearchChange,
  onStatusFilterChange,
  onRoomFilterChange,
}: Props) {
  const activeStatusLabel =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All statuses";
  const activeRoomLabel =
    rooms.find((room) => room.id === roomFilter)?.room_type ?? "All rooms";

  return (
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={range.from}
            onChange={(e) => onRangeChange({ ...range, from: e.target.value })}
            aria-label="Start date"
            className="h-[var(--ds-input-height)] w-[148px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />
          <span className="text-[12px] text-[var(--shell-muted)]">to</span>
          <Input
            type="date"
            value={range.to}
            onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
            aria-label="End date"
            className="h-[var(--ds-input-height)] w-[148px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onRangeChange(defaultRevenueRange())}
            className="rounded-[var(--ds-radius-sm)]"
          >
            30 days
          </Button>

          <button
            type="button"
            onClick={() => onCompareChange(!compareEnabled)}
            className={cn(
              toolbarControlClass,
              compareEnabled &&
                "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
            )}
          >
            <ArrowLeftRight size={15} />
            Compare period
          </button>
        </div>

        <div className="relative min-w-0 flex-1 xl:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={17}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Search guest or room"
            aria-label="Search transactions"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeRoomLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoomFilterChange("")}>
                All rooms
              </DropdownMenuItem>
              {rooms.map((room) => (
                <DropdownMenuItem
                  key={room.id}
                  onClick={() => onRoomFilterChange(room.id)}
                >
                  {room.room_type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeStatusLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusFilterChange("")}>
                All statuses
              </DropdownMenuItem>
              {BOOKING_STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onExport}
            disabled={exporting || !canExport}
            loading={exporting}
            className="gap-2 rounded-[var(--ds-radius-sm)]"
          >
            <Download size={15} />
            Export CSV
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
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
