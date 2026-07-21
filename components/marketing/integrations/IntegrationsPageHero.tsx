import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { INTEGRATIONS_PAGE_HERO } from "@/lib/marketing/integrations-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function IntegrationsPageHero() {
  return (
    <MarketingPageHero
      headingId="integrations-page-hero-heading"
      overline={INTEGRATIONS_PAGE_HERO.overline}
      headline={INTEGRATIONS_PAGE_HERO.headline}
      subhead={INTEGRATIONS_PAGE_HERO.subhead}
      primaryCta={{
        label: INTEGRATIONS_PAGE_HERO.primaryCtaLabel,
        href: INTEGRATIONS_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: INTEGRATIONS_PAGE_HERO.secondaryCtaLabel,
        href: INTEGRATIONS_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.integrations}
    />
  );
}