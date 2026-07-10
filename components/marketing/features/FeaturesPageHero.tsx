import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_PAGE_HERO } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesPageHero() {
  return (
    <section className="mkt-features-hero" aria-labelledby="features-hero-heading">
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{FEATURES_PAGE_HERO.overline}</p>
        <h1 id="features-hero-heading" className={mktSectionHeadlineClass}>
          {FEATURES_PAGE_HERO.headline}
          <span className="block text-[var(--mkt-accent)]">
            {FEATURES_PAGE_HERO.headlineAccent}
          </span>
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {FEATURES_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={FEATURES_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {FEATURES_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={FEATURES_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {FEATURES_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
