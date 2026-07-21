import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";
import { SECURITY_PAGE_HERO } from "@/lib/marketing/security-page";

export function SecurityPageHero() {
  return (
    <MarketingPageHero
      headingId="security-page-hero-heading"
      overline={SECURITY_PAGE_HERO.overline}
      headline={SECURITY_PAGE_HERO.headline}
      subhead={SECURITY_PAGE_HERO.subhead}
      primaryCta={{
        label: SECURITY_PAGE_HERO.primaryCtaLabel,
        href: SECURITY_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: SECURITY_PAGE_HERO.secondaryCtaLabel,
        href: SECURITY_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.security}
    />
  );
}