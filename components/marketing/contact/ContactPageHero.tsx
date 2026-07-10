import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { CONTACT_PAGE_HERO } from "@/lib/marketing/contact-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function ContactPageHero() {
  return (
    <MarketingPageHero
      headingId="contact-page-hero-heading"
      overline={CONTACT_PAGE_HERO.overline}
      headline={CONTACT_PAGE_HERO.headline}
      subhead={CONTACT_PAGE_HERO.subhead}
      primaryCta={{
        label: CONTACT_PAGE_HERO.primaryCtaLabel,
        href: CONTACT_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: CONTACT_PAGE_HERO.secondaryCtaLabel,
        href: CONTACT_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.contact}
    />
  );
}
