"use client";

import { WorkspacePageSkeleton } from "@/components/dashboard/shared/skeleton";
import { useI18n } from "@/lib/i18n";

export function KnowledgeRouteLoading() {
  const { t } = useI18n();

  return (
    <WorkspacePageSkeleton label={t("knowledge.loading")} variant="knowledge" />
  );
}
