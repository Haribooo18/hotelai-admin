"use client";

import { Badge } from "@/components/ui/display/Badge";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n, type TranslationPath } from "@/lib/i18n";

import {
  buildChannelStatuses,
  computeSettingsOpsKpis,
  type SettingsOperationsSnapshot,
} from "./settings-ops-metrics";
import { SettingsDetailRow, type SettingsNavSection } from "./settings-ui";

import type {
  AIHealthStatus,
  HotelAISettings,
} from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import {
  formatPlanLabel,
  formatSubscriptionStatusLabel,
} from "@/lib/billing/plans";

type Props = {
  section: SettingsNavSection;
  settings: HotelAISettings;
  health: AIHealthStatus;
  snapshot: SettingsOperationsSnapshot;
  subscription: HotelSubscription | null;
  configured: boolean;
};

const SECTION_LABEL_KEYS: Record<SettingsNavSection, TranslationPath> = {
  ai: "settings.navAi",
  channels: "settings.navChannels",
  billing: "settings.navBilling",
  team: "settings.navTeam",
  security: "settings.navSecurity",
  integrations: "settings.navIntegrations",
  advanced: "settings.navAdvanced",
};

export function SettingsInspector({
  section,
  settings,
  health,
  snapshot,
  subscription,
  configured,
}: Props) {
  const { locale, t } = useI18n();
  const kpis = computeSettingsOpsKpis(settings, health, locale);
  const channels = buildChannelStatuses(settings, health, locale);
  const connectedChannels = channels.filter((channel) => channel.connected).length;
  const warnings = snapshot.diagnostics.filter((item) => !item.ok);

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <Section
        title={t("settings.inspectorTitle")}
        subtitle={t(SECTION_LABEL_KEYS[section])}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={configured ? "success" : "warning"}>
          {configured
            ? t("settings.inspectorApiConfigured")
            : t("settings.inspectorApiMissing")}
        </Badge>
        <Badge variant={health.enabled ? "success" : "outline"}>
          {health.enabled
            ? t("settings.inspectorAiEnabled")
            : t("settings.inspectorAiDisabled")}
        </Badge>
      </div>

      <dl className="mt-4 grid gap-2">
        <SettingsDetailRow
          label={t("settings.inspectorAiStatus")}
          value={formatPercent(kpis.aiStatusPercent)}
        />
        <SettingsDetailRow
          label={t("settings.inspectorConnectedChannels")}
          value={String(connectedChannels)}
        />
        <SettingsDetailRow
          label={t("settings.inspectorRequests24h")}
          value={String(health.recent_requests)}
        />
        <SettingsDetailRow
          label={t("settings.inspectorEnvironment")}
          value={snapshot.environment}
        />
      </dl>

      {section === "ai" ? (
        <div className="mt-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
          <p className="ds-overline">{t("settings.inspectorTokenUsage24h")}</p>
          <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
            <Metric
              value={health.total_cost_usd_24h}
              formatter={(value) => `$${value.toFixed(4)}`}
            />
          </p>
          <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
            {t("settings.inspectorModel")}: {health.model}
          </p>
        </div>
      ) : null}

      {section === "billing" ? (
        <dl className="mt-4 grid gap-2">
          <SettingsDetailRow
            label={t("settings.inspectorPlan")}
            value={
              subscription
                ? formatPlanLabel(subscription.plan)
                : t("settings.inspectorNotSelected")
            }
          />
          <SettingsDetailRow
            label={t("settings.inspectorStatus")}
            value={formatSubscriptionStatusLabel(subscription?.status ?? "none")}
          />
        </dl>
      ) : null}

      {section === "channels" ? (
        <ul className="mt-4 space-y-2" role="list">
          {channels.slice(0, 4).map((channel) => (
            <li
              key={channel.id}
              role="listitem"
              className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px]"
            >
              <span className="text-[var(--shell-text)]">{channel.label}</span>
              <Badge variant={channel.connected ? "success" : "outline"}>
                {channel.connected ? t("common.connected") : t("common.pending")}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-4">
          <p className="ds-overline">{t("settings.inspectorWarnings")}</p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-amber-400">
            {warnings.map((item) => (
              <li key={item.label}>
                {item.label}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-[12px] text-[var(--shell-muted)]">
          {t("settings.inspectorAllChecksPassing")}
        </p>
      )}
    </Panel>
  );
}
