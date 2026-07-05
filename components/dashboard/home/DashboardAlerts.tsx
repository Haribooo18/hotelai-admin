"use client";

import Link from "next/link";
import { AlertTriangle, Bell, Info } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { Surface } from "@/components/ui/primitives/Surface";
import { Section } from "@/components/ui/primitives/Section";
import { cn } from "@/lib/utils";

import type { DashboardAlert } from "./dashboard-metrics";
import { DashboardListItem, matchesDashboardSearch } from "./dashboard-ui";

type Props = {
  alerts: DashboardAlert[];
  loading: boolean;
  searchQuery?: string;
};

const SEVERITY_META = {
  urgent: {
    icon: AlertTriangle,
    accent: "text-red-400 bg-red-500/10",
    tone: "danger" as const,
  },
  warning: {
    icon: AlertTriangle,
    accent: "text-amber-400 bg-amber-500/10",
    tone: "warning" as const,
  },
  info: {
    icon: Info,
    accent: "text-sky-400 bg-sky-500/10",
    tone: "default" as const,
  },
} as const;

export function DashboardAlerts({
  alerts,
  loading,
  searchQuery = "",
}: Props) {
  const filteredAlerts = alerts.filter((alert) =>
    matchesDashboardSearch(searchQuery, [alert.title, alert.description])
  );

  return (
    <Surface interactive className="overflow-hidden p-[var(--ds-surface-padding)]">
      <Section
        title="Important alerts"
        subtitle="Operational signals that need attention"
      />

      {loading ? (
        <SkeletonGroup />
      ) : filteredAlerts.length === 0 ? (
        <EmptyState
          title="All clear"
          description="No urgent items right now. Alerts will surface when action is needed."
          icon={<Bell size={18} />}
        />
      ) : (
        <div className="space-y-2" role="list" aria-label="Important alerts">
          {filteredAlerts.map((alert) => {
            const meta = SEVERITY_META[alert.severity];
            const Icon = meta.icon;
            const content = (
              <DashboardListItem className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)]",
                    meta.accent
                  )}
                >
                  <Icon size={15} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusDot tone={meta.tone} />
                    <p className="text-[13px] font-medium text-[var(--shell-text)]">
                      {alert.title}
                    </p>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--shell-muted)]">
                    {alert.description}
                  </p>
                </div>
              </DashboardListItem>
            );

            return alert.href ? (
              <Link
                key={alert.id}
                href={alert.href}
                className="block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
              >
                {content}
              </Link>
            ) : (
              <div key={alert.id}>{content}</div>
            );
          })}
        </div>
      )}
    </Surface>
  );
}
