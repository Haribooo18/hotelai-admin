import { PricingPagePlanCard } from "@/components/marketing/pricing/PricingPagePlanCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  PRICING_PAGE_PLANS,
  PRICING_PAGE_PLANS_SECTION,
} from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

export function PricingPlansSection() {
  return (
    <section
      id={PRICING_PAGE_PLANS_SECTION.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="pricing-plans-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PRICING_PAGE_PLANS_SECTION.overline}</p>
          <h2 id="pricing-plans-heading" className={mktSectionHeadlineClass}>
            {PRICING_PAGE_PLANS_SECTION.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {PRICING_PAGE_PLANS_SECTION.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-pricing-grid")}>
          {PRICING_PAGE_PLANS.map((plan) => (
            <PricingPagePlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
