"use client";

import { useMemo, useState } from "react";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { Stack } from "@/components/ui/primitives/Stack";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useI18n } from "@/lib/i18n";

import { SettingsExecutiveKpis } from "./SettingsExecutiveKpis";
import { SettingsInspector } from "./SettingsInspector";
import { SettingsOperations } from "./SettingsOperations";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsWorkspace } from "./SettingsWorkspace";
import {
  buildSettingsOperationsSnapshot,
  computeSettingsOpsKpis,
  mapInitialTab,
} from "./settings-ops-metrics";
import type { SettingsNavSection } from "./settings-ui";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  initialTab?: string;
};

export function SettingsTabs({
  settings,
  health,
  logs,
  configured,
  subscription,
  stripeConfigured,
  initialTab,
}: Props) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<SettingsNavSection>(
    mapInitialTab(initialTab)
  );

  const kpis = useMemo(
    () => computeSettingsOpsKpis(settings, health),
    [settings, health]
  );

  const operations = useMemo(
    () => buildSettingsOperationsSnapshot(health, logs, configured),
    [health, logs, configured]
  );

  return (
    <Stack gap="md" className="ds-page-enter">
      <PageHeader
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <SettingsExecutiveKpis kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SettingsSidebar active={activeSection} onChange={setActiveSection} />

          <SettingsWorkspace
            section={activeSection}
            settings={settings}
            health={health}
            logs={logs}
            configured={configured}
            subscription={subscription}
            stripeConfigured={stripeConfigured}
          />
        </div>

        <div className="hidden xl:block">
          <SettingsInspector
            section={activeSection}
            settings={settings}
            health={health}
            snapshot={operations}
            subscription={subscription}
            configured={configured}
          />
        </div>
      </div>

      <SettingsOperations snapshot={operations} />
    </Stack>
  );
}
