"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/display/Badge";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { AiRecommendation, AiRecommendationPriority } from "./ai-recommendation-types";

type Props = {
  recommendation: AiRecommendation;
  onDismiss?: (id: string) => void;
  className?: string;
};

const PRIORITY_VARIANT: Record<
  AiRecommendationPriority,
  "outline" | "secondary" | "default"
> = {
  low: "outline",
  medium: "secondary",
  high: "default",
};

const PRIORITY_LABEL_KEY = {
  low: "ai.recommendations.priorityLow",
  medium: "ai.recommendations.priorityMedium",
  high: "ai.recommendations.priorityHigh",
} as const;

function formatField(
  key: AiRecommendation["titleKey"],
  params: Record<string, string | number> | undefined,
  t: (key: AiRecommendation["titleKey"]) => string
): string {
  return formatTranslation(
    t(key),
    Object.fromEntries(
      Object.entries(params ?? {}).map(([name, value]) => [name, String(value)])
    )
  );
}

export function AIRecommendationCard({
  recommendation,
  onDismiss,
  className,
}: Props) {
  const { t } = useI18n();

  const title = formatField(
    recommendation.titleKey,
    recommendation.titleParams,
    t
  );
  const recommendationText = formatField(
    recommendation.recommendationKey,
    recommendation.recommendationParams,
    t
  );
  const why = formatField(recommendation.whyKey, recommendation.whyParams, t);
  const impact = formatField(
    recommendation.impactKey,
    recommendation.impactParams,
    t
  );
  const expectedImpact = recommendation.expectedImpactKey
    ? formatField(
        recommendation.expectedImpactKey,
        recommendation.expectedImpactParams,
        t
      )
    : null;

  return (
    <GlassSurface
      interactive
      className={cn(cardPaddingClass, "space-y-4", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
            <Sparkles size={13} aria-hidden />
          </div>
          <h3 className="min-w-0 text-[14px] font-semibold text-[var(--shell-text)]">
            {title}
          </h3>
          <Badge variant={PRIORITY_VARIANT[recommendation.priority]}>
            {t(PRIORITY_LABEL_KEY[recommendation.priority])}
          </Badge>
          {recommendation.isPlaceholder ? (
            <Badge variant="outline" className="uppercase">
              {t("ai.recommendations.sampleBadge")}
            </Badge>
          ) : null}
        </div>
        {onDismiss ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 shrink-0 p-0"
            aria-label={t("ai.recommendations.dismiss")}
            onClick={() => onDismiss(recommendation.id)}
          >
            <X size={14} aria-hidden />
          </Button>
        ) : null}
      </div>

      <p className="text-[13px] font-medium leading-relaxed text-[var(--shell-text)]">
        {recommendationText}
      </p>

      <div className="grid gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/45 px-3.5 py-3 sm:grid-cols-3">
        <div className="space-y-1">
          <p className="ds-overline">{t("ai.recommendations.why")}</p>
          <p className="text-[12px] leading-relaxed text-[var(--shell-nav-text)]">
            {why}
          </p>
        </div>
        <div className="space-y-1">
          <p className="ds-overline">{t("ai.recommendations.impact")}</p>
          <p className="text-[12px] leading-relaxed text-[var(--shell-nav-text)]">
            {impact}
          </p>
        </div>
        <div className="space-y-1">
          <p className="ds-overline">{t("ai.recommendations.confidence")}</p>
          <p className="text-[15px] font-semibold text-[var(--shell-accent)]">
            {recommendation.confidencePercent}%
          </p>
        </div>
      </div>

      {expectedImpact ? (
        <p className="text-[12px] text-[var(--shell-muted)]">
          <span className="font-medium text-[var(--shell-text)]">
            {t("ai.recommendations.expectedRevenue")}:
          </span>{" "}
          {expectedImpact}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {recommendation.primaryAction.href ? (
          <Link
            href={recommendation.primaryAction.href}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            {t(recommendation.primaryAction.labelKey)}
          </Link>
        ) : (
          <Button type="button" className="gap-1.5">
            {t(recommendation.primaryAction.labelKey)}
          </Button>
        )}

        {recommendation.secondaryAction ? (
          recommendation.secondaryAction.dismiss ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onDismiss?.(recommendation.id)}
            >
              {t(recommendation.secondaryAction.labelKey)}
            </Button>
          ) : recommendation.secondaryAction.href ? (
            <Link
              href={recommendation.secondaryAction.href}
              className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
            >
              {t(recommendation.secondaryAction.labelKey)}
            </Link>
          ) : (
            <Button type="button" variant="outline">
              {t(recommendation.secondaryAction.labelKey)}
            </Button>
          )
        ) : null}
      </div>
    </GlassSurface>
  );
}
