"use client";

import { AlertTriangle, CheckCircle2, History, HeartPulse } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { cn } from "@/lib/utils";
import { motionPresets } from "@/lib/design/motion";

import type { SettingsOperationsSnapshot } from "./settings-ops-metrics";
import { SettingsDetailRow } from "./settings-ui";

type Props = {
  snapshot: SettingsOperationsSnapshot;
  loading?: boolean;
};

export function SettingsOperations({ snapshot, loading = false }: Props) {
  const warnings = snapshot.diagnostics.filter((item) => !item.ok);
  const recommendations = snapshot.diagnostics
    .filter((item) => !item.ok)
    .map((item) => `Review ${item.label.toLowerCase()}: ${item.value}`);

  if (loading) {
    return (
      <Section title="Operations" subtitle="Recent changes, warnings, and system health">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DataCard key={index} title="Loading">
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="Operations"
      subtitle="Recent changes, warnings, recommendations, and system health"
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <DataCard interactive title="Recent changes" subtitle="Latest settings activity">
          {snapshot.recentActivity.length === 0 ? (
            <EmptyState
              title="No recent changes"
              description="Configuration events will appear here."
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
                    [{log.level}] ·{" "}
                    {new Date(log.created_at).toLocaleString("ru-RU")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DataCard>

        <DataCard interactive title="Warnings" subtitle="Issues requiring attention">
          {warnings.length === 0 ? (
            <EmptyState
              title="No warnings"
              description="All diagnostics are within expected thresholds."
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

        <DataCard interactive title="Recommendations" subtitle="Suggested next steps">
          {recommendations.length === 0 ? (
            <EmptyState
              title="No recommendations"
              description="Your workspace configuration looks healthy."
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

        <DataCard interactive title="System health" subtitle="Runtime environment">
          <dl className="grid gap-2">
            <SettingsDetailRow label="Version" value={snapshot.version} />
            <SettingsDetailRow label="Environment" value={snapshot.environment} />
            <SettingsDetailRow
              label="API status"
              value={snapshot.apiOnline ? "Online" : "Offline"}
            />
          </dl>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
            <HeartPulse size={14} aria-hidden />
            {snapshot.apiOnline
              ? "Core services are reachable."
              : "Configure provider credentials to restore service health."}
          </div>
        </DataCard>
      </div>
    </Section>
  );
}
