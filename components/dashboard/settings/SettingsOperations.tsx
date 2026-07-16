"use client";

import { AlertTriangle, CheckCircle2, History, HeartPulse } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motionPresets } from "@/lib/design/motion";

import type { SettingsOperationsSnapshot } from "./settings-ops-metrics";
import { SettingsDetailRow } from "./settings-ui";

type Props = {
  snapshot: SettingsOperationsSnapshot;
  loading?: boolean;
};

export function SettingsOperations({ snapshot, loading = false }: Props) {
  const { t } = useI18n();

  const warnings = snapshot.diagnostics.filter((item) => !item.ok);
  const recommendations = snapshot.diagnostics
    .filter((item) => !item.ok)
    .map((item) =>
      formatTranslation(t("settings.opsReviewItem"), {
        label: item.label.toLowerCase(),
        value: item.value,
      })
    );

  if (loading) {
    return (
      <Section title={t("settings.opsTitle")} subtitle={t("settings.opsSubtitle")}>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DataCard key={index} title={t("settings.opsLoading")}>
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={t("settings.opsTitle")} subtitle={t("settings.opsSubtitle")}>
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <DataCard
          interactive
          title={t("settings.opsRecentChanges")}
          subtitle={t("settings.opsRecentChangesSubtitle")}
        >
          {snapshot.recentActivity.length === 0 ? (
            <WorkspaceEmptyState
              title={t("settings.opsNoRecentChanges")}
              description={t("settings.opsNoRecentChangesDesc")}
              icon={<History size={16} />}
            />
          ) : (
            <ul className="space-y-2" role="list">
              {snapshot.recentActivity.map((log) => (
                <li
                  key={log.id}
                  role="listitem"
                  className={cn(
                    "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2",
                    motionPresets.transitionBase,
                    "hover:bg-[var(--shell-surface-raised)]"
                  )}
                >
                  <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
                    {log.event}
                  </p>
                  <p className="text-[11px] text-[var(--shell-muted)]">
                    [{log.level}] · {new Date(log.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("settings.opsWarnings")}
          subtitle={t("settings.opsWarningsSubtitle")}
        >
          {warnings.length === 0 ? (
            <WorkspaceEmptyState
              title={t("settings.opsNoWarnings")}
              description={t("settings.opsNoWarningsDesc")}
              icon={<AlertTriangle size={16} />}
            />
          ) : (
            <ul className="space-y-2" role="list">
              {warnings.map((item) => (
                <li
                  key={item.label}
                  role="listitem"
                  className="rounded-[var(--ds-radius-sm)] bg-amber-500/10 px-3 py-2 text-[12px] text-amber-300"
                >
                  <span className="font-medium">{item.label}</span>: {item.value}
                </li>
              ))}
            </ul>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("settings.opsRecommendations")}
          subtitle={t("settings.opsRecommendationsSubtitle")}
        >
          {recommendations.length === 0 ? (
            <WorkspaceEmptyState
              title={t("settings.opsNoRecommendations")}
              description={t("settings.opsNoRecommendationsDesc")}
              icon={<CheckCircle2 size={16} />}
            />
          ) : (
            <ul className="space-y-2" role="list">
              {recommendations.map((item) => (
                <li
                  key={item}
                  role="listitem"
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px] text-[var(--shell-text)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("settings.opsSystemHealth")}
          subtitle={t("settings.opsSystemHealthSubtitle")}
        >
          <dl className="grid gap-2">
            <SettingsDetailRow label={t("settings.opsVersion")} value={snapshot.version} />
            <SettingsDetailRow
              label={t("settings.opsEnvironment")}
              value={snapshot.environment}
            />
            <SettingsDetailRow
              label={t("settings.opsApiStatus")}
              value={snapshot.apiOnline ? t("settings.opsOnline") : t("settings.opsOffline")}
            />
          </dl>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-emerald-400">
            <HeartPulse size={14} aria-hidden />
            {snapshot.apiOnline ? t("settings.opsOnline") : t("settings.opsOffline")}
          </div>
        </DataCard>
      </div>
    </Section>
  );
}
