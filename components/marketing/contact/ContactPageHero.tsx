import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_HERO } from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

export function ContactPageHero() {
  return (
    <section
      className="mkt-features-hero"
      aria-labelledby="contact-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <p className={mktOverlineClass}>{CONTACT_PAGE_HERO.overline}</p>
        <h1 id="contact-page-hero-heading" className={mktSectionHeadlineClass}>
          {CONTACT_PAGE_HERO.headline}
        </h1>
        <p className={cn(mktSectionSubheadClass, "max-w-2xl")}>
          {CONTACT_PAGE_HERO.subhead}
        </p>

        <div className="mkt-features-hero-actions">
          <MarketingButton
            href={CONTACT_PAGE_HERO.primaryCtaHref}
            variant="primary"
            mobileFull
          >
            {CONTACT_PAGE_HERO.primaryCtaLabel}
          </MarketingButton>
          <MarketingButton
            href={CONTACT_PAGE_HERO.secondaryCtaHref}
            variant="secondary"
            mobileFull
          >
            {CONTACT_PAGE_HERO.secondaryCtaLabel}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
