import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { ABOUT_PAGE_HERO } from "@/lib/marketing/about-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function AboutPageHero() {
  return (
    <MarketingPageHero
      headingId="about-page-hero-heading"
      overline={ABOUT_PAGE_HERO.overline}
      headline={ABOUT_PAGE_HERO.headline}
      subhead={ABOUT_PAGE_HERO.subhead}
      primaryCta={{
        label: ABOUT_PAGE_HERO.primaryCtaLabel,
        href: ABOUT_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: ABOUT_PAGE_HERO.secondaryCtaLabel,
        href: ABOUT_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.about}
    />
  );
}
