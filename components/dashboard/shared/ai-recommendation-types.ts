import type { TranslationPath } from "@/lib/i18n/translations";

export type AiRecommendationPriority = "low" | "medium" | "high";

export type AiRecommendationAction = {
  labelKey: TranslationPath;
  href?: string;
  dismiss?: boolean;
};

export type AiRecommendation = {
  id: string;
  priority: AiRecommendationPriority;
  isPlaceholder?: boolean;
  titleKey: TranslationPath;
  titleParams?: Record<string, string | number>;
  recommendationKey: TranslationPath;
  recommendationParams?: Record<string, string | number>;
  whyKey: TranslationPath;
  whyParams?: Record<string, string | number>;
  impactKey: TranslationPath;
  impactParams?: Record<string, string | number>;
  expectedImpactKey?: TranslationPath;
  expectedImpactParams?: Record<string, string | number>;
  confidencePercent: number;
  primaryAction: AiRecommendationAction;
  secondaryAction?: AiRecommendationAction;
};

export type WorkspaceAiPresenceState = {
  recommendationCount: number;
  pendingCount: number;
  status: "healthy" | "attention" | "pending";
};
