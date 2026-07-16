import { PricingComparisonBlock } from "@/components/marketing/pricing/PricingComparisonBlock";
import { PricingFaqBlock } from "@/components/marketing/pricing/PricingFaqBlock";

export function PricingDetailsSection() {
  return (
    <section
      className="mkt-pricing-details"
      aria-label="Plan comparison and pricing FAQ"
    >
      <div className="mkt-pricing-content">
        <PricingComparisonBlock />
        <div className="mkt-pricing-details-divider" aria-hidden />
        <PricingFaqBlock />
      </div>
    </section>
  );
}
