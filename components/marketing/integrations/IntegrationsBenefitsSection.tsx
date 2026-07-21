import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_BENEFITS } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

export function IntegrationsBenefitsSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_BENEFITS.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="integrations-benefits-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {INTEGRATIONS_PAGE_BENEFITS.overline}
          </p>

          <h2
            id="integrations-benefits-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {INTEGRATIONS_PAGE_BENEFITS.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {INTEGRATIONS_PAGE_BENEFITS.subhead}
          </p>
        </header>

        <ul
          className={cn(
            mktSectionBodyClass,
            "mkt-integrations-benefits-grid"
          )}
          aria-label="Integration benefits"
        >
          {INTEGRATIONS_PAGE_BENEFITS.items.map((benefit, index) => (
            <li
              key={benefit.id}
              className="mkt-features-benefit-card"
            >
              <div className="mkt-integrations-benefit-header">
                <span className="mkt-integrations-benefit-eyebrow">
                  Benefit
                </span>

                <span
                  className="mkt-integrations-benefit-index"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mkt-integrations-benefit-title">
                {benefit.title}
              </h3>

              <p className="mkt-integrations-benefit-description">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}