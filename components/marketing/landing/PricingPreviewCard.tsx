import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import type { PricingPreviewPlan } from "@/lib/marketing/pricing-preview";
import { cn } from "@/lib/utils";

type Props = {
  plan: PricingPreviewPlan;
};

export function PricingPreviewCard({ plan }: Props) {
  return (
    <article
      className={cn(
        "mkt-pricing-card",
        plan.featured && "mkt-pricing-card-featured"
      )}
    >
      {plan.featured ? (
        <p className="mkt-pricing-badge">Most popular</p>
      ) : null}

      <h3 className="mkt-pricing-plan-name">{plan.name}</h3>
      <p className="mkt-pricing-description">{plan.description}</p>

      <div className="mkt-pricing-price-row">
        <p className="mkt-pricing-price">{plan.priceLabel}</p>
        {plan.priceNote ? (
          <p className="mkt-pricing-price-note">{plan.priceNote}</p>
        ) : null}
      </div>

      <ul className="mkt-pricing-features">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <MarketingButton
        href={plan.ctaHref}
        variant={plan.featured ? "primary" : "secondary"}
        mobileFull
        className="mt-auto"
      >
        {plan.ctaLabel}
      </MarketingButton>
    </article>
  );
}
