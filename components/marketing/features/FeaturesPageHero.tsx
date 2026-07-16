import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { FEATURES_PAGE_HERO } from "@/lib/marketing/features-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function FeaturesPageHero() {
  return (
    <MarketingPageHero
      headingId="features-hero-heading"
      overline={FEATURES_PAGE_HERO.overline}
      headline={FEATURES_PAGE_HERO.headline}
      headlineAccent={FEATURES_PAGE_HERO.headlineAccent}
      subhead={FEATURES_PAGE_HERO.subhead}
      primaryCta={{
        label: FEATURES_PAGE_HERO.primaryCtaLabel,
        href: FEATURES_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: FEATURES_PAGE_HERO.secondaryCtaLabel,
        href: FEATURES_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.features}
      previewPriority
    />
  );
}
