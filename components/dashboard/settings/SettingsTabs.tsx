"use client";

import { useMemo, useState } from "react";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import {
  AdminPageStack,
  DashboardPageHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { SettingsExecutiveKpis } from "./SettingsExecutiveKpis";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsWorkspace } from "./SettingsWorkspace";
import {
  computeSettingsOpsKpis,
  mapInitialTab,
  type SettingsSection,
} from "./settings-ops-metrics";

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
  const [activeSection, setActiveSection] = useState<SettingsSection>(
    mapInitialTab(initialTab)
  );

  const kpis = useMemo(
    () => computeSettingsOpsKpis(settings, health),
    [settings, health]
  );

  return (
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <SettingsExecutiveKpis kpis={kpis} />

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
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
    </AdminPageStack>
  );
}
