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
      <h3 className="mkt-pricing-plan-name">{plan.name}</h3>
      <p className="mkt-pricing-description">{plan.audience}</p>

      <ul className="mkt-pricing-maturity">
        {plan.points.map((point) => (
          <li key={point}>{point}</li>
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
