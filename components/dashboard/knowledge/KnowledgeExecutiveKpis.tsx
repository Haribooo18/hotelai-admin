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

import {
  AnimatedMetric,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

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
    format: (v) => `${Math.round(v)}%`,
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
    format: (v) => `${Math.round(v)}%`,
  },
  {
    key: "aiUsageToday",
    label: "AI usage today",
    icon: Bot,
    format: (v) => String(Math.round(v)),
  },
];

export function KnowledgeExecutiveKpis({ kpis, loading }: Props) {
  if (loading) {
    return (
      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-20" />
              <DashboardSkeletonBlock className="h-7 w-14" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>
    );
  }

  return (
    <DashboardGlassPanel className="overflow-hidden p-[var(--ds-surface-padding)]">
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {KPI_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const value = kpis[item.key];

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-2 transition-[transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                index > 0 && "2xl:border-l 2xl:border-[var(--shell-border)]/60"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
                  <Icon size={15} />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                  {item.label}
                </p>
              </div>
              <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                <AnimatedMetric value={value} formatter={item.format} />
              </p>
            </div>
          );
        })}
      </div>
    </DashboardGlassPanel>
  );
}
