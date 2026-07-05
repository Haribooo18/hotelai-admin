"use client";

import { Lightbulb } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import type { RevenueInsight } from "./revenue-metrics";

type Props = {
  insights: RevenueInsight[];
  loading?: boolean;
};

export function RevenueInsights({ insights, loading = false }: Props) {
  if (loading) {
    return (
      <Section title="Insights" subtitle="Automated observations from booking data">
        <DataCard title="Loading insights">
          <SkeletonGroup />
        </DataCard>
      </Section>
    );
  }

  return (
    <Section title="Insights" subtitle="Automated observations from booking data">
      <DataCard
        interactive
        className={cn(motionPresets.transitionBase, motionPresets.hover.surfaceLift)}
      >
        {insights.length === 0 ? (
          <EmptyState
            title="Insights unavailable"
            description="Insights generate once enough booking data is available."
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
