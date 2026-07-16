"use client";

import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/display/Badge";
import { sidebarSectionLabelClass } from "@/lib/dashboard/design-system";
import { isShellNavActive } from "@/lib/dashboard/shell-nav";
import type { ShellNavGroup } from "@/lib/dashboard/shell-nav";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useWorkspaceAiPresence } from "@/components/dashboard/shared/WorkspaceAiPresence";

import { SidebarItem } from "./SidebarItem";

type Props = {
  group: ShellNavGroup;
  onNavigate?: () => void;
  isFirst?: boolean;
};

export function SidebarGroup({ group, onNavigate, isFirst = false }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();
  const presence = useWorkspaceAiPresence();
  const isAiGroup = group.labelKey === "nav.groupAi";

  return (
    <div className="space-y-0.5">
      {group.labelKey ? (
        <div
          className={cn(
            "flex items-center justify-between gap-2 pr-1",
            isFirst && "pt-0"
          )}
        >
          <p className={cn(sidebarSectionLabelClass, isFirst && "pt-0")}>
            {t(group.labelKey)}
          </p>
          {isAiGroup && presence ? (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              {presence.recommendationCount > 0
                ? formatTranslation(t("ai.recommendations.sidebarCount"), {
                    count: String(presence.recommendationCount),
                  })
                : presence.status === "healthy"
                  ? t("ai.recommendations.sidebarHealthy")
                  : formatTranslation(t("ai.recommendations.sidebarPending"), {
                      count: String(presence.pendingCount),
                    })}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {group.items.map((item) => (
        <SidebarItem
          key={item.labelKey}
          href={item.href}
          label={t(item.labelKey)}
          icon={item.icon}
          active={isShellNavActive(pathname, item)}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
