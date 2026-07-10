import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";
import { PRICING_PAGE_HERO } from "@/lib/marketing/pricing-page";

export function PricingPageHero() {
  return (
    <MarketingPageHero
      headingId="pricing-page-hero-heading"
      overline={PRICING_PAGE_HERO.overline}
      headline={PRICING_PAGE_HERO.headline}
      subhead={PRICING_PAGE_HERO.subhead}
      primaryCta={{
        label: PRICING_PAGE_HERO.primaryCtaLabel,
        href: PRICING_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: PRICING_PAGE_HERO.secondaryCtaLabel,
        href: PRICING_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.pricing}
      previewPriority
    />
  );
}
