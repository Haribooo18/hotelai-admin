"use client";

import { useI18n } from "@/lib/i18n";
import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";

import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "../shell/ThemeSelector";
import { useShellTheme } from "../shell/useShellTheme";

export function AppearancePanel() {
  const { t } = useI18n();
  const [theme, setTheme] = useShellTheme();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <DashboardPanelHeader
          title={t("settings.theme")}
          subtitle={t("settings.appearanceSubtitle")}
          className="mb-4"
        />
        <ThemeSelector value={theme} onChange={setTheme} />
      </DashboardGlassPanel>

      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <DashboardPanelHeader
          title={t("settings.language")}
          subtitle={t("settings.languageHint")}
          className="mb-4"
        />
        <LanguageSelector />
      </DashboardGlassPanel>
    </div>
  );
}
