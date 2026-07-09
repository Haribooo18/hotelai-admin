"use client";

import { usePathname } from "next/navigation";

import { sidebarSectionLabelClass } from "@/lib/dashboard/design-system";
import { isShellNavActive } from "@/lib/dashboard/shell-nav";
import type { ShellNavGroup } from "@/lib/dashboard/shell-nav";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { SidebarItem } from "./SidebarItem";

type Props = {
  group: ShellNavGroup;
  onNavigate?: () => void;
  isFirst?: boolean;
};

export function SidebarGroup({ group, onNavigate, isFirst = false }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div className="space-y-0.5">
      {group.labelKey ? (
        <p
          className={cn(
            sidebarSectionLabelClass,
            isFirst && "pt-0"
          )}
        >
          {t(group.labelKey)}
        </p>
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
