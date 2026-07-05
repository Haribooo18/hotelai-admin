"use client";

import { Settings } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { Metric } from "@/components/ui/display/Metric";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { formatPercent } from "@/lib/dashboard/format";

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

const SECTION_LABELS: Record<SettingsNavSection, string> = {
  general: "Appearance",
  ai: "AI",
  channels: "Channels",
  knowledge: "Knowledge",
  billing: "Billing",
  team: "Team",
  security: "Security",
  integrations: "Integrations",
  advanced: "Advanced",
};

export function SettingsInspector({
  section,
  settings,
  health,
  snapshot,
  subscription,
  configured,
}: Props) {
  const kpis = computeSettingsOpsKpis(settings, health);
  const channels = buildChannelStatuses(settings, health);
  const connectedChannels = channels.filter((channel) => channel.connected).length;
  const warnings = snapshot.diagnostics.filter((item) => !item.ok);

  return (
    <Panel variant="glass" className="h-full p-[var(--ds-surface-padding)]">
      <Section
        title="Inspector"
        subtitle={SECTION_LABELS[section]}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={configured ? "success" : "warning"}>
          {configured ? "API configured" : "API missing"}
        </Badge>
        <Badge variant={health.enabled ? "success" : "outline"}>
          {health.enabled ? "AI enabled" : "AI disabled"}
        </Badge>
      </div>

      <dl className="mt-4 grid gap-2">
        <SettingsDetailRow
          label="AI status"
          value={formatPercent(kpis.aiStatusPercent)}
        />
        <SettingsDetailRow
          label="Connected channels"
          value={String(connectedChannels)}
        />
        <SettingsDetailRow
          label="Requests (24h)"
          value={String(health.recent_requests)}
        />
        <SettingsDetailRow
          label="Environment"
          value={snapshot.environment}
        />
      </dl>

      {section === "ai" ? (
        <div className="mt-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
            Token usage (24h)
          </p>
          <p className="mt-2 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] text-[var(--shell-text)]">
            <Metric
              value={health.total_cost_usd_24h}
              formatter={(value) => `$${value.toFixed(4)}`}
            />
          </p>
          <p className="mt-1 text-[12px] text-[var(--shell-muted)]">
            Model: {health.model}
          </p>
        </div>
      ) : null}

      {section === "billing" ? (
        <dl className="mt-4 grid gap-2">
          <SettingsDetailRow
            label="Plan"
            value={
              subscription ? formatPlanLabel(subscription.plan) : "Not selected"
            }
          />
          <SettingsDetailRow
            label="Status"
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
                {channel.connected ? "Connected" : "Pending"}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
            Warnings
          </p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-amber-400">
            {warnings.map((item) => (
              <li key={item.label}>{item.label}: {item.value}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="No active warnings"
            description="System checks are passing for the current configuration."
            icon={<Settings size={16} />}
          />
        </div>
      )}
    </Panel>
  );
}
