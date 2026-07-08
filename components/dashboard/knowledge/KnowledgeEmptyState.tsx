"use client";

import { FileText } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { useI18n } from "@/lib/i18n";

export function KnowledgeEmptyState() {
  const { t } = useI18n();

  return (
    <EmptyState
      icon={<FileText size={18} />}
      title={t("knowledge.emptyTitle")}
      description={t("knowledge.emptyDesc")}
    />
  );
}
