"use client";

import { Bot } from "lucide-react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { Badge } from "@/components/ui/display/Badge";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { DashboardAiInsight } from "./dashboard-insights";

type Props = {
  insight: DashboardAiInsight;
};

export function DashboardAiInsights({ insight }: Props) {
  const { t } = useI18n();

  return (
    <MotionReveal order={3}>
      <GlassSurface
        interactive
        className={cn(cardPaddingClass, "overflow-hidden p-6 md:p-7")}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h2 className="ds-section-title">{t("dashboard.aiInsights.title")}</h2>
            <p className="ds-caption text-[var(--shell-muted)]">
              {t("dashboard.aiInsights.subtitle")}
            </p>
          </div>
          {insight.isPlaceholder ? (
            <Badge variant="outline" className="shrink-0 uppercase">
              {t("dashboard.hero.placeholderBadge")}
            </Badge>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
              <Bot size={16} aria-hidden />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
              {t("dashboard.aiInsights.summary")}
            </p>
            <p className="ds-body text-[15px] leading-relaxed text-[var(--shell-text)]">
              {t(insight.headlineKey)}
            </p>
          </section>

          <div className="h-px bg-[var(--shell-border)]/20" />

          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-accent)]">
              {t("dashboard.aiInsights.recommended")}
            </p>
            <ul className="space-y-2.5">
              {insight.recommendationKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 ds-body text-[var(--shell-nav-text)]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[var(--shell-accent)]"
                  />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="h-px bg-[var(--shell-border)]/20" />

          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <section className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
                {t("dashboard.aiInsights.expectedImpact")}
              </p>
              <ul className="space-y-2">
                {insight.impactKeys.map((key) => (
                  <li
                    key={key}
                    className="ds-caption text-[var(--shell-nav-text)]"
                  >
                    {t(key)}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-1.5 sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]">
                {t("dashboard.aiInsights.confidence")}
              </p>
              <p className="ds-kpi text-[1.375rem] text-[var(--shell-accent)]">
                {insight.confidencePercent}%
              </p>
              <p className="ds-caption text-[var(--shell-muted)]">
                {formatTranslation(t("dashboard.aiInsights.confidenceModel"), {
                  percent: String(insight.confidencePercent),
                })}
              </p>
            </section>
          </div>
        </div>
      </GlassSurface>
    </MotionReveal>
  );
}
