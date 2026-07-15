/**
 * Marketing design system class helpers.
 * Tokens live in `app/globals.css` under `[data-surface="marketing"]`.
 *
 * Typography scale (use tokens / these classes — avoid one-off font sizes):
 * display → h1 → h2 → h3 → h4 → body-lg → body → small → caption / overline
 */

export const mktContainerClass = "mkt-container";
export const mktContainerWideClass = "mkt-container-wide";
export const mktHeroClass = "mkt-hero";
export const mktHeroGridClass = "mkt-hero-grid";
export const mktHeroCopyClass = "mkt-hero-copy";
export const mktHeroVisualClass = "mkt-hero-visual";
export const mktHeroHeadlineClass = "mkt-hero-headline";
export const mktHeroSubheadClass = "mkt-hero-subhead";
export const mktHeroActionsClass = "mkt-hero-actions";
export const mktHeroTrustClass = "mkt-hero-trust";
export const mktProductShowcaseLandingClass = "mkt-product-showcase--landing";
export const mktOverlineClass = "mkt-overline";
export const mktDisplayClass = "mkt-display";
export const mktSubheadClass = "mkt-subhead";
export const mktCaptionClass = "mkt-caption";
export const mktTrustLineClass = "mkt-trust-line";
export const mktTypeH3Class = "mkt-type-h3";
export const mktTypeH4Class = "mkt-type-h4";
export const mktTypeBodyLgClass = "mkt-type-body-lg";
export const mktTypeBodyClass = "mkt-type-body";
export const mktTypeSmallClass = "mkt-type-small";
export const mktTypeMetricClass = "mkt-type-metric";
export const mktTypeMetricLabelClass = "mkt-type-metric-label";
export const mktMotionRevealClass = "mkt-motion-reveal";
export const mktSectionHeaderCenteredClass = "mkt-section-header--centered";
export const mktSectionHeaderWideClass = "mkt-section-header--wide";
export const mktSectionHeaderSplitClass = "mkt-section-header--split";
export const mktProductShowcaseUnifiedClass = "mkt-product-showcase--unified";
export const mktProductHaloClass = "mkt-product-halo";
export const mktPlatformHeadlineClass = "mkt-platform-headline";
export const mktPlatformSectionClass = "mkt-platform-section";
export const mktSectionHeaderClass = "mkt-section-header";
export const mktSectionHeadlineClass = "mkt-section-headline";
export const mktSectionSubheadClass = "mkt-section-subhead";
export const mktSectionBodyClass = "mkt-section-body";
export const mktPageHeroHeadlineClass = "mkt-page-hero-headline";
export const mktPageHeroSubheadClass = "mkt-page-hero-subhead";
export const mktSplitSectionClass = "mkt-split-section";
export const mktSplitSectionReverseClass = "mkt-split-section-reverse";
export const mktSplitSectionVisualEmphasisClass =
  "mkt-split-section--visual-emphasis";
export const mktSplitSectionCopyCompactClass = "mkt-split-section-copy--compact";
export const mktProductShowcaseClass = "mkt-product-showcase";
export const mktNavLogoClass = "mkt-nav-logo";
export const mktNavLogoMarkClass = "mkt-nav-logo-mark";
export const mktNavLogoNameClass = "mkt-nav-logo-name";
export const mktBrandLockupClass = "mkt-brand-lockup";
export const mktBrandNameClass = "mkt-brand-name";
export const mktNavLinksClass = "mkt-nav-links";
export const mktNavLinkClass = "mkt-nav-link";
export const mktNavActionsClass = "mkt-nav-actions";

/** Canonical marketing type scale token names (defined in globals.css). */
export const MKT_TYPE_TOKENS = [
  "--mkt-type-display",
  "--mkt-type-h1",
  "--mkt-type-h2",
  "--mkt-type-h3",
  "--mkt-type-h4",
  "--mkt-type-body-lg",
  "--mkt-type-body",
  "--mkt-type-small",
  "--mkt-type-caption",
  "--mkt-type-overline",
  "--mkt-type-metric",
  "--mkt-type-metric-label",
] as const;

