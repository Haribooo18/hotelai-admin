import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_HERO } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

export function IntegrationsPageHero() {
  return (
    <section
      className="mkt-features-hero"
      aria-labelledby="integrations-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{INTEGRATIONS_PAGE_HERO.overline}</p>
        <h1
          id="integrations-page-hero-heading"
          className={mktSectionHeadlineClass}
        >
          {INTEGRATIONS_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {INTEGRATIONS_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={INTEGRATIONS_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {INTEGRATIONS_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={INTEGRATIONS_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {INTEGRATIONS_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
