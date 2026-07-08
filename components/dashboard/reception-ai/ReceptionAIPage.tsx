"use client";

import type { AIObservabilityLog, HotelAISettings } from "@/types/ai-settings";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { useI18n } from "@/lib/i18n";

import { ReceptionAIWorkspace } from "./ReceptionAIWorkspace";

type Props = {
  settings: HotelAISettings;
  logs: AIObservabilityLog[];
  configured: boolean;
};

export function ReceptionAIPage({ settings, logs, configured }: Props) {
  const { t } = useI18n();

  return (
    <WorkspacePageLayout
      header={
        <PageHeader
          title={t("pages.receptionAi.title")}
          subtitle={t("pages.receptionAi.subtitle")}
        />
      }
    >
      <ReceptionAIWorkspace
        settings={settings}
        logs={logs}
        configured={configured}
      />
    </WorkspacePageLayout>
  );
}
