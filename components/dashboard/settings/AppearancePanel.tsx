"use client";

import { useI18n } from "@/lib/i18n";

import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";

import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "../shell/ThemeSelector";
import { useShellTheme } from "../shell/useShellTheme";

export function AppearancePanel() {
  const { t } = useI18n();
  const [theme, setTheme] = useShellTheme();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
        <Section
          title={t("settings.theme")}
          subtitle={t("settings.appearanceSubtitle")}
        />
        <div className="mt-4">
          <ThemeSelector value={theme} onChange={setTheme} />
        </div>
      </Panel>

      <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
        <Section
          title={t("settings.language")}
          subtitle={t("settings.languageHint")}
        />
        <div className="mt-4">
          <LanguageSelector />
        </div>
      </Panel>
    </div>
  );
}