/** Canonical marketing spacing scale (8–96px). */
export const MKT_SPACE_TOKENS = [
  "--mkt-space-1",
  "--mkt-space-2",
  "--mkt-space-3",
  "--mkt-space-4",
  "--mkt-space-5",
  "--mkt-space-6",
  "--mkt-space-7",
  "--mkt-space-8",
] as const;

/** Semantic spacing aliases used by sections and stacks. */
export const MKT_SPACE_SEMANTIC_TOKENS = [
  "--mkt-section-y-tight",
  "--mkt-section-y",
  "--mkt-section-y-loose",
  "--mkt-section-y-close",
  "--mkt-section-gap",
  "--mkt-section-header-gap",
  "--mkt-gap",
  "--mkt-gap-lg",
  "--mkt-card-padding",
  "--mkt-card-padding-sm",
  "--mkt-card-padding-xs",
  "--mkt-stack-xs",
  "--mkt-stack-sm",
  "--mkt-stack-md",
  "--mkt-stack-lg",
  "--mkt-stack-xl",
] as const;

/** Shared marketing component surface tokens (cards, buttons, badges, status). */
export const MKT_COMPONENT_TOKENS = [
  "--mkt-card-radius",
  "--mkt-card-border",
  "--mkt-card-border-quiet",
  "--mkt-card-bg",
  "--mkt-card-shadow",
  "--mkt-card-hover-border",
  "--mkt-card-transition",
  "--mkt-btn-height",
  "--mkt-btn-height-sm",
  "--mkt-btn-radius",
  "--mkt-btn-padding-x",
  "--mkt-btn-gap",
  "--mkt-badge-height",
  "--mkt-badge-radius",
  "--mkt-badge-padding-x",
  "--mkt-status-dot-size",
  "--mkt-status-gap",
  "--mkt-status-success",
  "--mkt-status-error",
  "--mkt-list-bullet-size",
  "--mkt-list-indent",
  "--mkt-accordion-radius",
  "--mkt-accordion-border",
  "--mkt-chat-bubble-radius",
  "--mkt-chat-bubble-padding",
] as const;

/** Design-token families for radius, elevation, opacity, motion, z-index. */
export const MKT_RADIUS_TOKENS = [
  "--mkt-radius-xs",
  "--mkt-radius-sm",
  "--mkt-radius-md",
  "--mkt-radius-lg",
  "--mkt-radius-xl",
  "--mkt-radius-2xl",
  "--mkt-radius-full",
  "--mkt-radius-circle",
  "--mkt-radius-none",
] as const;

export const MKT_ELEVATION_TOKENS = [
  "--mkt-elevation-flat",
  "--mkt-elevation-raised",
  "--mkt-elevation-floating",
  "--mkt-elevation-overlay",
  "--mkt-elevation-glow",
  "--mkt-focus-ring",
] as const;

export const MKT_OPACITY_TOKENS = [
  "--mkt-opacity-0",
  "--mkt-opacity-35",
  "--mkt-opacity-disabled",
  "--mkt-opacity-muted",
  "--mkt-opacity-hover",
  "--mkt-opacity-pressed",
  "--mkt-opacity-100",
] as const;

export const MKT_MOTION_TOKENS = [
  "--mkt-duration-instant",
  "--mkt-duration-micro",
  "--mkt-duration-fast",
  "--mkt-duration",
  "--mkt-duration-slow",
  "--mkt-duration-cycle",
  "--mkt-ease",
  "--mkt-ease-out",
  "--mkt-motion-reveal-y",
  "--mkt-motion-hover-y",
  "--mkt-motion-btn-hover-y",
  "--mkt-motion-stagger",
] as const;

export const MKT_Z_TOKENS = [
  "--mkt-z-base",
  "--mkt-z-raised",
  "--mkt-z-float",
  "--mkt-z-dropdown",
  "--mkt-z-overlay",
  "--mkt-z-popover",
  "--mkt-z-skip",
] as const;