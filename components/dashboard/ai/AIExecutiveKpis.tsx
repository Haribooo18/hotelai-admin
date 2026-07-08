"use client";

import { useMemo } from "react";
import {
  Bot,
  Clock3,
  MessageSquare,
  Percent,
  Sparkles,
  UserRound,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import type { AIOpsKpis } from "./ai-ops-metrics";

type Props = {
  kpis: AIOpsKpis;
  loading?: boolean;
};

export function AIExecutiveKpis({ kpis, loading }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof AIOpsKpis;
      label: string;
      icon: typeof Bot;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
      {
        key: "activeConversations",
        label: t("ai.activeConversations"),
        icon: MessageSquare,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "aiResolvedToday",
        label: t("ai.aiResolvedToday"),
        icon: Bot,
        tone: "success",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "humanTakeoverRate",
        label: t("ai.kpiHumanTakeover"),
        icon: UserRound,
        tone: "warning",
        format: formatPercent,
      },
      {
        key: "avgResponseMinutes",
        label: t("ai.kpiAvgResponseTime"),
        icon: Clock3,
        tone: "default",
        format: (value) => `${Math.round(value)}${t("common.minutes")}`,
      },
      {
        key: "conversionRate",
        label: t("ai.kpiConversionRate"),
        icon: Percent,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "aiSatisfaction",
        label: t("ai.aiAnalysisTitle"),
        icon: Sparkles,
        tone: "success",
        format: formatPercent,
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("ai.kpiAriaLabel")}
      loading={loading}
      count={6}
      gridClassName="sm:grid-cols-2 xl:grid-cols-6"
    >
      {items.map((item, index) => {
        const meta = kpiItems.find((entry) => entry.key === item.key);

        return (
          <KpiCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={item.value}
            format={item.format}
            tone={meta?.tone}
            bordered={index > 0}
          />
        );
      })}
    </ExecutiveKpisPanel>
  );
}
