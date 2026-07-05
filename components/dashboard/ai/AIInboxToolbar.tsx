"use client";

import {
  Download,
  Filter,
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
import { FilterBar } from "@/components/ui/data/FilterBar";
import {
  CONVERSATION_CHANNEL_OPTIONS,
  CONVERSATION_PRIORITY_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
} from "@/lib/ai/metadata";
import { toolbarControlClass } from "@/lib/dashboard/design-system";

import type { AIInboxFilters } from "./ai-ops-metrics";

type Props = {
  filters: AIInboxFilters;
  refreshing: boolean;
  onFiltersChange: (filters: AIInboxFilters) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
};

const ASSIGNED_OPTIONS = [
  { value: "", label: "All assignments" },
  { value: "me", label: "Assigned to me" },
  { value: "unassigned", label: "Unassigned" },
] as const;

export function AIInboxToolbar({
  filters,
  refreshing,
  onFiltersChange,
  onCreateClick,
  onRefresh,
}: Props) {
  function patch(partial: Partial<AIInboxFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    CONVERSATION_STATUS_OPTIONS.find((option) => option.value === filters.status)
      ?.label ?? "All statuses";
  const activeChannel =
    CONVERSATION_CHANNEL_OPTIONS.find((option) => option.value === filters.channel)
      ?.label ?? "All channels";
  const activePriority =
    CONVERSATION_PRIORITY_OPTIONS.find(
      (option) => option.value === filters.priority
    )?.label ?? "All priorities";
  const activeAssigned =
    ASSIGNED_OPTIONS.find((option) => option.value === filters.assigned)?.label ??
    "All assignments";

  return (
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search conversations"
          aria-label="Search conversations"
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      trailing={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass} aria-label="Channel filter">
              <Filter size={15} aria-hidden />
              {activeChannel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ channel: "" })}>
                All channels
              </DropdownMenuItem>
              {CONVERSATION_CHANNEL_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ channel: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass} aria-label="Status filter">
              <Filter size={15} aria-hidden />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ status: "" })}>
                All statuses
              </DropdownMenuItem>
              {CONVERSATION_STATUS_OPTIONS.map((option) => (
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
            <DropdownMenuTrigger className={toolbarControlClass} aria-label="Assignment filter">
              <Filter size={15} aria-hidden />
              {activeAssigned}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ASSIGNED_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ assigned: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass} aria-label="Priority filter">
              <Filter size={15} aria-hidden />
              {activePriority}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ priority: "" })}>
                All priorities
              </DropdownMenuItem>
              {CONVERSATION_PRIORITY_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ priority: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="date"
            value={filters.date}
            onChange={(event) => patch({ date: event.target.value })}
            aria-label="Filter by date"
            className="h-[var(--ds-input-height)] w-[148px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label="Refresh inbox"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-label="Bulk actions"
            title="Bulk actions coming soon"
          >
            <Download size={15} aria-hidden />
            Bulk
          </Button>

          <Button
            type="button"
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
          >
            <Plus size={15} aria-hidden />
            New conversation
          </Button>
        </>
      }
    />
  );
}
