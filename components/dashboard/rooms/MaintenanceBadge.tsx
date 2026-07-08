"use client";

import { Wrench } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  active?: boolean;
  className?: string;
};

export function MaintenanceBadge({ active = false, className }: Props) {
  const { t } = useI18n();

  if (!active) return null;

  return (
    <Badge variant="destructive" className={cn(statusBadgeClass, "gap-1", className)}>
      <Wrench size={10} aria-hidden />
      {t("rooms.drawerMaintenance")}
    </Badge>
  );
}
