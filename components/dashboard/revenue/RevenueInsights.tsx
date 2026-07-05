import { Bot, Sparkles } from "lucide-react";

import {
  DashboardEmptyState,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import type { RevenueInsight } from "./revenue-metrics";

type Props = {
  insights: RevenueInsight[];
};

export function RevenueInsights({ insights }: Props) {
  return (
    <DashboardSurface glass className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-500/10 text-emerald-500">
          <Bot size={18} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
            AI Financial Summary
          </h2>
          <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
            Automated financial insights
          </p>
        </div>
      </div>

      {insights.length === 0 ? (
        <DashboardEmptyState
          title="Insights unavailable"
          description="Once enough booking data is available, AI will generate a financial summary."
          icon={<Sparkles size={20} />}
        />
      ) : (
        <ul className="space-y-3">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="rounded-[14px] bg-[var(--shell-nav-hover-bg)]/60 px-4 py-3 text-[14px] text-[var(--shell-text)] transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-hover-bg)]"
            >
              • {insight.text}
            </li>
          ))}
        </ul>
      )}
    </DashboardSurface>
  );
}
