import { PricingPagePlanCard } from "@/components/marketing/pricing/PricingPagePlanCard";
import {
  PRICING_PAGE_PLANS,
  PRICING_PAGE_PLANS_SECTION,
} from "@/lib/marketing/pricing-page";

export function PricingPlansSection() {
  return (
    <section
      id={PRICING_PAGE_PLANS_SECTION.sectionId}
      className="mkt-pricing-plans"
      aria-label={PRICING_PAGE_PLANS_SECTION.ariaLabel}
    >
      <div className="mkt-pricing-content">
        <div className="mkt-pricing-plans-grid">
          {PRICING_PAGE_PLANS.map((plan) => (
            <PricingPagePlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
