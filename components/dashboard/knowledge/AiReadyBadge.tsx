"use client";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  ready: boolean;
  className?: string;
};

export function AiReadyBadge({ ready, className }: Props) {
  const { t } = useI18n();

  return (
    <Badge
      variant={ready ? "success" : "outline"}
      className={cn(statusBadgeClass, className)}
    >
      {ready ? t("knowledge.aiReady") : t("knowledge.aiPending")}
    </Badge>
  );
}
