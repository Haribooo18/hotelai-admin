"use client";

import { Download, Filter, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { SearchInput } from "@/components/ui/core/SearchInput";
import { FilterBar, FilterChip } from "@/components/ui/data/FilterBar";
import { cn } from "@/lib/utils";

export type DashboardToolbarFilter = "all" | "reservations" | "guests" | "operations";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: DashboardToolbarFilter;
  onFilterChange: (value: DashboardToolbarFilter) => void;
  dateValue: string;
};

const FILTER_OPTIONS: Array<{ id: DashboardToolbarFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "reservations", label: "Reservations" },
  { id: "guests", label: "Guests" },
  { id: "operations", label: "Operations" },
];

export function DashboardToolbar({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  dateValue,
}: Props) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search dashboard activity..."
          aria-label="Search dashboard"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      }
      trailing={
        <>
          <Input
            type="date"
            value={dateValue}
            readOnly
            aria-label="Dashboard date"
            className="h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)] sm:w-[156px]"
          />

          <Button
            variant="outline"
            size="sm"
            loading={refreshing}
            onClick={() => startRefresh(() => router.refresh())}
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            aria-label="Export dashboard"
            title="Export coming soon"
          >
            <Download size={15} aria-hidden />
            Export
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hidden lg:inline-flex",
              activeFilter !== "all" && "text-[var(--shell-accent)]"
            )}
            aria-label="Filters"
            aria-pressed={activeFilter !== "all"}
          >
            <Filter size={15} aria-hidden />
            Filters
          </Button>
        </>
      }
      filters={
        <>
          {FILTER_OPTIONS.map((option) => (
            <FilterChip
              key={option.id}
              active={activeFilter === option.id}
              onClick={() => onFilterChange(option.id)}
            >
              {option.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
