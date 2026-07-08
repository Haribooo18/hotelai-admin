"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { SearchInput } from "@/components/ui/core/SearchInput";
import { ToolbarSecondaryButton } from "@/components/ui/data/FilterBar";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import { toolbarFilterIconSize } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function DashboardToolbar({ search, onSearchChange }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  return (
    <WorkspaceToolbar
      wideSearch
      search={
        <SearchInput
          placeholder={t("dashboard.searchPlaceholder")}
          aria-label={t("dashboard.searchAria")}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      }
      actions={
        <ToolbarSecondaryButton
          type="button"
          loading={refreshing}
          onClick={() => startRefresh(() => router.refresh())}
          aria-label={t("dashboard.refreshAria")}
        >
          <RefreshCw size={toolbarFilterIconSize} aria-hidden />
          {t("common.refresh")}
        </ToolbarSecondaryButton>
      }
    />
  );
}
