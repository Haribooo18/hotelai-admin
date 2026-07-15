import { ArchitectureDiagramV2 } from "@/components/marketing/ArchitectureDiagramV2";
import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktHeroActionsClass,
  mktHeroClass,
  mktHeroCopyClass,
  mktHeroGridClass,
  mktHeroHeadlineClass,
  mktHeroSubheadClass,
  mktHeroVisualClass,
  mktMotionRevealClass,
  mktOverlineClass,
} from "@/lib/marketing/design";
import { HERO_CONTENT } from "@/lib/marketing/hero";
import { MARKETING_CTA } from "@/lib/marketing/routes";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className={mktHeroClass} aria-labelledby="hero-heading">
      <div className="mkt-container-wide">
        <div className={cn(mktHeroGridClass, "mkt-hero-grid--concept")}>
          <div className={mktHeroCopyClass}>
            <p
              className={cn(mktOverlineClass, mktMotionRevealClass)}
              data-order="0"
            >
              {HERO_CONTENT.overline}
            </p>

            <h1
              id="hero-heading"
              className={cn(mktHeroHeadlineClass, mktMotionRevealClass)}
              data-order="1"
            >
              {HERO_CONTENT.headline}

              <span className="mkt-hero-headline-accent">
                {HERO_CONTENT.headlineAccent}
              </span>
            </h1>

            <p className="sr-only">
              {HERO_CONTENT.screenReaderSummary}
            </p>

            <p
              className={cn(mktHeroSubheadClass, mktMotionRevealClass)}
              data-order="2"
            >
              {HERO_CONTENT.supportingCopy}
            </p>

            <div
              className={cn(mktHeroActionsClass, mktMotionRevealClass)}
              data-order="3"
            >
              <MarketingButton
                href={MARKETING_CTA.trial}
                variant="primary"
                size="hero"
                mobileFull
              >
                {HERO_CONTENT.primaryCta}
              </MarketingButton>

              <MarketingButton
                href={MARKETING_CTA.demo}
                variant="secondary"
                size="hero"
                mobileFull
              >
                {HERO_CONTENT.secondaryCta}
              </MarketingButton>
            </div>

            <ul
              className={cn(
                "mkt-hero-benefits",
                mktMotionRevealClass
              )}
              data-order="4"
            >
              {HERO_CONTENT.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              mktHeroVisualClass,
              "mkt-hero-visual--diagram",
              mktMotionRevealClass
            )}
            data-order="5"
          >
            <div className="mkt-hero-visual-float">
              <ArchitectureDiagramV2 />
            </div>
          </div>
        </div>
      </div>

      <div
        id={HERO_CONTENT.skipLinkTarget}
        className="sr-only"
        tabIndex={-1}
      >
        Why hotels need Monavel
      </div>
    </section>
  );
}