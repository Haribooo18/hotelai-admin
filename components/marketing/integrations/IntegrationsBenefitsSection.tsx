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
          <p className={mktOverlineClass}>{INTEGRATIONS_PAGE_BENEFITS.overline}</p>
          <h2
            id="integrations-benefits-heading"
            className={mktSectionHeadlineClass}
          >
            {INTEGRATIONS_PAGE_BENEFITS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {INTEGRATIONS_PAGE_BENEFITS.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-features-benefits-grid")}>
          {INTEGRATIONS_PAGE_BENEFITS.items.map((benefit) => (
            <li key={benefit.id} className="mkt-features-benefit-card">
              <h3 className="mkt-features-card-title">{benefit.title}</h3>
              <p className="mkt-features-card-description">{benefit.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
