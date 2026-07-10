import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_GUEST_COMMUNICATION } from "@/lib/marketing/integrations-page";

export function IntegrationsGuestCommunicationSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_GUEST_COMMUNICATION.sectionId}
      className="mkt-features-section"
      aria-labelledby="integrations-guest-communication-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.overline}
          </p>
          <h2
            id="integrations-guest-communication-heading"
            className={mktSectionHeadlineClass}
          >
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol
            className="mkt-features-workflow mkt-integrations-workflow"
            aria-label="Guest communication workflow"
          >
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.steps.map((step, index) => (
              <li key={step.id} className="mkt-features-workflow-step">
                <span className="mkt-features-workflow-node">{step.label}</span>
                {index < INTEGRATIONS_PAGE_GUEST_COMMUNICATION.steps.length - 1 ? (
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
