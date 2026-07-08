"use client";

import type { AIHealthStatus } from "@/types/ai-settings";

import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motionPresets } from "@/lib/design/motion";

type Props = {
  health: AIHealthStatus;
};

export function AIHealthPanel({ health }: Props) {
  const { t } = useI18n();

  const items = [
    {
      label: t("settings.aiHealthProvider"),
      value: health.configured ? health.provider : t("settings.aiHealthNotConfigured"),
      ok: health.configured,
    },
    {
      label: t("settings.aiHealthAiEnabled"),
      value: health.enabled ? t("common.yes") : t("common.no"),
      ok: health.enabled && health.configured,
    },
    { label: t("settings.aiHealthModel"), value: health.model, ok: true },
    {
      label: t("settings.aiHealthRequests24h"),
      value: String(health.recent_requests),
      ok: true,
      metric: true,
    },
    {
      label: t("settings.aiHealthErrors24h"),
      value: String(health.recent_errors),
      ok: health.recent_errors === 0,
    },
    {
      label: t("settings.aiHealthAvgLatency"),
      value:
        health.avg_duration_ms != null
          ? `${health.avg_duration_ms} ms`
          : "—",
      ok: (health.avg_duration_ms ?? 0) < 5000,
    },
    {
      label: t("settings.aiHealthCost24h"),
      value: `$${health.total_cost_usd_24h.toFixed(4)}`,
      ok: true,
    },
  ];

  return (
    <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
      <Section
        title={t("settings.aiHealthTitle")}
        subtitle={t("settings.aiHealthSubtitle")}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-3",
              motionPresets.transitionBase,
              motionPresets.hover.surfaceLift
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--shell-muted)]">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1.5 text-[15px] font-semibold",
                item.ok ? "text-[var(--shell-accent)]" : "text-amber-400"
              )}
            >
              {"metric" in item && item.metric ? (
                <Metric value={health.recent_requests} />
              ) : (
                item.value
              )}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
