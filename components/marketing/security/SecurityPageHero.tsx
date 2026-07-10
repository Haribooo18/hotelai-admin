import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_HERO } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityPageHero() {
  return (
    <section
      className="mkt-features-hero"
      aria-labelledby="security-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{SECURITY_PAGE_HERO.overline}</p>
        <h1 id="security-page-hero-heading" className={mktSectionHeadlineClass}>
          {SECURITY_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {SECURITY_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={SECURITY_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {SECURITY_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={SECURITY_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {SECURITY_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
