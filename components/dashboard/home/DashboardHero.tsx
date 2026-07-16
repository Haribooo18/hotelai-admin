"use client";

import { useSyncExternalStore } from "react";
import { AlertTriangle, DoorOpen, Percent, Sparkles } from "lucide-react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { Badge } from "@/components/ui/display/Badge";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { formatAdminWeekdayDate } from "@/lib/dashboard/format";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import type { TranslationPath } from "@/lib/i18n/translations";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { DashboardHeroInsight, HeroExecutiveStatus } from "./dashboard-insights";
import { formatDashboardPercent } from "./dashboard-metrics";

type Props = {
  hotelName: string;
  insight: DashboardHeroInsight;
  status: HeroExecutiveStatus;
};

function resolveGreetingKey(): TranslationPath {
  const hour = new Date().getHours();
  if (hour < 12) return "dashboard.hero.greetingMorning";
  if (hour < 18) return "dashboard.hero.greetingAfternoon";
  return "dashboard.hero.greetingEvening";
}

function resolveHealthTone(
  healthKey: TranslationPath
): "success" | "warning" | "danger" {
  if (healthKey === "dashboard.hero.healthGood") return "success";
  if (healthKey === "dashboard.hero.healthCritical") return "danger";
  return "warning";
}

export function DashboardHero({ hotelName, insight, status }: Props) {
  const { locale, t } = useI18n();

  const todayLabel = useSyncExternalStore(
    () => () => {},
    () => formatAdminWeekdayDate(new Date(), locale),
    () => ""
  );

  const greeting = useSyncExternalStore(
    () => () => {},
    () =>
      formatTranslation(t(resolveGreetingKey()), {
        hotel: hotelName,
      }),
    () => hotelName
  );

  const healthTone = resolveHealthTone(status.hotelHealthKey);

  return (
    <MotionReveal order={1}>
      <GlassSurface
        interactive
        className={cn(
          cardPaddingClass,
          "overflow-hidden rounded-[var(--ds-radius-workspace)] p-6 md:p-8"
        )}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="space-y-2">
              <p className="ds-caption text-[var(--shell-muted)]">{todayLabel}</p>
              <h1 className="ds-display text-[clamp(1.625rem,2.8vw,2.125rem)] leading-tight">
                {greeting}
              </h1>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--ds-radius-button)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                  <Sparkles size={16} aria-hidden />
                </div>
                <p className="ds-section-title">
                  {t("dashboard.hero.executiveBrief")}
                </p>
                {insight.isPlaceholder ? (
                  <Badge variant="outline" className="uppercase">
                    {t("dashboard.hero.placeholderBadge")}
                  </Badge>
                ) : null}
              </div>

              <p className="max-w-2xl ds-body text-[15px] leading-relaxed text-[var(--shell-text)]">
                {formatTranslation(
                  t(insight.headlineKey),
                  Object.fromEntries(
                    Object.entries(insight.headlineParams ?? {}).map(
                      ([key, value]) => [key, String(value)]
                    )
                  )
                )}
              </p>

              <div className="space-y-2 border-t border-[var(--shell-border)]/25 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-accent)]">
                  {t("dashboard.hero.recommended")}
                </p>
                <p className="ds-body text-[var(--shell-nav-text)]">
                  {formatTranslation(
                    t(insight.recommendationKey),
                    Object.fromEntries(
                      Object.entries(insight.recommendationParams ?? {}).map(
                        ([key, value]) => [key, String(value)]
                      )
                    )
                  )}
                </p>
              </div>

              {insight.revenueImpact ? (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--shell-muted)]">
                    {t("dashboard.hero.estimatedRevenue")}
                  </p>
                  <p className="ds-kpi text-[clamp(1.375rem,2vw,1.625rem)] text-[var(--shell-accent)]">
                    +{insight.revenueImpact}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside
            className="w-full shrink-0 lg:w-[min(100%,320px)]"
            aria-label={t("dashboard.hero.statusTitle")}
          >
            <div className="flex h-full flex-col rounded-[var(--ds-radius-card)] border border-[var(--shell-border)]/35 bg-[var(--shell-surface-raised)]/50 p-5 md:p-6">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
                {t("dashboard.hero.statusTitle")}
              </p>

              <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6">
                <StatusMetric
                  icon={Percent}
                  label={t("dashboard.hero.statusOccupancy")}
                  value={formatDashboardPercent(status.occupancyPercent)}
                  tone="default"
                />
                <StatusMetric
                  icon={DoorOpen}
                  label={t("dashboard.hero.statusArrivals")}
                  value={String(status.arrivalsToday)}
                  tone={status.arrivalsToday > 0 ? "success" : "default"}
                />
                <div className="col-span-2 space-y-2 border-t border-[var(--shell-border)]/20 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--shell-muted)]">
                      {t("dashboard.hero.statusHealth")}
                    </p>
                    <StatusDot tone={healthTone} />
                  </div>
                  <p
                    className={cn(
                      "text-[15px] font-semibold",
                      healthTone === "success" && "text-emerald-400",
                      healthTone === "warning" && "text-amber-400",
                      healthTone === "danger" && "text-red-400"
                    )}
                  >
                    {t(status.hotelHealthKey)}
                  </p>
                </div>
                <div className="col-span-2 space-y-2 border-t border-[var(--shell-border)]/20 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--shell-muted)]">
                      {t("dashboard.hero.statusCritical")}
                    </p>
                    <StatusDot
                      tone={status.criticalIssues > 0 ? "warning" : "default"}
                      pulse={status.criticalIssues > 0}
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <AlertTriangle
                      size={14}
                      aria-hidden
                      className={cn(
                        "shrink-0",
                        status.criticalIssues > 0
                          ? "text-amber-400"
                          : "text-[var(--shell-muted)]"
                      )}
                    />
                    <p className="ds-kpi text-[1.5rem]">{status.criticalIssues}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </GlassSurface>
    </MotionReveal>
  );
}

function StatusMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Percent;
  label: string;
  value: string;
  tone: "default" | "success";
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--shell-muted)]">
          {label}
        </p>
        <Icon size={13} aria-hidden className="text-[var(--shell-muted)]" />
      </div>
      <div className="flex items-baseline gap-2">
        <p className="ds-kpi text-[1.5rem]">{value}</p>
        <StatusDot tone={tone === "success" ? "success" : "default"} />
      </div>
    </div>
  );
}
