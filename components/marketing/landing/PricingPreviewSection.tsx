import { PricingPreviewCard } from "@/components/marketing/landing/PricingPreviewCard";
import { PricingPreviewFaq } from "@/components/marketing/landing/PricingPreviewFaq";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  PRICING_PREVIEW_CONTENT,
  PRICING_PREVIEW_PLANS,
} from "@/lib/marketing/pricing-preview";
import { cn } from "@/lib/utils";

export function PricingPreviewSection() {
  return (
    <section
      id={PRICING_PREVIEW_CONTENT.sectionId}
      className="mkt-pricing-preview-section"
      aria-labelledby="pricing-preview-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PRICING_PREVIEW_CONTENT.overline}</p>
          <h2
            id="pricing-preview-heading"
            className={mktSectionHeadlineClass}
          >
            {PRICING_PREVIEW_CONTENT.headline}
            <span className="block text-[var(--mkt-accent)]">
              {PRICING_PREVIEW_CONTENT.headlineAccent}
            </span>
          </h2>
          <p className={mktSectionSubheadClass}>
            {PRICING_PREVIEW_CONTENT.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-pricing-grid")}>
          {PRICING_PREVIEW_PLANS.map((plan) => (
            <PricingPreviewCard key={plan.id} plan={plan} />
          ))}
        </div>

        <PricingPreviewFaq />
      </div>
    </section>
  );
}
