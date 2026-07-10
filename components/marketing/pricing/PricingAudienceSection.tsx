import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { PRICING_PAGE_AUDIENCE } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

export function PricingAudienceSection() {
  return (
    <section
      id={PRICING_PAGE_AUDIENCE.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="pricing-audience-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PRICING_PAGE_AUDIENCE.overline}</p>
          <h2 id="pricing-audience-heading" className={mktSectionHeadlineClass}>
            {PRICING_PAGE_AUDIENCE.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {PRICING_PAGE_AUDIENCE.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-pricing-grid")}>
          {PRICING_PAGE_AUDIENCE.cards.map((card) => (
            <li key={card.id} className="mkt-features-benefit-card">
              <p className="mkt-pricing-audience-plan">{card.planName}</p>
              <h3 className="mkt-features-card-title">{card.audience}</h3>
              <p className="mkt-features-card-description">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
