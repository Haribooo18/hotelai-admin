import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_HERO } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoPageHero() {
  return (
    <section
      className="mkt-features-hero"
      aria-labelledby="demo-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{DEMO_PAGE_HERO.overline}</p>
        <h1 id="demo-page-hero-heading" className={mktSectionHeadlineClass}>
          {DEMO_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {DEMO_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={DEMO_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {DEMO_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={DEMO_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {DEMO_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
