export type ProductShowcaseSize = "hero" | "section" | "compact";

export type ProductScreenshotCrop = {
  objectPosition: string;
};

export const PRODUCT_CROP_PRESETS = {
  dashboardOverview: { objectPosition: "0% 0%" },
  dashboardAdmin: { objectPosition: "58% 0%" },
  receptionInbox: { objectPosition: "0% 0%" },
  receptionChannels: { objectPosition: "22% 0%" },
  revenueDashboard: { objectPosition: "0% 6%" },
  calendarTimeline: { objectPosition: "0% 12%" },
  knowledgeArticles: { objectPosition: "0% 0%" },
  bookingsOperations: { objectPosition: "0% 0%" },
} as const satisfies Record<string, ProductScreenshotCrop>;

export type ProductPresentationPreset =
  | "landingHero"
  | "featuresHero"
  | "aiHero"
  | "pricingHero"
  | "demoHero"
  | "securityHero"
  | "integrationsHero"
  | "aboutHero"
  | "docsHero"
  | "featuresPlatform"
  | "aiWorkflow"
  | "demoPreview"
  | "demoProcess"
  | "securityArchitecture"
  | "integrationsArchitecture"
  | "aboutRoadmap"
  | "platformShowcase"
  | "aiExperience";

export type ProductPresentation = {
  size: ProductShowcaseSize;
  crop: ProductScreenshotCrop;
  emphasis?: boolean;
  overlap?: boolean;
};

export const PRODUCT_PRESENTATIONS: Record<
  ProductPresentationPreset,
  ProductPresentation
> = {
  landingHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.receptionInbox,
    emphasis: true,
  },
  featuresHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.dashboardOverview,
    emphasis: true,
    overlap: true,
  },
  aiHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.receptionInbox,
    emphasis: true,
  },
  pricingHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.revenueDashboard,
    emphasis: true,
  },
  demoHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.dashboardOverview,
    emphasis: true,
  },
  securityHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.dashboardAdmin,
    emphasis: true,
  },
  integrationsHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.receptionChannels,
    emphasis: true,
    overlap: true,
  },
  aboutHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.calendarTimeline,
    emphasis: true,
  },
  docsHero: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.knowledgeArticles,
    emphasis: true,
  },
  featuresPlatform: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.dashboardOverview,
    emphasis: true,
  },
  aiWorkflow: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.receptionInbox,
  },
  demoPreview: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.dashboardOverview,
    emphasis: true,
  },
  demoProcess: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.bookingsOperations,
  },
  securityArchitecture: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.dashboardAdmin,
  },
  integrationsArchitecture: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.receptionChannels,
    emphasis: true,
  },
  aboutRoadmap: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.calendarTimeline,
  },
  platformShowcase: {
    size: "hero",
    crop: PRODUCT_CROP_PRESETS.dashboardOverview,
    emphasis: true,
  },
  aiExperience: {
    size: "section",
    crop: PRODUCT_CROP_PRESETS.receptionInbox,
  },
};

export function getProductPresentation(
  preset: ProductPresentationPreset
): ProductPresentation {
  return PRODUCT_PRESENTATIONS[preset];
}

export const mktProductShowcaseClass = "mkt-product-showcase";
export const mktProductShowcaseEmphasisClass = "mkt-product-showcase--emphasis";
export const mktProductShowcaseOverlapClass = "mkt-product-showcase--overlap";
export const mktSplitSectionVisualEmphasisClass =
  "mkt-split-section--visual-emphasis";
export const mktSplitSectionCopyCompactClass = "mkt-split-section-copy--compact";
