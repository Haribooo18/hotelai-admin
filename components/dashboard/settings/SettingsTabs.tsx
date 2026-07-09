"use client";

import { useMemo, useState } from "react";

import type {
  AIHealthStatus,
  AIObservabilityLog,
  HotelAISettings,
} from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { formatPlanLabel } from "@/lib/billing/plans";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { WorkspacePageHeader } from "@/components/dashboard/shared/WorkspacePageHeader";
import {
  buildSettingsWorkspaceInsight,
  formatWorkspaceInsight,
} from "@/components/dashboard/shared/workspace-insights";
import { useI18n } from "@/lib/i18n";

import { SettingsExecutiveKpis } from "./SettingsExecutiveKpis";
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
  const { t, locale } = useI18n();
  const [activeSection, setActiveSection] = useState<SettingsNavSection>(
    mapInitialTab(initialTab)
  );

  const kpis = useMemo(
    () => computeSettingsOpsKpis(settings, health, locale),
    [settings, health, locale]
  );

  const subscriptionLabel = subscription?.plan
    ? formatPlanLabel(subscription.plan)
    : t("profile.defaultPlan");

  const headerInsight = useMemo(() => {
    const insight = buildSettingsWorkspaceInsight(kpis, subscriptionLabel);
    return formatWorkspaceInsight(insight, t);
  }, [kpis, subscriptionLabel, t]);

  const operations = useMemo(
    () =>
      buildSettingsOperationsSnapshot(health, logs, configured, locale),
    [health, logs, configured, locale]
  );

  return (
    <WorkspacePageLayout
      header={
        <WorkspacePageHeader
          title={t("pages.settings.title")}
          subtitle={t("pages.settings.subtitle")}
          contextSummary={headerInsight.contextSummary}
          aiHint={headerInsight.aiHint}
        />
      }
      kpis={<SettingsExecutiveKpis kpis={kpis} />}
      secondary={<SettingsOperations snapshot={operations} />}
    >
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SettingsSidebar active={activeSection} onChange={setActiveSection} />

        <SettingsWorkspace
          section={activeSection}
          settings={settings}
          health={health}
          configured={configured}
          subscription={subscription}
          stripeConfigured={stripeConfigured}
        />
      </div>
    </WorkspacePageLayout>
  );
}
