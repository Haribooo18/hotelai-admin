import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { DEMO_PAGE_HERO } from "@/lib/marketing/demo-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function DemoPageHero() {
  return (
    <MarketingPageHero
      headingId="demo-page-hero-heading"
      overline={DEMO_PAGE_HERO.overline}
      headline={DEMO_PAGE_HERO.headline}
      subhead={DEMO_PAGE_HERO.subhead}
      primaryCta={{
        label: DEMO_PAGE_HERO.primaryCtaLabel,
        href: DEMO_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: DEMO_PAGE_HERO.secondaryCtaLabel,
        href: DEMO_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.demo}
      previewPriority
    />
  );
}
