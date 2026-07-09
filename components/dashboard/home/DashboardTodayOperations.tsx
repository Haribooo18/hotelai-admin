"use client";

import Link from "next/link";
import {
  Brush,
  CreditCard,
  DoorClosed,
  DoorOpen,
  MessageSquare,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { TodayOperationMetric } from "./dashboard-insights";

type Props = {
  items: TodayOperationMetric[];
};

const ICONS: Record<string, LucideIcon> = {
  arrivals: DoorOpen,
  departures: DoorClosed,
  housekeeping: Brush,
  maintenance: Wrench,
  messages: MessageSquare,
  payments: CreditCard,
};

function resolveDotTone(
  tone: TodayOperationMetric["tone"]
): "default" | "warning" | "danger" {
  if (tone === "urgent") return "danger";
  if (tone === "warning") return "warning";
  return "default";
}

export function DashboardTodayOperations({ items }: Props) {
  const { t } = useI18n();

  return (
    <MotionReveal order={4}>
      <GlassSurface
        interactive
        className={cn(cardPaddingClass, "overflow-hidden p-6 md:p-7")}
      >
        <div className="mb-6 space-y-1">
          <h2 className="ds-section-title">{t("dashboard.todayOps.title")}</h2>
          <p className="ds-caption text-[var(--shell-muted)]">
            {t("dashboard.todayOps.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const Icon = ICONS[item.key] ?? DoorOpen;
            const dotTone = resolveDotTone(item.tone);
            const content = (
              <div
                className={cn(
                  "flex flex-col gap-3 rounded-[var(--ds-radius-card)] border border-[var(--shell-border)]/30 bg-[var(--shell-surface-raised)]/35 px-5 py-5",
                  motionPresets.transitionBase,
                  item.href &&
                    "hover:border-[var(--shell-border)]/50 hover:bg-[var(--shell-surface-raised)]/55"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="ds-kpi text-[clamp(1.75rem,3vw,2.25rem)] leading-none">
                    {item.value}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Icon
                      size={14}
                      aria-hidden
                      className="text-[var(--shell-muted)] opacity-60"
                    />
                    <StatusDot
                      tone={dotTone}
                      pulse={item.tone === "urgent" && item.value > 0}
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
                    {t(item.label)}
                  </p>
                  <p className="ds-caption text-[var(--shell-muted)]/80">
                    {t("dashboard.todayOps.today")}
                  </p>
                </div>
              </div>
            );

            if (!item.href) {
              return <div key={item.key}>{content}</div>;
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className="block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] rounded-[var(--ds-radius-card)]"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </GlassSurface>
    </MotionReveal>
  );
}
