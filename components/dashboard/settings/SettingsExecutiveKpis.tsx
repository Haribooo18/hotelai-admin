"use client";

import {
  Activity,
  BookOpen,
  Bot,
  Clock3,
  Plug,
  Timer,
  Zap,
} from "lucide-react";

import { ExecutiveKpisGrid } from "@/components/dashboard/shared/ExecutiveKpisGrid";
import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";
import { formatPercent } from "@/lib/dashboard/format";

import type { SettingsOpsKpis } from "./settings-ops-metrics";

type Props = {
  kpis: SettingsOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof SettingsOpsKpis;
  label: string;
  icon: typeof Bot;
  format: (value: number) => string;
}> = [
  {
    key: "aiStatusPercent",
    label: "Статус AI",
    icon: Bot,
    format: formatPercent,
  },
  {
    key: "connectedChannels",
    label: "Каналы",
    icon: Plug,
    format: (v) => String(Math.round(v)),
  },
  {
    key: "activeAutomations",
    label: "Автоматизации",
    icon: Zap,
    format: (v) => String(Math.round(v)),
  },
  {
    key: "knowledgeHealthPercent",
    label: "База знаний",
    icon: BookOpen,
    format: formatPercent,
  },
  {
    key: "lastSyncMinutes",
    label: "Синхронизация",
    icon: Clock3,
    format: (v) => (v < 60 ? `${v}м` : `${Math.round(v / 60)}ч`),
  },
  {
    key: "usageToday",
    label: "Использование",
    icon: Activity,
    format: (v) => String(Math.round(v)),
  },
  {
    key: "avgResponseTimeMs",
    label: "Ср. ответ",
    icon: Timer,
    format: (v) => (v > 0 ? `${Math.round(v)}мс` : "—"),
  },
];

export function SettingsExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisGrid
      items={items}
      loading={loading}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7"
      borderFrom="2xl"
      skeletonCount={7}
    />
  );
}
