"use client";

import { useI18n } from "@/lib/i18n";

import type { KnowledgeArticleStatus } from "@/types/knowledge-article";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  status: KnowledgeArticleStatus;
  className?: string;
};

const STATUS_VARIANT: Record<
  KnowledgeArticleStatus,
  "outline" | "success" | "warning"
> = {
  draft: "outline",
  published: "success",
  archived: "warning",
};

export function KnowledgeStatusBadge({ status, className }: Props) {
  const { t } = useI18n();

  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={cn(statusBadgeClass, className)}
    >
      {t(`statuses.knowledge.${status}`)}
    </Badge>
  );
}
