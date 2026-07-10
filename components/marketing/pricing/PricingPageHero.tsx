import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { PRICING_PAGE_HERO } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

export function PricingPageHero() {
  return (
    <section
      className="mkt-features-hero"
      aria-labelledby="pricing-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{PRICING_PAGE_HERO.overline}</p>
        <h1 id="pricing-page-hero-heading" className={mktSectionHeadlineClass}>
          {PRICING_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {PRICING_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={PRICING_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {PRICING_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={PRICING_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {PRICING_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
