/**
 * Single source of truth for the marketing homepage composition.
 * The homepage route must only render these sections, in this order.
 */
export const MARKETING_HOMEPAGE_SECTIONS = [
  "HeroSection",
  "WhyHotelsNeedSection",
  "HowMonavelWorksSection",
  "PlatformShowcaseSection",
  "PricingPreviewSection",
  "TrustSection",
  "HomepageFaqSection",
  "FinalCtaSection",
] as const;

export type MarketingHomepageSection =
  (typeof MARKETING_HOMEPAGE_SECTIONS)[number];
