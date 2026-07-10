import type { PricingComparisonStatus } from "@/lib/marketing/pricing-page";
import { PRICING_PAGE_COMPARISON } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

type Props = {
  status: PricingComparisonStatus;
};

function ComparisonStatusCell({ status }: Props) {
  const label = PRICING_PAGE_COMPARISON.statusLabels[status];

  return (
    <span
      className={cn(
        "mkt-pricing-compare-status",
        status === "included" && "mkt-pricing-compare-included",
        status === "available" && "mkt-pricing-compare-available",
        status === "contact-sales" && "mkt-pricing-compare-contact"
      )}
    >
      {label}
    </span>
  );
}

export function PricingComparisonSection() {
  return (
    <section
      id={PRICING_PAGE_COMPARISON.sectionId}
      className="mkt-features-section"
      aria-labelledby="pricing-comparison-heading"
    >
      <div className="mkt-container-wide">
        <header className="mkt-section-header">
          <p className="mkt-overline">{PRICING_PAGE_COMPARISON.overline}</p>
          <h2 id="pricing-comparison-heading" className="mkt-section-headline">
            {PRICING_PAGE_COMPARISON.headline}
          </h2>
          <p className="mkt-section-subhead">{PRICING_PAGE_COMPARISON.subhead}</p>
        </header>

        <div className={cn("mkt-section-body", "mkt-pricing-compare-wrap")}>
          <table className="mkt-pricing-compare-table">
            <caption className="sr-only">
              Monavel plan feature comparison for Starter, Pro, and Enterprise
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Starter</th>
                <th scope="col">Pro</th>
                <th scope="col">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_PAGE_COMPARISON.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  <td>
                    <ComparisonStatusCell status={row.starter} />
                  </td>
                  <td>
                    <ComparisonStatusCell status={row.pro} />
                  </td>
                  <td>
                    <ComparisonStatusCell status={row.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
