import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import type { ProductPresentationPreset } from "@/lib/marketing/product-presentation";

export type MarketingPageHeroPreview = {
  workspace: PlatformWorkspaceId;
  presentation: ProductPresentationPreset;
};

export const MARKETING_PAGE_HERO_PREVIEWS = {
  features: { workspace: "dashboard", presentation: "featuresHero" },
  ai: { workspace: "reception-ai", presentation: "aiHero" },
  pricing: { workspace: "revenue", presentation: "pricingHero" },
  contact: { workspace: "reception-ai", presentation: "aiHero" },
  demo: { workspace: "dashboard", presentation: "demoHero" },
  security: { workspace: "dashboard", presentation: "securityHero" },
  integrations: { workspace: "reception-ai", presentation: "integrationsHero" },
  about: { workspace: "calendar", presentation: "aboutHero" },
  docs: { workspace: "knowledge", presentation: "docsHero" },
} as const satisfies Record<string, MarketingPageHeroPreview>;
