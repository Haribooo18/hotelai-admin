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
import { Input } from "@/components/ui/core/Input";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { FilterBar, FilterChip } from "@/components/ui/data/FilterBar";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import type { Room } from "@/types/room";

import type {
  BookingPaymentStatus,
  BookingSource,
  BookingViewMode,
} from "./booking-ops-metrics";
import type { BookingsChipFilter, BookingsToolbarFilters } from "./bookings-ui";

const CHIP_FILTERS: { id: BookingsChipFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "check_in_today", label: "Check-in today" },
  { id: "check_out_today", label: "Check-out today" },
];

const PAYMENT_OPTIONS: { value: BookingPaymentStatus | ""; label: string }[] =
  [
    { value: "", label: "All payments" },
    { value: "paid", label: "Paid" },
    { value: "deposit", label: "Deposit paid" },
    { value: "pending", label: "Pending" },
    { value: "void", label: "Void" },
  ];

const SOURCE_OPTIONS: { value: BookingSource | ""; label: string }[] = [
  { value: "", label: "All sources" },
  { value: "direct", label: "Direct" },
  { value: "online", label: "Online" },
  { value: "phone", label: "Phone" },
];

const SORT_OPTIONS: { value: BookingsToolbarFilters["sort"]; label: string }[] =
  [
    { value: "check_in", label: "Check-in date" },
    { value: "guest", label: "Guest name" },
    { value: "total", label: "Total amount" },
    { value: "status", label: "Status" },
  ];

type Props = {
  filters: BookingsToolbarFilters;
  viewMode: BookingViewMode;
  rooms: Room[];
  refreshing: boolean;
  onFiltersChange: (filters: BookingsToolbarFilters) => void;
  onViewModeChange: (value: BookingViewMode) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
};

export function BookingsToolbar({
  filters,
  viewMode,
  rooms,
  refreshing,
  onFiltersChange,
  onViewModeChange,
  onCreateClick,
  onRefresh,
}: Props) {
  function patch(partial: Partial<BookingsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === filters.status)
      ?.label ?? "All statuses";

  const activePayment =
    PAYMENT_OPTIONS.find((option) => option.value === filters.payment)?.label ??
    "All payments";

  const activeSource =
    SOURCE_OPTIONS.find((option) => option.value === filters.source)?.label ??
    "All sources";

  const activeRoom =
    rooms.find((room) => room.id === filters.roomId)?.room_type ??
    "All rooms";

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ??
    "Sort";

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search by guest, email, or phone"
          aria-label="Search reservations"
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

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Payment filter"
            >
              <Filter size={15} aria-hidden />
              {activePayment}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAYMENT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ payment: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Source filter"
            >
              <Filter size={15} aria-hidden />
              {activeSource}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SOURCE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ source: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="date"
            value={filters.dateFilter}
            onChange={(event) => patch({ dateFilter: event.target.value })}
            aria-label="Filter by stay date"
            className="h-[var(--ds-input-height)] w-[148px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Room filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeRoom}</span>
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
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Sort reservations"
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
            aria-label="Refresh reservations"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-label="Export reservations"
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
            New reservation
          </Button>
        </>
      }
      filters={
        <>
          {CHIP_FILTERS.map((chip) => (
            <FilterChip
              key={chip.id}
              active={filters.chipFilter === chip.id}
              onClick={() => patch({ chipFilter: chip.id })}
            >
              {chip.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
