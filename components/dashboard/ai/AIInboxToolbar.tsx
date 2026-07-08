"use client";

import { useMemo } from "react";
import { Filter, RefreshCw } from "lucide-react";

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
import {
  CONVERSATION_CHANNEL_OPTIONS,
  CONVERSATION_PRIORITY_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
} from "@/lib/ai/metadata";
import {
  toolbarControlClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";

import type { AIInboxFilters } from "./ai-ops-metrics";

type Props = {
  filters: AIInboxFilters;
  refreshing: boolean;
  onFiltersChange: (filters: AIInboxFilters) => void;
  onRefresh: () => void;
};

export function AIInboxToolbar({
  filters,
  refreshing,
  onFiltersChange,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const assignedOptions = useMemo(
    () =>
      [
        { value: "", label: t("ai.allAssignments") },
        { value: "me", label: t("ai.assignedToMe") },
        { value: "unassigned", label: t("ai.unassigned") },
      ] as const,
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.allStatuses") },
      ...CONVERSATION_STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`ai.statuses.${option.value}`),
      })),
    ],
    [t]
  );

  const channelOptions = useMemo(
    () => [
      { value: "", label: t("ai.allChannels") },
      ...CONVERSATION_CHANNEL_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`ai.channels.${option.value}`),
      })),
    ],
    [t]
  );

  const priorityOptions = useMemo(
    () => [
      { value: "", label: t("ai.allPriorities") },
      ...CONVERSATION_PRIORITY_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`ai.priorities.${option.value}`),
      })),
    ],
    [t]
  );

  const chipFilters = useMemo(
    () => [
      { value: "", label: t("common.all") },
      { value: "new", label: t("ai.statuses.new") },
      { value: "assigned", label: t("ai.statuses.assigned") },
      { value: "resolved", label: t("ai.statuses.resolved") },
    ],
    [t]
  );

  function patch(partial: Partial<AIInboxFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    statusOptions.find((option) => option.value === filters.status)?.label ??
    t("toolbar.allStatuses");
  const activeChannel =
    channelOptions.find((option) => option.value === filters.channel)?.label ??
    t("ai.allChannels");
  const activePriority =
    priorityOptions.find((option) => option.value === filters.priority)?.label ??
    t("ai.allPriorities");
  const activeAssigned =
    assignedOptions.find((option) => option.value === filters.assigned)?.label ??
    t("ai.allAssignments");

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("ai.searchPlaceholder")}
          aria-label={t("ai.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      primaryFilters={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("ai.channelFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeChannel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {channelOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ channel: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("ai.statusFilter")}
            >
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

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("ai.assignmentFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeAssigned}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {assignedOptions.map((option) => (
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
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("ai.priorityFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activePriority}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {priorityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ priority: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarDateInput
            value={filters.date}
            onChange={(event) => patch({ date: event.target.value })}
            aria-label={t("ai.dateFilter")}
          />
        </>
      }
      actions={
        <>
          <ToolbarSecondaryButton
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label={t("ai.refreshAria")}
          >
            <RefreshCw size={toolbarFilterIconSize} aria-hidden />
            {t("common.refresh")}
          </ToolbarSecondaryButton>
        </>
      }
      chips={
        <>
          {chipFilters.map((chip) => (
            <FilterChip
              key={chip.value || "all"}
              active={filters.status === chip.value}
              onClick={() => patch({ status: chip.value })}
            >
              {chip.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
