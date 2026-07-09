"use client";

import { useMemo, useState } from "react";

import type { AIHealthStatus, AIObservabilityLog, HotelAISettings } from "@/types/ai-settings";

import { buildReceptionAiRecommendations } from "@/components/dashboard/shared/ai-recommendation-builders";
import { WorkspaceAiRecommendations } from "@/components/dashboard/shared/WorkspaceAiRecommendations";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { WorkspacePageHeader } from "@/components/dashboard/shared/WorkspacePageHeader";
import {
  buildReceptionAiWorkspaceInsight,
  formatWorkspaceInsight,
} from "@/components/dashboard/shared/workspace-insights";
import { SettingsExecutiveKpis } from "@/components/dashboard/settings/SettingsExecutiveKpis";
import { computeSettingsOpsKpis } from "@/components/dashboard/settings/settings-ops-metrics";
import { useI18n } from "@/lib/i18n";

import { ReceptionAIWorkspace } from "./ReceptionAIWorkspace";
import {
  ReceptionAiToolbar,
  type ReceptionAiToolbarFilters,
} from "./ReceptionAiToolbar";

type Props = {
  settings: HotelAISettings;
  logs: AIObservabilityLog[];
  configured: boolean;
};

const DEFAULT_FILTERS: ReceptionAiToolbarFilters = {
  search: "",
  status: "",
  date: "",
};

function buildReceptionHealth(
  settings: HotelAISettings,
  logs: AIObservabilityLog[],
  configured: boolean
): AIHealthStatus {
  return {
    configured,
    enabled: settings.enabled,
    model: settings.model,
    provider: "openai",
    recent_errors: logs.filter((log) => log.level === "error").length,
    recent_requests: logs.length,
    avg_duration_ms: null,
    total_cost_usd_24h: 0,
  };
}

function matchesToolbarFilters(
  log: AIObservabilityLog,
  filters: ReceptionAiToolbarFilters,
  configured: boolean,
  enabled: boolean
): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${log.event} ${log.level} ${log.conversation_id ?? ""}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (filters.date) {
    const logDate = log.created_at.slice(0, 10);
    if (logDate !== filters.date) return false;
  }

  switch (filters.status) {
    case "enabled":
      return configured && enabled;
    case "disabled":
      return configured && !enabled;
    case "needs_setup":
      return !configured;
    default:
      return true;
  }
}

export function ReceptionAIPage({ settings, logs, configured }: Props) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<ReceptionAiToolbarFilters>(DEFAULT_FILTERS);

  const health = useMemo(
    () => buildReceptionHealth(settings, logs, configured),
    [settings, logs, configured]
  );

  const kpis = useMemo(
    () => computeSettingsOpsKpis(settings, health),
    [settings, health]
  );

  const headerInsight = useMemo(() => {
    const insight = buildReceptionAiWorkspaceInsight(settings, health, configured);
    return formatWorkspaceInsight(insight, t);
  }, [settings, health, configured, t]);

  const aiRecommendations = useMemo(
    () => buildReceptionAiRecommendations(settings, health, configured),
    [settings, health, configured]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      matchesToolbarFilters(log, filters, configured, settings.enabled)
    );
  }, [logs, filters, configured, settings.enabled]);

  return (
    <WorkspacePageLayout
      header={
        <WorkspacePageHeader
          title={t("pages.receptionAi.title")}
          subtitle={t("pages.receptionAi.subtitle")}
          contextSummary={headerInsight.contextSummary}
          aiHint={headerInsight.aiHint}
        />
      }
      kpis={<SettingsExecutiveKpis kpis={kpis} />}
      recommendations={
        <WorkspaceAiRecommendations recommendations={aiRecommendations} />
      }
      toolbar={
        <ReceptionAiToolbar filters={filters} onFiltersChange={setFilters} />
      }
    >
      <ReceptionAIWorkspace
        settings={settings}
        logs={filteredLogs}
        configured={configured}
      />
    </WorkspacePageLayout>
  );
}
