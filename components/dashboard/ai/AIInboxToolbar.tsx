"use client";

import {
  Filter,
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
  CONVERSATION_CHANNEL_OPTIONS,
  CONVERSATION_PRIORITY_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
} from "@/lib/ai/metadata";
import {
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";

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
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={17}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Search conversations"
            aria-label="Search conversations"
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
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
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
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
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
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
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
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
            onChange={(e) => patch({ date: e.target.value })}
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
            New conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
