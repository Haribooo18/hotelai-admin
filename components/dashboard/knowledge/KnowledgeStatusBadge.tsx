import { KNOWLEDGE_STATUS_LABELS } from "@/lib/knowledge";

import type { KnowledgeArticleStatus } from "@/types/knowledge-article";

import { Badge } from "@/components/ui/display/Badge";
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
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={cn("text-[10px] uppercase tracking-wide", className)}
    >
      {KNOWLEDGE_STATUS_LABELS[status]}
    </Badge>
  );
}
