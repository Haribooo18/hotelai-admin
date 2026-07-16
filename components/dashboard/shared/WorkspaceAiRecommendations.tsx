"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { Section } from "@/components/ui/primitives/Section";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { useI18n } from "@/lib/i18n";

import { AIRecommendationCard } from "./AIRecommendationCard";
import type { AiRecommendation } from "./ai-recommendation-types";
import { useSetWorkspaceAiPresence } from "./WorkspaceAiPresence";

type Props = {
  recommendations: AiRecommendation[];
  className?: string;
};

export function WorkspaceAiRecommendations({
  recommendations,
  className,
}: Props) {
  const { t } = useI18n();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const setPresence = useSetWorkspaceAiPresence();

  const visible = useMemo(
    () => recommendations.filter((item) => !dismissedIds.includes(item.id)),
    [recommendations, dismissedIds]
  );

  const pendingCount = useMemo(
    () => visible.filter((item) => item.priority === "high").length,
    [visible]
  );

  useEffect(() => {
    const status =
      pendingCount > 0
        ? "pending"
        : visible.length > 0
          ? "attention"
          : "healthy";

    setPresence({
      recommendationCount: visible.length,
      pendingCount,
      status,
    });

    return () => setPresence(null);
  }, [visible.length, pendingCount, setPresence]);

  function handleDismiss(id: string) {
    setDismissedIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  if (visible.length === 0) {
    return (
      <div className={className}>
        <Section
          title={t("ai.recommendations.sectionTitle")}
          subtitle={t("ai.recommendations.sectionSubtitle")}
        />
        <WorkspaceEmptyState
          title={t("ai.recommendations.emptyTitle")}
          description={t("ai.recommendations.emptyDescription")}
          guidance={t("ai.recommendations.emptyGuidance")}
          icon={<Sparkles size={18} />}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Section
        title={t("ai.recommendations.sectionTitle")}
        subtitle={t("ai.recommendations.sectionSubtitle")}
      />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {visible.map((recommendation) => (
          <AIRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}
