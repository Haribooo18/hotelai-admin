import { mktMotionRevealClass } from "@/lib/marketing/design";
import { PRICING_PAGE_HERO } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

export function PricingPageHero() {
  return (
    <section
      className="mkt-pricing-hero"
      aria-labelledby="pricing-page-hero-heading"
    >
      <div className="mkt-pricing-content">
        <div className="mkt-pricing-hero-inner">
          <h1
            id="pricing-page-hero-heading"
            className={cn("mkt-pricing-hero-headline", mktMotionRevealClass)}
            data-order="0"
          >
            {PRICING_PAGE_HERO.headline}
          </h1>

          <p
            className={cn("mkt-pricing-hero-lead", mktMotionRevealClass)}
            data-order="1"
          >
            {PRICING_PAGE_HERO.lead}
          </p>
        </div>
      </div>
    </section>
  );
}
