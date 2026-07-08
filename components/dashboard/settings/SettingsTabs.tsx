"use client";

import { useState } from "react";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { useI18n } from "@/lib/i18n";

import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsWorkspace } from "./SettingsWorkspace";
import { mapInitialTab } from "./settings-ops-metrics";
import type { SettingsNavSection } from "./settings-ui";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  initialTab?: string;
};

export function SettingsTabs({
  settings,
  health,
  configured,
  subscription,
  stripeConfigured,
  initialTab,
}: Props) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<SettingsNavSection>(
    mapInitialTab(initialTab)
  );

  return (
    <WorkspacePageLayout
      header={
        <PageHeader
          title={t("pages.settings.title")}
          subtitle={t("pages.settings.subtitle")}
        />
      }
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
