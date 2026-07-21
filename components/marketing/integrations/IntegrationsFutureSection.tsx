import { IntegrationCard } from "@/components/marketing/integrations/IntegrationCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_FUTURE } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

export function IntegrationsFutureSection() {
  return (
    <section
      id={INTEGRATIONS_PAGE_FUTURE.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="integrations-future-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {INTEGRATIONS_PAGE_FUTURE.overline}
          </p>

          <h2
            id="integrations-future-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {INTEGRATIONS_PAGE_FUTURE.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {INTEGRATIONS_PAGE_FUTURE.subhead}
          </p>
        </header>

        <ul
          className={cn(
            mktSectionBodyClass,
            "mkt-integrations-future-grid"
          )}
          aria-label="Planned integrations"
        >
          {INTEGRATIONS_PAGE_FUTURE.items.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}