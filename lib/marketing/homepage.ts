/**
 * Single source of truth for the marketing homepage composition.
 * The homepage route must only render these sections, in this order.
 */
export const MARKETING_HOMEPAGE_SECTIONS = [
  "HeroSection",
  "WhyHotelsNeedSection",
  "WhoIsMonavelForSection",
  "HowMonavelWorksSection",
  "OperationalScenarioSection",
  "BusinessOutcomesSection",
  "PlatformShowcaseSection",
  "AIExperienceSection",
  "PricingPreviewSection",
  "TrustSection",
  "HomepageFaqSection",
  "FinalCtaSection",
] as const;

export type MarketingHomepageSection =
  (typeof MARKETING_HOMEPAGE_SECTIONS)[number];
