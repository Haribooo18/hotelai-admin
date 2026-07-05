"use client";

import Link from "next/link";
import { AlertTriangle, Bell, Info } from "lucide-react";

import type { DashboardAlert } from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";
import { cn } from "@/lib/utils";

type Props = {
  alerts: DashboardAlert[];
  loading: boolean;
};

const SEVERITY_META = {
  urgent: {
    icon: AlertTriangle,
    accent: "text-red-400 bg-red-500/10",
    dot: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    accent: "text-amber-400 bg-amber-500/10",
    dot: "bg-amber-400",
  },
  info: {
    icon: Info,
    accent: "text-sky-400 bg-sky-500/10",
    dot: "bg-sky-400",
  },
} as const;

export function DashboardAlerts({ alerts, loading }: Props) {
  return (
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Important alerts"
        subtitle="Operational signals that need attention"
      />

      {loading ? (
        <DashboardSkeleton />
      ) : alerts.length === 0 ? (
        <DashboardEmptyState
          title="All clear"
          description="No urgent items right now. Alerts will surface when action is needed."
          icon={<Bell size={18} />}
        />
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const meta = SEVERITY_META[alert.severity];
            const Icon = meta.icon;
            const content = (
              <div className="flex items-start gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-sm)]">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)]",
                    meta.accent
                  )}
                >
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)}
                    />
                    <p className="text-[13px] font-medium text-[var(--shell-text)]">
                      {alert.title}
                    </p>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--shell-muted)]">
                    {alert.description}
                  </p>
                </div>
              </div>
            );

            return alert.href ? (
              <Link key={alert.id} href={alert.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={alert.id}>{content}</div>
            );
          })}
        </div>
      )}
    </DashboardSurface>
  );
}
