"use client";

import { FileText } from "lucide-react";

import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { useI18n } from "@/lib/i18n";

export function KnowledgeEmptyState() {
  const { t } = useI18n();

  return (
    <WorkspaceEmptyState
      icon={<FileText size={18} />}
      title={t("knowledge.emptyTitle")}
      description={t("knowledge.emptyDesc")}
      guidance={t("workspace.knowledge.emptyGuidance")}
    />
  );
}
