"use client";

import { useMemo } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
  toolbarControlClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";

export type ReceptionAiToolbarFilters = {
  search: string;
  status: "" | "enabled" | "disabled" | "needs_setup";
  date: string;
};

type Props = {
  filters: ReceptionAiToolbarFilters;
  onFiltersChange: (filters: ReceptionAiToolbarFilters) => void;
};

export function ReceptionAiToolbar({ filters, onFiltersChange }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  const statusOptions = useMemo(
    () =>
      [
        { value: "", label: t("toolbar.allStatuses") },
        { value: "enabled", label: t("settings.inspectorAiEnabled") },
        { value: "disabled", label: t("settings.inspectorAiDisabled") },
        { value: "needs_setup", label: t("common.needsSetup") },
      ] as const,
    [t]
  );

  const chipFilters = useMemo(
    () =>
      [
        { id: "" as const, label: t("common.all") },
        { id: "enabled" as const, label: t("settings.inspectorAiEnabled") },
        { id: "disabled" as const, label: t("settings.inspectorAiDisabled") },
        { id: "needs_setup" as const, label: t("common.needsSetup") },
      ],
    [t]
  );

  function patch(partial: Partial<ReceptionAiToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeStatus =
    statusOptions.find((option) => option.value === filters.status)?.label ??
    t("toolbar.allStatuses");

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

          <ToolbarDateInput
            value={filters.date}
            onChange={(event) => patch({ date: event.target.value })}
            aria-label={t("a11y.selectDate")}
          />
        </>
      }
      actions={
        <ToolbarSecondaryButton
          type="button"
          loading={refreshing}
          onClick={() => startRefresh(() => router.refresh())}
          aria-label={t("common.refresh")}
        >
          <RefreshCw size={toolbarFilterIconSize} aria-hidden />
          {t("common.refresh")}
        </ToolbarSecondaryButton>
      }
      chips={
        <>
          {chipFilters.map((chip) => (
            <FilterChip
              key={chip.id || "all"}
              active={filters.status === chip.id}
              onClick={() => patch({ status: chip.id })}
            >
              {chip.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
