import { PricingFaqAccordion } from "@/components/marketing/pricing/PricingFaqAccordion";
import { PRICING_PAGE_FAQ } from "@/lib/marketing/pricing-page";

export function PricingFaqBlock() {
  return (
    <div id={PRICING_PAGE_FAQ.sectionId} className="mkt-pricing-details-faq">
      <h2 id="pricing-faq-heading" className="mkt-pricing-details-heading">
        {PRICING_PAGE_FAQ.headline}
      </h2>

      <PricingFaqAccordion items={PRICING_PAGE_FAQ.items} />
    </div>
  );
}
