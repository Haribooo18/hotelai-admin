import {
  PRICING_DEPLOYMENT_STRIP,
  PRICING_PREVIEW_CONTENT,
} from "@/lib/marketing/pricing-preview";

export function PricingImplementationStrip() {
  return (
    <div className="mkt-pricing-implementation">
      <p className="mkt-pricing-implementation-label">
        {PRICING_PREVIEW_CONTENT.deploymentLabel}
      </p>
      <ul
        className="mkt-pricing-implementation-list"
        aria-label="Deployment guarantees"
      >
        {PRICING_DEPLOYMENT_STRIP.map((item) => (
          <li key={item} className="mkt-pricing-implementation-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
