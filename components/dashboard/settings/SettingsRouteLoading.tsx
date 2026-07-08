"use client";

import { Skeleton } from "@/components/ui/display/Skeleton";
import { Stack } from "@/components/ui/primitives/Stack";
import { useI18n } from "@/lib/i18n";

export function SettingsRouteLoading() {
  const { t } = useI18n();

  return (
    <Stack gap="md" aria-busy="true" aria-label={t("settings.loadingSettings")}>
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-[var(--ds-radius)]" />
        <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
      </div>
    </Stack>
  );
}
