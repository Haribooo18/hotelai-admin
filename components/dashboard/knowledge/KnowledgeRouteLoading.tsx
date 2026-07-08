"use client";

import { Stack } from "@/components/ui/primitives/Stack";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { useI18n } from "@/lib/i18n";

export function KnowledgeRouteLoading() {
  const { t } = useI18n();

  return (
    <Stack gap="md" aria-busy="true" aria-label={t("knowledge.loading")}>
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-[var(--ds-radius)]" />
        ))}
      </div>
    </Stack>
  );
}
