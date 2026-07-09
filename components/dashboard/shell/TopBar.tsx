"use client";

import { ToolbarCreateDropdown } from "@/components/dashboard/shell/ToolbarCreateDropdown";
import { ShellWordmark } from "@/components/dashboard/shell/ShellWordmark";
import { ToolbarDateInput } from "@/components/ui/core/ToolbarDateInput";
import { useShellTheme } from "@/components/dashboard/shell/useShellTheme";
import { ToolbarLanguageDropdown } from "@/components/dashboard/shell/ToolbarLanguageDropdown";
import { ToolbarThemeDropdown } from "@/components/dashboard/shell/ToolbarThemeDropdown";
import { useI18n } from "@/lib/i18n";
import { SIDEBAR_WIDTH_PX } from "@/lib/i18n/shell-pages";
import {
  shellHeaderDividerClass,
  shellHeaderWorkspaceInsetClass,
  topBarActionsClass,
  topBarFiltersClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

function TopBarDivider() {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn(shellHeaderDividerClass, "mx-1")}
    />
  );
}

export function TopBar() {
  const { t } = useI18n();
  const [theme, setTheme] = useShellTheme();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <header className="ds-topbar sticky top-0 z-30 flex h-[var(--shell-header-height)] w-full shrink-0 items-center gap-0 pl-14 pr-4 lg:pl-0 lg:pr-5">
      <div
        className="hidden shrink-0 items-center pl-4 lg:flex"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        <ShellWordmark />
      </div>

      <TopBarDivider />

      <div
        className={cn(
          "flex shrink-0 items-center",
          topBarFiltersClass,
          shellHeaderWorkspaceInsetClass
        )}
      >
        <ToolbarLanguageDropdown />
        <ToolbarThemeDropdown value={theme} onChange={setTheme} />
      </div>

      <TopBarDivider />

      <ToolbarDateInput
        defaultValue={today}
        aria-label={t("a11y.selectDate")}
        className="hidden !w-[116px] !max-w-[116px] !px-3.5 shrink-0 sm:block"
      />

      <div aria-hidden className="min-w-0 flex-1" />

      <div className={cn("flex shrink-0 items-center", topBarActionsClass)}>
        <ToolbarCreateDropdown />
      </div>
    </header>
  );
}
