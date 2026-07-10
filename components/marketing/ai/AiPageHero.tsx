import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { AI_PAGE_HERO } from "@/lib/marketing/ai-page";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";

export function AiPageHero() {
  return (
    <MarketingPageHero
      headingId="ai-page-hero-heading"
      overline={AI_PAGE_HERO.overline}
      headline={AI_PAGE_HERO.headline}
      subhead={AI_PAGE_HERO.subhead}
      primaryCta={{
        label: AI_PAGE_HERO.primaryCtaLabel,
        href: AI_PAGE_HERO.primaryCtaHref,
      }}
      secondaryCta={{
        label: AI_PAGE_HERO.secondaryCtaLabel,
        href: AI_PAGE_HERO.secondaryCtaHref,
      }}
      preview={MARKETING_PAGE_HERO_PREVIEWS.ai}
      previewPriority
    />
  );
}
