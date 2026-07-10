import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_HERO } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiPageHero() {
  return (
    <section className="mkt-features-hero" aria-labelledby="ai-page-hero-heading">
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{AI_PAGE_HERO.overline}</p>
        <h1 id="ai-page-hero-heading" className={mktSectionHeadlineClass}>
          {AI_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {AI_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={AI_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {AI_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={AI_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {AI_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
