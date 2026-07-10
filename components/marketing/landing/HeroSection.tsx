import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import { ProductBrowserFrame } from "@/components/marketing/landing/ProductBrowserFrame";
import {
  mktDisplayClass,
  mktHeroClass,
  mktMotionRevealClass,
  mktOverlineClass,
  mktSubheadClass,
  mktTrustLineClass,
} from "@/lib/marketing/design";
import { HERO_CONTENT } from "@/lib/marketing/hero";
import { MARKETING_CTA } from "@/lib/marketing/routes";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className={cn("mkt-hero", mktHeroClass)} aria-labelledby="hero-heading">
      <div className="mkt-container-wide">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className={cn(mktOverlineClass, mktMotionRevealClass)} data-order="0">
              {HERO_CONTENT.overline}
            </p>

            <h1
              id="hero-heading"
              className={cn(mktDisplayClass, "mt-4", mktMotionRevealClass)}
              data-order="1"
            >
              {HERO_CONTENT.headline}
            </h1>

            <p className="sr-only">{HERO_CONTENT.screenReaderSummary}</p>

            <p
              className={cn(mktSubheadClass, "mt-6", mktMotionRevealClass)}
              data-order="2"
            >
              {HERO_CONTENT.subhead}
            </p>

            <div
              className={cn(
                "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
                mktMotionRevealClass
              )}
              data-order="3"
            >
              <MarketingButton
                href={MARKETING_CTA.trial}
                variant="primary"
                mobileFull
              >
                {HERO_CONTENT.primaryCta}
              </MarketingButton>
              <MarketingButton
                href={MARKETING_CTA.demo}
                variant="secondary"
                mobileFull
              >
                {HERO_CONTENT.secondaryCta}
              </MarketingButton>
            </div>

            <p
              className={cn(mktTrustLineClass, "mt-6", mktMotionRevealClass)}
              data-order="4"
            >
              {HERO_CONTENT.trustLine}
            </p>
          </div>

          <div
            className={cn(
              "relative lg:col-span-7 lg:mt-2",
              mktMotionRevealClass
            )}
            data-order="5"
          >
            <ProductBrowserFrame className="mkt-product-showcase mkt-product-showcase--hero mkt-product-showcase--emphasis" />
          </div>
        </div>
      </div>

      <div
        id={HERO_CONTENT.skipLinkTarget}
        className="sr-only"
        tabIndex={-1}
      >
        Обзор платформы
      </div>
    </section>
  );
}
