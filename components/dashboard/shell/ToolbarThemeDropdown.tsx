"use client";

import { ChevronDown, Moon, Sun, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import type { ShellTheme } from "@/lib/dashboard/shell-theme";
import { cn } from "@/lib/utils";

type Props = {
  value: ShellTheme;
  onChange: (theme: ShellTheme) => void;
  className?: string;
};

const THEME_ICONS: Record<ShellTheme, LucideIcon> = {
  light: Sun,
  gray: Cloud,
  dark: Moon,
};

const THEMES: Array<{
  id: ShellTheme;
  labelKey: "settings.themeLight" | "settings.themeGray" | "settings.themeDark";
}> = [
  { id: "light", labelKey: "settings.themeLight" },
  { id: "gray", labelKey: "settings.themeGray" },
  { id: "dark", labelKey: "settings.themeDark" },
];

export function ToolbarThemeDropdown({ value, onChange, className }: Props) {
  const { t } = useI18n();
  const activeTheme = THEMES.find((theme) => theme.id === value) ?? THEMES[2];
  const ActiveIcon = THEME_ICONS[activeTheme.id];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(toolbarControlClass, "gap-1.5 px-2.5", className)}
        aria-label={t("a11y.theme")}
      >
        <ActiveIcon size={14} aria-hidden className="shrink-0 text-[var(--shell-muted)]" />
        <span>{t(activeTheme.labelKey)}</span>
        <ChevronDown size={14} aria-hidden className="text-[var(--shell-muted)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[132px]">
        {THEMES.map((theme) => {
          const Icon = THEME_ICONS[theme.id];

          return (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(value === theme.id && "bg-[var(--shell-nav-active-bg)]")}
          >
            <Icon size={14} aria-hidden className="text-[var(--shell-muted)]" />
            {t(theme.labelKey)}
          </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
