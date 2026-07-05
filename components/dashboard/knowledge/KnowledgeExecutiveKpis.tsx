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

import { Metric } from "@/components/ui/display/Metric";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/dashboard/format";

import { useExecutiveKpiItems } from "@/components/dashboard/shared/useExecutiveKpiItems";

import type { KnowledgeOpsKpis } from "./knowledge-ops-metrics";

type Props = {
  kpis: KnowledgeOpsKpis;
  loading?: boolean;
};

const KPI_ITEMS: Array<{
  key: keyof KnowledgeOpsKpis;
  label: string;
  icon: typeof BookOpen;
  tone: "default" | "success" | "warning";
  format: (value: number) => string;
}> = [
  {
    key: "totalArticles",
    label: "Articles",
    icon: BookOpen,
    tone: "default",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "published",
    label: "Published",
    icon: Sparkles,
    tone: "success",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "drafts",
    label: "Drafts",
    icon: FileText,
    tone: "warning",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "categories",
    label: "Categories",
    icon: FolderOpen,
    tone: "default",
    format: (value) => String(Math.round(value)),
  },
  {
    key: "aiCoveragePercent",
    label: "AI coverage",
    icon: Bot,
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
    key: "avgQuality",
    label: "Avg quality",
    icon: Star,
    tone: "success",
    format: formatPercent,
  },
  {
    key: "aiUsageToday",
    label: "AI usage today",
    icon: Bot,
    tone: "default",
    format: (value) => String(Math.round(value)),
  },
];

export function KnowledgeExecutiveKpis({ kpis, loading }: Props) {
  const items = useExecutiveKpiItems(kpis, KPI_ITEMS);

  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
    );
  }

  const borderClass = "xl:border-l xl:border-[var(--shell-border)]/60";

  return (
    <GlassSurface
      interactive
      className="overflow-hidden p-[var(--ds-surface-padding)]"
      aria-label="Knowledge executive KPIs"
    >
      <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {items.map((item, index) => {
          const meta = KPI_ITEMS.find((entry) => entry.key === item.key);
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className={cn(
                "group px-3 py-3",
                motionPresets.transitionBase,
                motionPresets.hover.surfaceLift,
                index > 0 && borderClass
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]">
                    <Icon size={15} aria-hidden />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                    {item.label}
                  </p>
                </div>
                <StatusDot
                  tone={
                    meta?.tone === "warning"
                      ? "warning"
                      : meta?.tone === "success"
                        ? "success"
                        : "default"
                  }
                />
              </div>
              <p className="mt-2.5 text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]">
                <Metric value={item.value} formatter={item.format} />
              </p>
            </div>
          );
        })}
      </div>
    </GlassSurface>
  );
}
