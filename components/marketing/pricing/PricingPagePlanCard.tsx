import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import type { PricingPagePlan } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

type Props = {
  plan: PricingPagePlan;
};

export function PricingPagePlanCard({ plan }: Props) {
  return (
    <article
      className={cn(
        "mkt-pricing-plan-card",
        plan.featured && "mkt-pricing-plan-card--featured"
      )}
    >
      <p
        className={cn(
          "mkt-pricing-plan-badge",
          !plan.badge && "mkt-pricing-plan-badge--empty"
        )}
        aria-hidden={plan.badge ? undefined : true}
      >
        {plan.badge ?? "\u00a0"}
      </p>

      <h3 className="mkt-pricing-plan-card-name">{plan.name}</h3>
      <p className="mkt-pricing-plan-card-desc">{plan.description}</p>

      <div className="mkt-pricing-plan-card-price">
        <span className="mkt-pricing-plan-card-amount">{plan.priceLabel}</span>
        {plan.priceNote ? (
          <span className="mkt-pricing-plan-card-note">{plan.priceNote}</span>
        ) : (
          <span className="mkt-pricing-plan-card-note mkt-pricing-plan-card-note--empty">
            &nbsp;
          </span>
        )}
      </div>

      <ul className="mkt-pricing-plan-card-features">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <MarketingButton
        href={plan.ctaHref}
        variant={plan.featured ? "primary" : "secondary"}
        mobileFull
        className="mkt-pricing-plan-card-cta"
      >
        {plan.ctaLabel}
      </MarketingButton>
    </article>
  );
}
