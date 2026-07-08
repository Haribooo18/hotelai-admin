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

import { KpiCard } from "@/components/ui/data/KpiCard";
import { ExecutiveKpisPanel } from "@/components/dashboard/shared/ExecutiveKpisPanel";
import { formatPercent } from "@/lib/dashboard/format";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import type { SettingsOpsKpis } from "./settings-ops-metrics";

type Props = {
  kpis: SettingsOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof SettingsOpsKpis;
  label: string;
  icon: typeof Bot;
  tone: "default" | "success" | "warning";
  format: (value: number) => string;
}> = [
  {
    key: "aiStatusPercent",
    label: "AI status",
    icon: Bot,
    tone: "success",
    format: formatPercent,
  },
  {
    key: "connectedChannels",
    label: "Channels",
    icon: Plug,
    tone: "default",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "activeAutomations",
    label: "Automations",
    icon: Zap,
    tone: "success",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "knowledgeHealthPercent",
    label: "Knowledge",
    icon: BookOpen,
    tone: "success",
    format: formatPercent,
  },
  {
    key: "lastSyncMinutes",
    label: "Last sync",
    icon: Clock3,
    tone: "default",
    format: (value) => (value < 60 ? `${Math.round(value)}m` : `${Math.round(value / 60)}h`),
  },
  {
    key: "usageToday",
    label: "Usage today",
    icon: Activity,
    tone: "default",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "avgResponseTimeMs",
    label: "Avg response",
    icon: Timer,
    tone: "warning",
    format: (value) => (value > 0 ? `${Math.round(value)}ms` : "—"),
  },
];

export function SettingsExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  return (
    <ExecutiveKpisPanel
      ariaLabel="Settings executive KPIs"
      loading={loading}
      count={7}
      gridClassName="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7"
    >
      {items.map((item, index) => {
        const meta = KPI_ITEMS.find((entry) => entry.key === item.key);

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
