import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_ARCHITECTURE } from "@/lib/marketing/integrations-page";

export function IntegrationsArchitectureSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="integrations-architecture-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {INTEGRATIONS_PAGE_ARCHITECTURE.overline}
          </p>
          <h2
            id="integrations-architecture-heading"
            className={mktSectionHeadlineClass}
          >
            {INTEGRATIONS_PAGE_ARCHITECTURE.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {INTEGRATIONS_PAGE_ARCHITECTURE.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol
            className="mkt-features-workflow mkt-integrations-architecture-flow"
            aria-label="Integration architecture overview"
          >
            {INTEGRATIONS_PAGE_ARCHITECTURE.steps.map((step, index) => (
              <li key={step.id} className="mkt-features-workflow-step">
                <span className="mkt-features-workflow-node">{step.label}</span>
                {index < INTEGRATIONS_PAGE_ARCHITECTURE.steps.length - 1 ? (
                  <>
                    <ArrowRight
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-horizontal"
                      aria-hidden
                    />
                    <ArrowDown
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-vertical"
                      aria-hidden
                    />
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
