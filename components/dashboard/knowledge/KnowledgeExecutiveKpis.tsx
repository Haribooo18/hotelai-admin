"use client";

import {
  BookOpen,
  Bot,
  Clock3,
  FileText,
  FolderOpen,
  Sparkles,
  Star,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import type { KnowledgeOpsKpis } from "./knowledge-ops-metrics";

type Props = {
  kpis: KnowledgeOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof KnowledgeOpsKpis;
  label: string;
  icon: typeof BookOpen;
  format: (value: number) => string;
}> = [
  { key: "totalArticles", label: "Articles", icon: BookOpen, format: (v) => String(v) },
  { key: "published", label: "Published", icon: Sparkles, format: (v) => String(v) },
  { key: "drafts", label: "Drafts", icon: FileText, format: (v) => String(v) },
  { key: "categories", label: "Categories", icon: FolderOpen, format: (v) => String(v) },
  {
    key: "aiCoveragePercent",
    label: "AI coverage",
    icon: Bot,
    format: formatPercent,
  },
  {
    key: "lastSyncMinutes",
    label: "Last sync",
    icon: Clock3,
    format: (v) => (v < 60 ? `${v}m` : `${Math.round(v / 60)}h`),
  },
  {
    key: "avgQuality",
    label: "Avg quality",
    icon: Star,
    format: formatPercent,
  },
  {
    key: "aiUsageToday",
    label: "AI usage today",
    icon: Bot,
    format: (v) => String(Math.round(v)),
  },
];

export function KnowledgeExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
      borderFrom="2xl"
      skeletonCount={8}
    />
  );
}
