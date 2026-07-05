"use client";

import { useI18n } from "@/lib/i18n";
import {
  DashboardSectionTitle,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "../shell/ThemeSelector";
import { useShellTheme } from "../shell/useShellTheme";

export function AppearancePanel() {
  const { t } = useI18n();
  const [theme, setTheme] = useShellTheme();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
        <DashboardSectionTitle
          title={t("settings.theme")}
          subtitle={t("settings.appearanceSubtitle")}
          className="mb-4"
        />
        <ThemeSelector value={theme} onChange={setTheme} />
      </DashboardSurface>

      <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
        <DashboardSectionTitle
          title={t("settings.language")}
          subtitle={t("settings.languageHint")}
          className="mb-4"
        />
        <LanguageSelector />
      </DashboardSurface>
    </div>
  );
}
