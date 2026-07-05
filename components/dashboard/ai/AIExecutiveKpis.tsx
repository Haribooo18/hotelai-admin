"use client";

import {
  Bot,
  Clock3,
  MessageSquare,
  Percent,
  Sparkles,
  UserRound,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import type { AIOpsKpis } from "./ai-ops-metrics";

type Props = {
  kpis: AIOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof AIOpsKpis;
  label: string;
  icon: typeof Bot;
  format: (value: number) => string;
}> = [
  {
    key: "activeConversations",
    label: "Active conversations",
    icon: MessageSquare,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "aiResolvedToday",
    label: "AI resolved today",
    icon: Bot,
    format: (value) => String(Math.round(value)),
  },
  {
    key: "humanTakeoverRate",
    label: "Human takeover rate",
    icon: UserRound,
    format: formatPercent,
  },
  {
    key: "avgResponseMinutes",
    label: "Avg response time",
    icon: Clock3,
    format: (value) => `${Math.round(value)}m`,
  },
  {
    key: "conversionRate",
    label: "Conversion rate",
    icon: Percent,
    format: formatPercent,
  },
  {
    key: "aiSatisfaction",
    label: "AI satisfaction",
    icon: Sparkles,
    format: formatPercent,
  },
];

export function AIExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-6"
      skeletonCount={6}
      skeletonLabelClassName="h-3 w-24"
    />
  );
}
