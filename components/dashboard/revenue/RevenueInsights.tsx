"use client";

import { Lightbulb } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { motionPresets } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { RevenueInsight } from "./revenue-metrics";

type Props = {
  insights: RevenueInsight[];
  loading?: boolean;
};

export function RevenueInsights({ insights, loading = false }: Props) {
  const { t } = useI18n();

  if (loading) {
    return (
      <Section
        title={t("revenue.insightsTitle")}
        subtitle={t("revenue.insightsSubtitle")}
      >
        <DataCard title={t("revenue.insightsLoading")}>
          <SkeletonGroup />
        </DataCard>
      </Section>
    );
  }

  return (
    <Section
      title={t("revenue.insightsTitle")}
      subtitle={t("revenue.insightsSubtitle")}
    >
      <DataCard
        interactive
        className={cn(motionPresets.transitionBase, motionPresets.hover.surfaceLift)}
      >
        {insights.length === 0 ? (
          <WorkspaceEmptyState
            title={t("revenue.insightsUnavailable")}
            description={t("revenue.insightsUnavailableDesc")}
            icon={<Lightbulb size={18} />}
          />
        ) : (
          <ul className="grid gap-2 md:grid-cols-2" role="list">
            {insights.map((insight) => (
              <li
                key={insight.id}
                role="listitem"
                className={cn(
                  "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2.5 text-[13px] text-[var(--shell-text)]",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-surface-raised)]"
                )}
              >
                {insight.text}
              </li>
            ))}
          </ul>
        )}
      </DataCard>
    </Section>
  );
}
