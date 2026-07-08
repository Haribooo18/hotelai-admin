"use client";

import { useMemo } from "react";
import {
  BookOpen,
  Bot,
  Clock3,
  FileText,
  FolderOpen,
  Sparkles,
  Star,
} from "lucide-react";

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import type { KnowledgeOpsKpis } from "./knowledge-ops-metrics";

type Props = {
  kpis: KnowledgeOpsKpis;
  loading?: boolean;
};

export function KnowledgeExecutiveKpis({ kpis, loading }: Props) {
  const { t } = useI18n();

  const kpiItems = useMemo(
    (): Array<{
      key: keyof KnowledgeOpsKpis;
      label: string;
      icon: typeof BookOpen;
      tone: "default" | "success" | "warning";
      format: (value: number) => string;
    }> => [
      {
        key: "totalArticles",
        label: t("knowledge.kpiArticles"),
        icon: BookOpen,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "published",
        label: t("knowledge.kpiPublished"),
        icon: Sparkles,
        tone: "success",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "drafts",
        label: t("knowledge.kpiDrafts"),
        icon: FileText,
        tone: "warning",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "categories",
        label: t("knowledge.kpiCategories"),
        icon: FolderOpen,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
      {
        key: "aiCoveragePercent",
        label: t("knowledge.kpiAiCoverage"),
        icon: Bot,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "lastSyncMinutes",
        label: t("knowledge.kpiLastSync"),
        icon: Clock3,
        tone: "default",
        format: (value) =>
          value < 60 ? `${Math.round(value)}m` : `${Math.round(value / 60)}h`,
      },
      {
        key: "avgQuality",
        label: t("knowledge.kpiAvgQuality"),
        icon: Star,
        tone: "success",
        format: formatPercent,
      },
      {
        key: "aiUsageToday",
        label: t("knowledge.kpiAiUsageToday"),
        icon: Bot,
        tone: "default",
        format: (value) => String(Math.round(value)),
      },
    ],
    [t]
  );

  const items = useExecutiveKpiItems(kpis, kpiItems);

  return (
    <ExecutiveKpisPanel
      ariaLabel={t("knowledge.kpiAriaLabel")}
      loading={loading}
      count={8}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
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
