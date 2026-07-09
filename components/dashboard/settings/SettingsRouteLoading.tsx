"use client";

import { WorkspacePageSkeleton } from "@/components/dashboard/shared/skeleton";
import { useI18n } from "@/lib/i18n";

export function SettingsRouteLoading() {
  const { t } = useI18n();

  return (
    <WorkspacePageSkeleton label={t("settings.loadingSettings")} variant="settings" />
  );
}
