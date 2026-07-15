import { Fragment } from "react";

import type { PricingComparisonValue } from "@/lib/marketing/pricing-page";
import { PRICING_PAGE_COMPARISON } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

function ComparisonValue({ value }: { value: PricingComparisonValue }) {
  const label = PRICING_PAGE_COMPARISON.valueLabels[value];

  return (
    <span
      className={cn(
        "mkt-pricing-compare-value",
        value === "included" && "mkt-pricing-compare-value--included",
        value === "dash" && "mkt-pricing-compare-value--dash",
        value === "custom" && "mkt-pricing-compare-value--custom"
      )}
    >
      {value === "included" ? (
        <span aria-label={label}>✓</span>
      ) : (
        label
      )}
    </span>
  );
}

export function PricingComparisonBlock() {
  return (
    <div
      id={PRICING_PAGE_COMPARISON.sectionId}
      className="mkt-pricing-details-compare"
    >
      <h2 id="pricing-comparison-heading" className="mkt-pricing-details-heading">
        {PRICING_PAGE_COMPARISON.headline}
      </h2>

      <div className="mkt-pricing-compare-scroll">
        <table className="mkt-pricing-compare-table">
          <caption className="sr-only">
            Plan comparison for Starter, Pro, and Enterprise
          </caption>
          <colgroup>
            <col className="mkt-pricing-compare-col-label" />
            <col className="mkt-pricing-compare-col-plan" />
            <col className="mkt-pricing-compare-col-plan" />
            <col className="mkt-pricing-compare-col-plan" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Capability</span>
              </th>
              <th scope="col">Starter</th>
              <th scope="col">Pro</th>
              <th scope="col">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_PAGE_COMPARISON.groups.map((group) => (
              <Fragment key={group.id}>
                <tr className="mkt-pricing-compare-section">
                  <th scope="colgroup" colSpan={4}>
                    {group.label}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{row.label}</th>
                    <td>
                      <ComparisonValue value={row.starter} />
                    </td>
                    <td>
                      <ComparisonValue value={row.pro} />
                    </td>
                    <td>
                      <ComparisonValue value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
