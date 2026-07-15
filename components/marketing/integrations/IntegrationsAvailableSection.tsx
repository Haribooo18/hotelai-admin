import { IntegrationCard } from "@/components/marketing/integrations/IntegrationCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_AVAILABLE } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

export function IntegrationsAvailableSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_AVAILABLE.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="integrations-available-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{INTEGRATIONS_PAGE_AVAILABLE.overline}</p>
          <h2
            id="integrations-available-heading"
            className={mktSectionHeadlineClass}
          >
            {INTEGRATIONS_PAGE_AVAILABLE.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {INTEGRATIONS_PAGE_AVAILABLE.subhead}
          </p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-integrations-available-grid")}
          aria-label="Integrations"
        >
          {INTEGRATIONS_PAGE_AVAILABLE.items.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </ul>
      </div>
    </section>
  );
}
