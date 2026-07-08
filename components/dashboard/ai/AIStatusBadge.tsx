"use client";

import { getConversationStatusMeta } from "@/lib/ai/metadata";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

const STATUS_KEYS: Record<string, TranslationPath> = {
  new: "ai.statuses.new",
  assigned: "ai.statuses.assigned",
  ai_answering: "ai.statuses.ai_answering",
  waiting_guest: "ai.statuses.waiting_guest",
  resolved: "ai.statuses.resolved",
  archived: "ai.statuses.archived",
};

type Props = {
  status: string;
  className?: string;
};

export function AIStatusBadge({ status, className }: Props) {
  const { t } = useI18n();
  const meta = getConversationStatusMeta(status);
  const key = STATUS_KEYS[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        statusBadgeClass,
        meta?.badgeClassName ??
          "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
        className
      )}
    >
      {key ? t(key) : meta?.label ?? status}
    </Badge>
  );
}
