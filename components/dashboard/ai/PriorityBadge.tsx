"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import { Badge } from "@/components/ui/display/Badge";
import { getConversationPriorityMeta } from "@/lib/ai/metadata";

const PRIORITY_KEYS: Record<string, TranslationPath> = {
  low: "ai.priorities.low",
  normal: "ai.priorities.normal",
  high: "ai.priorities.high",
  urgent: "ai.priorities.urgent",
};

type Props = {
  priority: string;
  className?: string;
};

export function PriorityBadge({ priority, className }: Props) {
  const { t } = useI18n();
  const meta = getConversationPriorityMeta(priority);
  const key = PRIORITY_KEYS[priority];

  if (priority === "normal") return null;

  return (
    <Badge
      variant={priority === "urgent" ? "destructive" : "warning"}
      className={cn("uppercase", meta?.badgeClassName, className)}
    >
      {key ? t(key) : meta?.label ?? priority}
    </Badge>
  );
}
