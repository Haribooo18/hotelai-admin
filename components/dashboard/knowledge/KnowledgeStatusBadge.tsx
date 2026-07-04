import { KNOWLEDGE_STATUS_LABELS } from "@/lib/knowledge";

import type { KnowledgeArticleStatus } from "@/types/knowledge-article";

import { cn } from "@/lib/utils";

type Props = {
  status: KnowledgeArticleStatus;
  className?: string;
};

const STATUS_STYLES: Record<KnowledgeArticleStatus, string> = {
  draft: "bg-zinc-800 text-zinc-300",
  published: "bg-emerald-950 text-emerald-400",
  archived: "bg-amber-950 text-amber-400",
};

export function KnowledgeStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {KNOWLEDGE_STATUS_LABELS[status]}
    </span>
  );
}
